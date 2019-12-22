export default function fetchBarcode(id) {
	return fetch("https://develottment.com/products/"+id, {mode: 'cors'})
  }
  