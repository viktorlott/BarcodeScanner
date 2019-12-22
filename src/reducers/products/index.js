import { PRODUCT_ADD, PRODUCT_CHANGE } from '../../constants'


function productsReducer(state=[], action) {
	switch(action.type) {
		case PRODUCT_ADD: 
			return [...state, action.payload]
		case PRODUCT_CHANGE:
			return state.map(scanresult => {
				if(scanresult.code === action.payload.productid) {
					scanresult.product = action.payload
				}
				return scanresult
			})

		default: 
			return state
	}
}


export default productsReducer