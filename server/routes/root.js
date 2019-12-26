const express = require("express")
const path = require("path")
const router = express.Router()

module.exports = app => {
	app.use(express.static(path.join(__dirname, "..", "..", "build")))
	app.use("*", express.static(path.join(__dirname, "..", "..", "build", "index.html")))
}
