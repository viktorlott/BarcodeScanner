import { LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT_SUCCESS } from "../../constants"
import jwt from 'jsonwebtoken'


function user(state={}, action) {
	switch(action.type) {
        case LOGIN_SUCCESS: 
            const profile = jwt.decode(action.token, { json: true })
			return { token: action.token,  ...profile }
		case LOGIN_ERROR: 
            return {}
        case LOGOUT_SUCCESS: 
			return {}
		default: 
			return state
	}
}


export default user