const PRODUCTS = "products"

class ProductModel {
	constructor(app) {
		const db = app.get("db")
		this.collection = db.collection(PRODUCTS)
	}
	/**
	 * 
	 * @param {{id: string}} query 
	 * @return {object} product
	 */
	async findBarCode({id}) {
		return await this.collection.findOne({productid: id})
	}
}

module.exports = app => token => new ProductModel(app, token)




// module.exports = app => {
// 	const mongooseClient = app.get("mongooseClient")

// 	const { Schema } = mongooseClient

// 	const products = new Schema({
// 		brand: String,
// 		cartitem: {
// 			commId: String,
// 			id: String,
// 			listPrice: String,
// 			meanWeight: String,
// 			prodId: String,
// 			qty: String,
// 			skuld: String,
// 			unit: String,
// 			unitOfMeasure: String
// 		},
// 		category: String,
// 		img: String,
// 		price: String,
// 		productId: String,
// 		tags: [String],
// 		tester: String,
// 		title: String,
// 		updatedQty: String,
// 		variant: String
// 	}, { timestamps: true })


// 	app.set("productSchema", products)

// 	return mongooseClient.model("products", products)
// }