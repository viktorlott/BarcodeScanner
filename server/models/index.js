const ProductsModel = require("./products.model")

module.exports = () => app => {
	app.set("productsmodel", ProductsModel(app))
}