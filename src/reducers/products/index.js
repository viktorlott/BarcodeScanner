import { PRODUCT_ADD, PRODUCT_UPDATE, PRODUCT_REPLACE_ALL } from '../../constants'


function products(state=[], action) {

	switch(action.type) {
		case PRODUCT_REPLACE_ALL: 
		return action.payload
		case PRODUCT_ADD: 
			let exists = false
			const data = state.map(product => {
				if(product.code === action.payload.code) {
					exists = true
					return action.payload
				}
				return product
			})
			if(exists) return data
			else 	   return [...state, action.payload]
		case PRODUCT_UPDATE:
			return state.map(scanresult => {
				if( action.payload && action.payload.productid && scanresult.code === action.payload.productid) {
					scanresult.product = action.payload
				}
				return scanresult
			})

		default: 
			return state
	}
}


export default products