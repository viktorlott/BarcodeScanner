const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compress = require("compression")

const { serverlog } = require("./utils")


module.exports = () => async app => {

	setImmediate(() => {
		app.use(cors())
		app.use(helmet())
		app.use(compress())

		app.use(express.json())
		app.use(express.urlencoded({extended: true}))

		serverlog("middleware")
	})

}
