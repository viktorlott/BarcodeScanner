import { SOCKET_ROOM_CREATED, SOCKET_ROOM_JOINED, SOCKET_ROOM_LEFT } from '../../constants'


function rooms(state={roomname: "scanner", result: null}, action) {
	switch(action.type) {
		case SOCKET_ROOM_CREATED: 
			return { roomname: action.payload.roomname, result: action.payload.result }
		case SOCKET_ROOM_JOINED:
			return { roomname: action.payload.roomname }
		case SOCKET_ROOM_LEFT:
			return { roomname: "" }
		default: 
			return state
	}
}


export default rooms