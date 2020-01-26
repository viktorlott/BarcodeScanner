import { put, takeEvery, all, call } from 'redux-saga/effects'
import { PRODUCT_REQUESTED } from '../constants';
import { fetchMaxiProduct } from '../utils/fetchApi';
import { addProduct, populateProductWithData } from '../actions/products.action';



/**
 * MAIN SAGA FOR PRODUCTS
 */
// export function* watchFetchProduct() {
// 	yield takeEvery(PRODUCT_REQUESTED, fetchProduct)
// }



export function* fetchProduct(action) {

	// yield put(addProduct(action.payload))
	// const product = yield call(fetchMaxiProduct, action.payload.code)
	// yield put(populateProductWithData(product))
}


export function* emitProduct(emit, action) {

	emit("/post/barcode", action.payload.code)
}










