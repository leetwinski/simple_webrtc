import * as actions from "./actions.js"

const PeerConnection = window.RTCPeerConnection ||
                       window.mozRTCPeerConnection ||
                       window.webkitRTCPeerConnection;

export default class ServerlessConnection {
    
    constructor(appStore) {
        this.appStore = appStore;
        this.pc = null;
        this.streams = [];

        try {
            this.pc = new PeerConnection(null);

            this.pc.oniceconnectionstatechange = console.log
            this.pc.onconnectionstatechange = console.log
            this.pc.onpeeridentity = console.log
        } catch (err) {
            console.error(err)
        }
    }

    dispatchConnected(isConnected) {
        this.appStore.dispatch(actions.uiPlayerConnected(isConnected));
    }

    * getTracks() {
        for (let s of this.streams) {
            yield * s.getTracks()
        }
    }

    clearStreams() {
        [...this.getTracks()].forEach(t => t.stop())

        this.streams = [];
    }

    disconnect() {
        this.clearStreams();
        
        if (this.pc) {
            try {
                this.pc.onaddstream = null;
                this.pc.oniceconnectionstatechange = null;
                this.pc.onconnectionstatechange = null;
                this.pc.onpeeridentity = null;
                
                this.pc.close();
            } catch (ex) {
                
            } finally {
                this.pc = null;
            }
        }

        this.dispatchConnected(false);
    }

    publish() {
        this.dispatchConnected(true)
        
        if (!this.pc) {
            this.dispatchConnected(false)
            return
        }
        
        console.log("publishing!")
        
        this.pc.onicecandidate = event => {
            if (event.candidate) {
                this.appStore.dispatch(
                    actions.localIceCandidateCreated(event.candidate));
            }
        };

        navigator.mediaDevices.getUserMedia({video: true, audio: true})
                 .then(stream => {
                     this.pc.addStream(stream);
                     this.streams.push(stream);
                     this.appStore.dispatch(actions.selfStreamCreated(
                         URL.createObjectURL(stream)
                     ))
                 })
                 .then(() => this.pc.createOffer())
                 .then(offer => this.pc.setLocalDescription(offer))
                 .then(() => {
                     this.appStore.dispatch(
                         actions.localDescriptionCreated(this.pc.localDescription))
                     return true
                 })
                 .catch(err => {
                     console.error(err)
                     this.dispatchConnected(false)
                 })

        this.pc.onaddstream = event => {
            this.streams.push(event.stream)
            this.appStore.dispatch(actions.remoteStreamAdded(
                URL.createObjectURL(event.stream)
            ));
        };
    }

    connectToRemote(remotePeerDesc) {
        this.dispatchConnected(true);
        
        if (!this.pc || !remotePeerDesc) {
            this.dispatchConnected(false);
            return 
        }
        
        let {iceCandidates, description} = JSON.parse(remotePeerDesc)

        if (description && (description.type === 'offer')) {

            if (!iceCandidates) {
                this.dispatchConnected(false)
                return
            }

            this.pc.onaddstream = event => {
                this.streams.push(event.stream)
                this.appStore.dispatch(actions.remoteStreamAdded(
                    URL.createObjectURL(event.stream)
                ));
            };

            navigator.mediaDevices.getUserMedia({video: true, audio: true})
                     .then(stream => {
                         this.pc.addStream(stream);
                         this.streams.push(stream);
                         
                         this.appStore.dispatch(actions.selfStreamCreated(
                             URL.createObjectURL(stream)
                         ))
                     })
                     .then(() => this.pc.setRemoteDescription(
                         new RTCSessionDescription(description)))
                     .then(() => {
                         return Promise.all(
                             iceCandidates.map(ice => this.pc.addIceCandidate(
                                 new RTCIceCandidate(ice)
                             ))
                         )
                     })
                     .then(() => this.pc.createAnswer())
                     .then(answer => this.pc.setLocalDescription(answer))
                     .then(() => {
                         this.appStore.dispatch(
                             actions.localDescriptionCreated(this.pc.localDescription))
                         return true
                     })
                     .catch(err => {
                         console.error(err);
                         this.dispatchConnected(false)
                     })
        } else if (description) {
            this.pc.setRemoteDescription(new RTCSessionDescription(description))
              .catch(err => console.error(err))
        }
        
    }
}
