const USERS = "users"
const bcrypt = require("bcrypt")


class UserModel {
	constructor(app) {
		const db = app.get("db")
		this.collection = db.collection(USERS)
	}

	async register({ username, password, permissions }) {
		const indexResult = await this.collection.createIndex({ username: 1 }, { unique: true })
		if(indexResult instanceof Error) {
			console.log("RoomModel Index Error")
		}
		try {
			const hash = bcrypt.hashSync(password, 10)
			const result = await this.collection.insertOne({ username, password: hash, permissions, created: new Date() })

			if(result.result.ok === 1) return result
			else return new Error("Didnt register")
		} catch(err) {
			return err
		}

	}

	async login({ username, password }) {
		try {
			const user = await this.collection.findOne({ username })
			if(!user) return new Error("Wrong username")
			const match = bcrypt.compareSync(password, user.password)
			if(match) {
				return user
			} else {
				return new Error("Wrong password")
			}
		} catch(error) {
			return error
		}
	}
}

module.exports = app => token => new UserModel(app, token)


