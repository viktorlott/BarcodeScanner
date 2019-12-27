
import { takeEvery, all, fork, take, call, put } from 'redux-saga/effects';
import { fetchProduct, emitProduct } from './products';
import { PRODUCT_REQUESTED, PRODUCT_EMIT, SOCKET_ROOM_CREATE_REQUESTED, SOCKET_ROOM_JOIN_REQUESTED, SOCKET_ROOM_LEAVE_REQUESTED, SOCKET_ROOM_CREATED, SOCKET_ROOM_JOINED, SOCKET_ROOM_LEFT } from '../constants';
import io from 'socket.io-client'
import { eventChannel } from 'redux-saga';
import { joinRoom, createRoom, leaveRoom } from './rooms';

let socket;

function createSocketConnection() {
		socket = io(process.env.REACT_APP_SERVER_URL, { path: "/stream"})
		return new Promise((resolve) => {
			socket.on("connect", () => {
				resolve(socket);
			});
		});
}


function createSocketChannel(socket) {
	return eventChannel(dispatch => {

		socket.on("connect", msg => console.log("Connected -> " , socket.id))

		socket.on("/recieve/barcode", barcode => {
			dispatch({ type: PRODUCT_REQUESTED, payload: {code: barcode}})

		})


		socket.on("/action", action => void dispatch(action))



		// on unsubscribe
		return () => {
			
		}
	})
}

/**
 * Doing this to stay true to the framework
 * @param {*} socket 
 */
function createSocketEmitter(socket) {
	return new Promise(res => {
		const socketEmitter = (...args) => {
			socket.emit(...args)
		}
		res(socketEmitter)
	})
}

/**
 * This will listen for channel-events being emitted from socket events
 * 
 * It waits for a channel event and when it gets it, the action gets dispatched
 * @param {*} channel 
 */
function* websocketSaga(channel) {
	while(true) {
		const action = yield take(channel)
		yield put(action)
	}
}


function* eventBus(...args) {
	const [socket, emit] = args

	yield takeEvery(PRODUCT_REQUESTED, fetchProduct)
	yield takeEvery(PRODUCT_EMIT, emitProduct, emit)

	yield takeEvery(SOCKET_ROOM_JOIN_REQUESTED, joinRoom, emit)
	yield takeEvery(SOCKET_ROOM_LEAVE_REQUESTED, leaveRoom, emit)
	yield takeEvery(SOCKET_ROOM_CREATE_REQUESTED, createRoom, emit)

	// yield takeEvery(SOCKET_ROOM_CREATED, createRoom)
	// yield takeEvery(SOCKET_ROOM_JOINED, createRoom)
	// yield takeEvery(SOCKET_ROOM_LEFT, createRoom)




}


function* rootSaga(){

	const socket = yield call(createSocketConnection)
	const channel = yield call(createSocketChannel, socket)
	const emit = yield call(createSocketEmitter, socket)

	// We fork this so it has its own thread
	yield fork(websocketSaga, channel)

	yield fork(eventBus, socket, emit)
}



export default rootSaga