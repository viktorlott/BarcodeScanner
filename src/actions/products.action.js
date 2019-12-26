import { PRODUCT_ADD, PRODUCT_UPDATE } from '../constants'

export function addProduct(codeResult) {
	return {
		type: PRODUCT_ADD,
		payload: codeResult
	}
}


export function populateProductWithData(data) {
	return {
		type: PRODUCT_UPDATE,
		payload: data
	}
}