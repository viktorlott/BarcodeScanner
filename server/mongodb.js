const MongoClient = require("mongodb").MongoClient
const { serverlog } = require("./utils")

const DB_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`
const DB_NAME = process.env.DB_NAME

module.exports = () => async app => {

	const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

	const db = client.db(DB_NAME)

	app.set("db", db)
	app.set("mongoClient", client)

	serverlog("mongodb")
}