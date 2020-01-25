const express = require("express")
const io = require("socket.io")
const http = require("http")

const configure = require("./configure")

const middleware = require("./middleware")
const logger = require("./logger")
const mongodb = require("./mongodb")
const models = require("./models")
const socket = require("./socket")
const channels = require("./channels")
const services = require("./services")
const router = require("./router")

const app = express()

const server = http.createServer(app)

configure(app).with(
	middleware(),
	logger(),
	mongodb(),
	models(),
	socket(io, server),
	channels(),
	services(),
	router()
).start(server)













