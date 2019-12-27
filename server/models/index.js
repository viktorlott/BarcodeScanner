const ProductModel = require("./products.model")
const BarcodeModel = require("./barcodes.model")
const RoomModel = require("./rooms.model")

module.exports = () => app => {
	app.set("productmodel", ProductModel(app))
	app.set("barcodemodel", BarcodeModel(app))
	app.set("roommodel", RoomModel(app))
}