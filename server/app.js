const express = require("express")
const io = require("socket.io")


const cors = require("cors")
const helmet = require("helmet")
const compress = require("compression")

const configure = require("./configure")

const mongodb = require("./mongodb")
const socket = require("./socket")
const router = require("./router")
const channels = require("./channels")
const logger = require("./logger")
const models = require("./models")
const services = require("./services")

const app = express()

const http = require("http").createServer(app)


app.use(cors())
app.use(helmet())
app.use(compress())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

configure(app).with(
	logger(),
	mongodb(),
	models(),
	socket(io, http),
	channels(),
	services(),
	router()
).start(http)













