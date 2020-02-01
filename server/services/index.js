const CreateAuthorizationService = require("./authorization/authorization.service")
const CreateProductsService = require("./products/products.service")


module.exports = () => app => {
	CreateAuthorizationService(app)
	CreateProductsService(app)
}