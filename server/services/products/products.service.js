module.exports = app => {
	const CreateProductsModel = app.get("productsmodel")

	app.get("/products/:id", async (req, res, next) => {
		const { id="" } = req.params
		if(id) {
			const productsModel = CreateProductsModel()

			const product = await productsModel.findBarCode({id})

			return res.json(product)
		}

		return res.status(301).send("ID missing")

	})
}