const { serverlog } = require("./utils")


const announce = (io, room, action) => () => {
	io.to(room).emit("/action", action)
}

const joinRoom = (io, socket) => room => {
	socket.leave(application)
	socket.join(room, announce(io, room, { type: "SOCKET_ROOM_JOINED", payload: room }))
}

const leaveRoom = (io, socket) => room => {
	socket.leave(room, announce(io, room, { type: "NOTIFICATION", payload: "A device has left" }))
	socket.join(application)
}


module.exports = () => app => {
	const io = app.get("socket")

	io.on("connection", socket => {
		const { defaultRoom="scanner" } = socket.handshake.query


		socket.join(defaultRoom)

		socket.on("/room/join", joinRoom(io, socket))
		socket.on("/room/leave", leaveRoom(io, socket))


		socket.on("/post/barcode", (barcode) => {
			const rooms = Object.values(socket.rooms)
			rooms.forEach(room => void socket.broadcast.to(room).emit("/recieve/barcode", barcode))
			
		})
	})

	io.on("disconnect", socket => {
		console.log("Socket disconnected")
	})

	serverlog("channels")
}