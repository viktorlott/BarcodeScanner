const mongoose = require("mongoose")
const { serverlog } = require("./utils")

const DB_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

module.exports = () => async app => {

	mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	mongoose.Promise = global.Promise

	app.set("mongooseClient", mongoose)

	serverlog("mongoose")


}