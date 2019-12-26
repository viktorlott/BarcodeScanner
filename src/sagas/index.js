
import { takeEvery, all, fork, take, call, put } from 'redux-saga/effects';
import { fetchProduct, emitProduct } from './products';
import { PRODUCT_REQUESTED, PRODUCT_EMIT } from '../constants';
import io from 'socket.io-client'
import { eventChannel } from 'redux-saga';

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
	return eventChannel(emitter => {
		console.count("eventChannel")
		socket.on("connect", msg => console.log("Connected -> " , socket.id))

		socket.on("/recieve/barcode", barcode => {
			console.count("barcode", barcode)
			emitter({ type: PRODUCT_REQUESTED, payload: {code: barcode}})

		})
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