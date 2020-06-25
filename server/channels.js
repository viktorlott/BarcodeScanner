const { serverlog } = require("./utils")
const get = require("lodash/get")


const emit = (io, target, action) => () => {
	io.to(target).emit("/action", action)
}

const listRoomMembers = (io, socket) => room => {
	const members = get(io, ["sockets", "adapter", "rooms", room, "sockets"], {})
	emit(io, room, { type: "SOCKET_ROOM_MEMBER_LIST", payload: { members } })()
}

const createRoom = (io, socket, app) => async room => {
	const roomModel = app.get("roommodel")()
	const answer = await roomModel.create({name: room})
	const { status, error, result } = answer
	const [me, prevRoom] = Object.keys(socket.rooms)

	if(status === "error") return void io.to(me).emit("/action", { type: "SOCKET_ROOM_CREATED_ERROR", payload: { message: error.message } })

	if(room !== prevRoom) {
		socket.leave(prevRoom)
		listRoomMembers(io, socket)(prevRoom)
	}

	const to = me ? me : socket.id

	socket.join(
		room, 
		() => {
			emit(io, to, { type: "SOCKET_ROOM_CREATED", payload: { roomname: room, result } })()
			listRoomMembers(io, socket)(room)
			socket.barcode_room = room
		}
	)

}

const joinRoom = (io, socket, app) => async room => {
	const roomModel = app.get("roommodel")()
	const barcodeModel = app.get("barcodemodel")()
	const answer = await roomModel.find({name: room})
	const { status, error, result } = answer
	
	const [me, prevRoom] = Object.keys(socket.rooms)
	if(status === "error") return void io.to(me).emit("/action", { type: "SOCKET_ROOM_JOINED_ERROR", payload: { message: error.message } })

	if(room !== prevRoom) {
		socket.leave(prevRoom)
		listRoomMembers(io, socket)(prevRoom)
	}

	const to = me ? me : socket.id

	const barcodes = await barcodeModel.findCodesForOwner({ownername: room})

	socket.join(
		room, 
		() => {
			listRoomMembers(io, socket)(room)
			emit(io, to, { type: "SOCKET_ROOM_JOINED", payload: { roomname: room }})()
			emit(io, to, { type: "PRODUCT_REPLACE_ALL", payload: barcodes })() 
			socket.barcode_room = room
		}
	)

}

const leaveRoom = (io, socket) => room => {
	const [me, _] = Object.values(socket.rooms)
	socket.leave(room, emit(io, socket.id, { type: "SOCKET_ROOM_LEFT", payload: { roomname: room } }))
	socket.join("scanner")
}


module.exports = () => app => {
	const io = app.get("socket")

	io.on("connection", socket => {
		const { defaultRoom="scanner" } = socket.handshake.query

		console.log("Client connected -> ", socket.id)
		const joinRoomHandle = joinRoom(io, socket, app)
		const createRoomHandle = createRoom(io, socket, app)
		const leaveRoomHandle = leaveRoom(io, socket, app)

		joinRoomHandle(defaultRoom)

		socket.on("/room/create", createRoomHandle)
		socket.on("/room/join", joinRoomHandle)
		socket.on("/room/leave", leaveRoomHandle)
	


		socket.on("/post/barcode", async (code) => {
			const [_, room] = Object.keys(socket.rooms)
			const barcode = app.get("barcodemodel")()

			let document = await barcode.createOrUpdate({ code, ownername: room ? room : "scanner" })
			const bc = await barcode.find({code, ownername: room ? room : "scanner"})

			emit(io, room, { type: "PRODUCT_ADD", payload: bc })()
		})


		socket.on("/delete/barcode", async (code) => {
			const [_, room] = Object.keys(socket.rooms)
			const barcode = app.get("barcodemodel")()

			let document = await barcode.decrease({ code, ownername: room ? room : "scanner" })
			// const bc = await barcode.find({code, ownername: room ? room : "scanner"})
			const barcodes = await barcode.findCodesForOwner({ownername: room})
			emit(io, room, { type: "PRODUCT_REPLACE_ALL", payload: barcodes })() 
			// emit(io, room, { type: "PRODUCT_ADD", payload: bc })()
	
		})


		socket.on("disconnect", () => {
			listRoomMembers(io, socket)(socket.barcode_room)
		})
	})



	serverlog("channels")
}