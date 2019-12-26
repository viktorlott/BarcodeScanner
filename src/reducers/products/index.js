import { PRODUCT_ADD, PRODUCT_UPDATE } from '../../constants'


function products(state=[], action) {

	switch(action.type) {
		case PRODUCT_ADD: 
			return [...state, action.payload]
		case PRODUCT_UPDATE:
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


export default products