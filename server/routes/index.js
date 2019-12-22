const root = require("./root")
const express = require("express")


module.exports = (app) => {
	app.use("/", root)
}