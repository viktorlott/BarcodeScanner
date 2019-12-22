import { PRODUCT_ADD, PRODUCT_CHANGE } from '../constants'

export function addProduct(codeResult) {
	return {
		type: PRODUCT_ADD,
		payload: codeResult
	}
}


export function changeProduct(product) {
	return {
		type: PRODUCT_CHANGE,
		payload: product
	}
}