const ROOMS = "rooms"

class RoomModel {
	constructor(app, token) {
		const db = app.get("db")
		this.collection = db.collection(ROOMS)
	}


	async create({name}) {
		const indexResult = await this.collection.createIndex({ name: 1 }, { unique: true })
		if(indexResult instanceof Error) {
			console.log("RoomModel Index Error")
		}

		let insertResult = null
		try {
			insertResult = await this.collection.insertOne({ name, created: new Date()})
		} catch(dberror) {
			const error = new Error("Room already exists")
			return { status: "error", error }
		}

		return { status: "success", result: insertResult }

	}


	async find({name}) {
		let findResult = null
		try {
			findResult = await this.collection.findOne({ name })
		} catch(dberror) {
			const error = new Error("Room not found")
			return Promise.resolve({ status: "error", error })
		}
		const error = new Error("Room not found")
		return Promise.resolve(findResult ? { status: "success", result: findResult } : { status: "error", error })

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