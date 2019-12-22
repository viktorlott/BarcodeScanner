import productReducer from './products'
import { combineReducers } from 'redux'

const reducers = combineReducers({
	products: productReducer
})


export default reducers

