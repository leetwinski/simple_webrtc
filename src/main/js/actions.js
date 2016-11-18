
export const REMOTE_STREAM_ADDED = "REMOTE_STREAM_ADDED";
export const LOCAL_STREAM_CREATED = "LOCAL_STREAM_CREATED";

export const LOCAL_DESCRIPTION_CREATED = "LOCAL_DESCRIPTION_CREATED";
export const LOCAL_ICE_CANDIDATE_CREATED = "LOCAL_ICE_CANDIDATE_CREATED";

export const RESET_CONNECTION_DATA = "RESET_CONNECTION_DATA";
export const RESET_STREAMS = "RESET_STREAMS";

export const UI_PLAYER_SET_CONNECTED = "UI_PLAYER_SET_CONNECTED";

export const CLOSE_CONNECTION = "CLOSE_CONNECTION"
export const PUBLISH_CONNECTION = "PUBLISH_CONNECTION"
export const CONNECT_TO_REMOTE_CONNECTION = "CONNECT_TO_REMOTE_CONNECTION"

export const closeConnection = () => ({
    type: CLOSE_CONNECTION
})

export const publishConnection = () => ({
    type: PUBLISH_CONNECTION
})

export const connectToRemoteConnection = remoteDescr => ({
    type: CONNECT_TO_REMOTE_CONNECTION,
    payload: remoteDescr
})

export const remoteStreamAdded = url => ({
    type: REMOTE_STREAM_ADDED,
    payload: url
});

export const selfStreamCreated = url => ({
    type: LOCAL_STREAM_CREATED,
    payload: url
});

export const localDescriptionCreated = desc => ({
    type: LOCAL_DESCRIPTION_CREATED,
    payload: desc
})

export const localIceCandidateCreated = candidate => ({
    type: LOCAL_ICE_CANDIDATE_CREATED,
    payload: candidate
})

export const uiPlayerConnected = connected => ({
    type: UI_PLAYER_SET_CONNECTED,
    payload: connected
});

export const resetConnectionData = () => ({
    type: RESET_CONNECTION_DATA
})

export const resetStreams = () => ({
    type: RESET_STREAMS
})
