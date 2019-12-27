import { put, takeEvery, all, call } from 'redux-saga/effects'


export function* joinRoom(emit, room) {
	emit("/room/join", room)
}
