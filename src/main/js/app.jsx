import "file-loader?name=[name].[ext]!./../html/index.html"

import "babel-polyfill";
import React from "react";
import {Provider, connect} from "react-redux";
import {render} from "react-dom";
import {combineReducers, createStore, applyMiddleware} from "redux";
import Player from "./player.jsx"
import ServerlessConnection from "./connection.js"
import {REMOTE_STREAM_ADDED, LOCAL_STREAM_CREATED,
        LOCAL_ICE_CANDIDATE_CREATED, LOCAL_DESCRIPTION_CREATED,
        UI_PLAYER_SET_CONNECTED, RESET_CONNECTION_DATA,
        RESET_STREAMS, PUBLISH_CONNECTION, CLOSE_CONNECTION,
        CONNECT_TO_REMOTE_CONNECTION,
        resetConnectionData, resetStreams,
        publishConnection, closeConnection, connectToRemoteConnection}
from "./actions.js"

const streamsReducer = (state, {type, payload}) => {
    if (state === undefined) {
        state = {
            localStreamUrl: null,
            remoteStreamUrl: null,
            localIceCandidates: [],
            localDescription: null,
            connection: null
        }
    }

    switch (type) {
        case REMOTE_STREAM_ADDED:
            return Object.assign({}, state, {remoteStreamUrl: payload})
        case LOCAL_STREAM_CREATED:
            return Object.assign({}, state, {localStreamUrl: payload})
        case LOCAL_ICE_CANDIDATE_CREATED:
            return Object.assign(
                {}, state,
                {localIceCandidates: state.localIceCandidates.concat(payload)})
        case LOCAL_DESCRIPTION_CREATED:
            return Object.assign({}, state, {localDescription: payload})
        case RESET_CONNECTION_DATA:
            return Object.assign({}, state, {
                localIceCandidates: [],
                localDescription: null
            })
        case RESET_STREAMS:
            return Object.assign({}, state, {
                localStreamUrl: null,
                remoteStreamUrl: null
            })
    }

    return state;
}

const playerComponentReducer = (state, {type, payload}) => {
    if (state === undefined) {
        state = {
            isConnected: false
        }
    }

    switch (type) {
        case UI_PLAYER_SET_CONNECTED:
            return Object.assign({}, state, {isConnected: payload})
    }

    return state
}

const appStore = createStore(combineReducers({
    streams: streamsReducer,
    player: playerComponentReducer
}));

let connection = null;

const ReduxPlayer = connect(
    state => ({
        isConnected: state.player.isConnected,
        localStreamUrl: state.streams.localStreamUrl,
        remoteStreamUrl: state.streams.remoteStreamUrl,
        localDescription: state.streams.localDescription,
        localIceCandidates: state.streams.localIceCandidates
    }),

    dispatch => ({
        onConnectClick: peerAddress => {
            connection = connection || new ServerlessConnection(appStore);
            dispatch(resetConnectionData())
            connection.connectToRemote(peerAddress)
        },
        onDisconnectClick: () => {
            dispatch(resetStreams())
            dispatch(resetConnectionData())
            connection.disconnect()
            connection = null;
        },
        onPublishClick: () => {
            connection = connection || new ServerlessConnection(appStore)
            dispatch(resetConnectionData())
            connection.publish()
        }
    })
)(Player);

render(
    <Provider store={appStore}>
        <ReduxPlayer/>
    </Provider>,
    document.querySelector("#content")
);
