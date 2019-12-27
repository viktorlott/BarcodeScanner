const BARCODES = "barcodes"

class BarcodeModel {
	constructor(app, token) {
		const db = app.get("db")
		this.collection = db.collection(BARCODES)
	}


	async create({code, ownername}) {
		const indexResult = await this.collection.createIndex({ "owner.query.name": 1, "owner.type": 1 })
		if(indexResult instanceof Error) {
			console.log("RoomModel Index Error")
		}

		let insertResult = null
		try {
			insertResult = await this.collection.insertOne({ code, owner: { type: "pointer", query: { name: ownername }},created: new Date()})
		} catch(dberror) {
			const error = new Error("Insert failed, object already exists")
			return { status: "error", error }
		}

		return { status: "success", result: insertResult }

	}
}

module.exports = app => token => new BarcodeModel(app, token)




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