const { serverlog } = require("./utils")


const announce = (io, room, action) => () => {
	io.to(room).emit("/action", action)
}
const createRoom = (io, socket, app) => async room => {
	console.log("got here", room)
	const roomModel = app.get("roommodel")()
	const { status, error, result } = await roomModel.create({name: room})
	if(error) return void io.emit("/action", { type: "SOCKET_ROOM_CREATED_ERROR", payload: error })

	const [prevRoom] = Object.values(socket.rooms)
	socket.leave(prevRoom)
	socket.join(room, announce(io, room, { type: "SOCKET_ROOM_CREATED", payload: { roomname: room, result} }))
}

const joinRoom = (io, socket) => room => {
	
	const [prevRoom] = Object.values(socket.rooms)
	socket.leave(prevRoom)
	
	socket.join(room, announce(io, room, { type: "SOCKET_ROOM_JOINED", payload: { roomname: room } }))
}

const leaveRoom = (io, socket) => room => {
	socket.leave(room, announce(io, room, { type: "SOCKET_ROOM_LEFT", payload: { roomname: room } }))
	socket.join(application)
}


module.exports = () => app => {
	const io = app.get("socket")

	io.on("connection", socket => {
		const { defaultRoom="scanner" } = socket.handshake.query


		socket.join(defaultRoom)

		socket.on("/room/create", createRoom(io, socket, app))
		socket.on("/room/join", joinRoom(io, socket))
		socket.on("/room/leave", leaveRoom(io, socket))


		socket.on("/post/barcode", (barcode) => {
			const rooms = Object.values(socket.rooms)
			const barcodeModel = app.get("barcodemodel")()
			barcodeModel.create({ code: barcode, ownername: rooms[0] ? rooms[0] : "scanner" })
			rooms.forEach(room => void socket.broadcast.to(room).emit("/recieve/barcode", barcode))
		})
	})

	io.on("disconnect", socket => {
		console.log("Socket disconnected")
	})

	serverlog("channels")
}