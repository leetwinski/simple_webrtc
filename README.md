# Simple peer-to-peer WebRTC example with audio and video streams

## building

execute `node run bundle` to assemble the app.

## usage

since the app doesn't use any additional server to negotiate between the peers, you would have to provide the data manually.

* open `index.html` in two browsers (doesn't matter on one machine or on different ones)
* click on `publish` button in one of the app instances. That would be the caller, the other would be the callee.
* copy and paste the caller's generated string into the input box of the callee and click `connect` (you should see the local video stream and a new generated string)
* copy the aforementioned generated string from the callee, paste it back to the caller's input box, and click `connect`. Now you should see that both app instances have local and remote streams being played on video displays.
