
import { takeEvery, all, fork, take, call, put, cancelled, cancel, select, race, wait, delay } from 'redux-saga/effects';
import { fetchProduct, emitProduct } from './products';
import { PRODUCT_REQUESTED, PRODUCT_EMIT, SOCKET_ROOM_CREATE_REQUESTED, SOCKET_ROOM_JOIN_REQUESTED, SOCKET_ROOM_LEAVE_REQUESTED, SOCKET_ROOM_CREATED, SOCKET_ROOM_JOINED, SOCKET_ROOM_LEFT, EXTENSION_SEND_MESSAGE, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT_REQUESTED, LOGIN_REQUESTED, LOGOUT_SUCCESS } from '../constants';
import io from 'socket.io-client'
import { eventChannel } from 'redux-saga';
import { joinRoom, createRoom, leaveRoom } from './rooms';
import { toExtension } from './extension';
import { addProduct } from '../actions/products.action';
import jwt from 'jsonwebtoken'

let socket;

function createSocketConnection(token) {
	console.count("createSocketConnection")
	socket = io(process.env.REACT_APP_SERVER_URL, { path: "/stream", query: { token } })
	return new Promise((resolve) => {
		socket.on("connect", () => {
			resolve(socket);
		});
	});
}


function createSocketChannel(socket) {
	return eventChannel(dispatch => {

		socket.on("connect", msg => console.log("Connected -> ", socket.id))

		socket.on("/receive/barcode", document => {
			console.log(document)
			dispatch(addProduct(document))
			// dispatch({ type: PRODUCT_REQUESTED, payload: document})
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
function* createWebsocketDispatcher(channel) {
	while (true) {
		const action = yield take(channel)
		yield put(action)
	}
}


function* createEventBUS(...args) {
	const [socket, emit] = args

	yield takeEvery(PRODUCT_REQUESTED, fetchProduct)
	yield takeEvery(PRODUCT_EMIT, emitProduct, emit)

	yield takeEvery(SOCKET_ROOM_JOIN_REQUESTED, joinRoom, emit)
	yield takeEvery(SOCKET_ROOM_LEAVE_REQUESTED, leaveRoom, emit)
	yield takeEvery(SOCKET_ROOM_CREATE_REQUESTED, createRoom, emit)

}


async function loginWith(username, password) {
	const result = await fetch(process.env.REACT_APP_SERVER_URL + "/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password })
	}).then(response => response.json())
	console.log(result)
	if (result.token) return result.token
	console.log("ERROR", result)
	return undefined

}

async function refreshToken(token) {
	const result = await fetch(process.env.REACT_APP_SERVER_URL + "/auth/refresh/" + token).then(response => response.json())

	if (result.token) return result.token

	console.log("ERROR", result)

	return undefined

}

// function* authorize(username, password) {
// 	try {
// 		const token = yield call(loginWith, username, password)

// 		console.log("Success", token)

// 		yield put({ type: LOGIN_SUCCESS, token })
// 		yield call(function storeToken(token) {}, { token })
// 		const user = yield select(state => state.user)
// 		console.log("user", user)
// 		return token
// 	} catch (error) {
// 		console.log("Error", error)
// 		yield put({ type: LOGIN_ERROR, error })
// 	} finally {
// 		if (yield cancelled()) {
// 			// ... put special cancellation handling code here
// 		}
// 	}
// }

// function* createLoginFlow() {
// 	while (true) {
// 		const { payload } = yield take(LOGIN_REQUESTED)
// 		const { username, password } = payload 

// 		// fork return a Task object
// 		const task = yield fork(authorize, username, password)

// 		const action = yield take([LOGOUT_REQUESTED, LOGIN_ERROR])
// 		if (action.type === LOGOUT_REQUESTED)
// 			yield cancel(task)
// 		yield call(function clearToken(token) {}, 'token')
// 	}
// }


function* authFlowSaga() {
	while (true) {
		let { payload } = yield take(LOGIN_REQUESTED)
		let { username, password } = payload


		let token = yield call(loginWith, username, password)
		// authorization failed, wait the next signing
		if (!token)
			continue

		const decoded = jwt.decode(token)

		yield put({ type: LOGIN_SUCCESS, payload: { token, profile: decoded } })

		let userSignedOut
		while (!userSignedOut) {

			const expiresIn = (decoded.exp - decoded.iat - 50) * 1000
			const { expired } = yield race({
				expired: delay(expiresIn),
				signout: take(LOGOUT_REQUESTED)
			})

			// token expired first
			if (expired) {
				token = yield call(refreshToken, token)
				// authorization failed, either by the server or the user signout
				if (!token) {

					userSignedOut = true // breaks the loop
					// yield call(signout)
					yield put({ type: LOGIN_ERROR })


				}
			}
			// user signed out before token expiration
			else {
				userSignedOut = true // breaks the loop
				//   yield call(signout)
				yield put({ type: LOGOUT_SUCCESS })
			}
		}
	}
}


function* initiateConnection(action) {
	const socket = yield call(createSocketConnection, action.token)
	const channel = yield call(createSocketChannel, socket)
	const emit = yield call(createSocketEmitter, socket)

	// We fork this so it has its own thread
	// const lf = yield fork(createLoginFlow)
	const wp = yield fork(createWebsocketDispatcher, channel)
	const eb = yield fork(createEventBUS, socket, emit)


	yield take([LOGIN_ERROR, LOGOUT_SUCCESS])

	// yield cancel(lf)
	yield cancel(wp)
	yield cancel(eb)



}

function* rootSaga() {


	yield fork(authFlowSaga)

	yield takeEvery(LOGIN_SUCCESS, initiateConnection)

	// const socket = yield call(createSocketConnection )
	// const channel = yield call(createSocketChannel, socket)
	// const emit = yield call(createSocketEmitter, socket)

	// // We fork this so it has its own thread
	// // yield fork(createLoginFlow)
	// yield fork(createWebsocketDispatcher, channel)
	// yield fork(createEventBUS, socket, emit)


	// yield put({ type: LOGIN_REQUESTED, payload: { username: "viktor", password: "123" } })

}



export default rootSaga