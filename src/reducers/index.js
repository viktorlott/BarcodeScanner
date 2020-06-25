import products from './products'
import rooms from './rooms'
import user from './user'
import { combineReducers } from 'redux'

const reducers = combineReducers({
	user,
	products,
	rooms,
	Barcodes: () => ({"1234": "test1234test"})
})


export default reducers

