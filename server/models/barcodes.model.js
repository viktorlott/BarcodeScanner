const BARCODES = "barcodes"

const addTriggers = require("../hooks/trigger")


class BarcodeModel {
	constructor(app, token) {
		const db = app.get("db")
		this.collection = db.collection(BARCODES)
	}

	_barcodeScheme({code, ownername, created=true}) {
		created = created ? { created: new Date() } : {}
		return { code, amount: 1, owner: { type: "pointer", query: { name: ownername }}, ...created}
	}


	async update({code, ownername}) {
		let updateResult = null
		try {
			updateResult = await this.collection.updateOne({ code, ownername }, { $inc: { amount: 1 } })
		} catch(dberror) {
			const error = new Error("Update failed, object doesnt exists")
			console.log(dberror)
			return { status: "error", error }

		}
		return { status: "success", result: updateResult }
	}	

	async create({code, ownername}) {
		const indexResult = await this.collection.createIndex({ "owner.query.name": 1, "owner.type": 1 })
		if(indexResult instanceof Error) {
			console.log("RoomModel Index Error")
		}

		let insertResult = null
		try {
			insertResult = await this.collection.insertOne(this._barcodeScheme({code, ownername}))
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

	async find({code, ownername}) {
		let findResult = null
		const error = new Error("Barcode not found")
		try {
			findResult = await this.collection.findOne({ code, "owner.query.name": ownername })
		} catch(dberror) {
			return Promise.resolve({ status: "error", error })
		}
		return Promise.resolve(findResult)

	}


	async createOrUpdate(query) {
		const code = await this.collection.findOneAndUpdate({ code: query.code, "owner.query.name": query.ownername}, { $inc: { amount: 1 }}, { new: true })

		if(code.value) {
			return code.value
		} else {
			const response = await this.create(query)
			return response.result.ops
		}
	}
}

module.exports = app => token => new BarcodeModel(app, token)
