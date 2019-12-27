export async function fetchMaxiProduct(id) {
	return fetch(process.env.REACT_APP_API_MAXI_PRODUCT_URL+id, {mode: 'cors'}).then(data => data.json())
  }
  