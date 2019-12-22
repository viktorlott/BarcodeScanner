const { serverlog } = require("./utils")

module.exports = (io, http) => app => {
	const socketio = io(http, {
		path: process.env.SOCKET_PATH,
		serveClient: false,

		pingInterval: process.env.SOCKET_PINGINTEVAL,
		pingTimeout: process.env.SOCKET_PINGTIMEOUT,
	})

	app.set("socket", socketio)

	serverlog("socket")

}