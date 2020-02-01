import products from './products'
import rooms from './rooms'
import user from './user'
import { combineReducers } from 'redux'

const reducers = combineReducers({
	user,
	products,
	rooms
})


export default reducers

