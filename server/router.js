const createRoutes = require("./routes")
const { serverlog } = require("./utils")


module.exports = () => (app) => {
	createRoutes(app)
	serverlog("router")
}