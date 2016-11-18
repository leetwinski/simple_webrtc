import React from "react";

export default class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            peerAddress: ""
        }

        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handlePublishClick = this.handlePublishClick.bind(this);
        this.handleConnectClick = this.handleConnectClick.bind(this);
        this.handleDisconnectClick = this.handleDisconnectClick.bind(this);
    }

    handleTextAreaChange(event) {
        this.setState({peerAddress: event.target.value});
    }

    handleConnectClick() {
        this.setState({peerAddress: ""})
        this.props.onConnectClick(this.state.peerAddress);
    }

    handlePublishClick() {
        this.props.onPublishClick();
    }

    handleDisconnectClick() {
        this.props.onDisconnectClick();
    }

    getLocalConnectionString() {
        const p = this.props;

        return JSON.stringify({
            iceCandidates: p.localIceCandidates,
            description: p.localDescription
        })
    }

    render() {
        const peerAddressIsEmpty = this.state.peerAddress.trim();
        
        return (
            <span>
                <br/>
                <video width="320" height="240" autoPlay
                       src={this.props.localStreamUrl}/>
                <video width="320" height="240" autoPlay
                       src={this.props.remoteStreamUrl}/>
                <br/>
                <textarea onChange={this.handleTextAreaChange}
                          value={this.state.peerAddress}
                          cols="100"/>
                <br/>
                <button disabled={this.props.isConnected || peerAddressIsEmpty}
                        onClick={this.handlePublishClick}>
                    publish
                </button>
                <button disabled={!peerAddressIsEmpty}
                        onClick={this.handleConnectClick}>
                    connect
                </button>
                <button disabled={!this.props.isConnected}
                        onClick={this.handleDisconnectClick}>
                    disconnect
                </button>
                <div>
                    {this.getLocalConnectionString()}
                </div>
            </span>
        )
    }
}
