const CreateProductsService = require("./products/products.service")


module.exports = () => app => {
	CreateProductsService(app)
}