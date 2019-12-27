import products from './products'
import rooms from './rooms'
import { combineReducers } from 'redux'

const reducers = combineReducers({
	products,
	rooms
})


export default reducers

