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

	async findCodesForOwner({ownername}) {
		let findResult = null
		const error = new Error("Barcodes not found")
		try {
			findResult = await this.collection.find({ "owner.query.name": ownername }).toArray()
		} catch(dberror) {
			return Promise.resolve({ status: "error", error })
		}
		return Promise.resolve(findResult)

	}
}

module.exports = app => token => new BarcodeModel(app, token)
