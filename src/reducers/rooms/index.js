import { SOCKET_ROOM_CREATED, SOCKET_ROOM_JOINED, SOCKET_ROOM_LEFT, SOCKET_ROOM_CREATED_ERROR, SOCKET_ROOM_MEMBER_LIST, SOCKET_ROOM_JOINED_ERROR } from '../../constants'


function rooms(state={roomname: "scanner", result: null, members: {}}, action) {
	switch(action.type) {
		case SOCKET_ROOM_CREATED_ERROR: 
			return { ...state, error: action.payload, members: state.members }
		case SOCKET_ROOM_JOINED_ERROR: 
			return { ...state, error: action.payload, members: state.members }
		case SOCKET_ROOM_CREATED: 
			return { roomname: action.payload.roomname, result: action.payload.result, members: state.members }
		case SOCKET_ROOM_JOINED:
			return { roomname: action.payload.roomname, members: state.members }
		case SOCKET_ROOM_LEFT:
			return { roomname: "", members: state.members }
		case SOCKET_ROOM_MEMBER_LIST: 
			return { roomname: state.roomname, members: action.payload.members}
		default: 
			return state
	}
}


export default rooms