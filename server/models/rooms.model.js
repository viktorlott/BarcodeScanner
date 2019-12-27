const ROOMS = "rooms"

class RoomModel {
	constructor(app, token) {
		const db = app.get("db")
		this.collection = db.collection(ROOMS)
	}


	async create({name}) {
		const indexResult = await this.collection.createIndex({ name: 1}, { unique: true })
		if(indexResult instanceof Error) {
			console.log("RoomModel Index Error")
		}

		const insertResult = await this.collection.insertOne({ name, created: new Date()})

		if(insertResult instanceof Error) {
			const error = new Error("Insert failed, room already exists -> " + name)
			return { status: "error", error }
		}

		return { status: "success", result: insertResult }

	}
}

module.exports = app => token => new RoomModel(app, token)




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