import { put, takeEvery, all, call } from 'redux-saga/effects'


export function* joinRoom(emit, action) {
	emit("/room/join", action.payload.roomname)
}

export function* createRoom(emit, action) {
	console.log(action)
	emit("/room/create", action.payload.roomname)
}

export function* leaveRoom(emit, action) {
	emit("/room/leave", action.payload.roomname)
}


