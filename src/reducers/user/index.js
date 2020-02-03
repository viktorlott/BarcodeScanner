import { LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT_SUCCESS } from "../../constants"
import jwt from 'jsonwebtoken'


function user(state={}, action) {
	switch(action.type) {
        case LOGIN_SUCCESS: 
			return { token: action.payload.token,  ...action.payload.profile }
		case LOGIN_ERROR: 
            return {}
        case LOGOUT_SUCCESS: 
			return {}
		default: 
			return state
	}
}


export default user