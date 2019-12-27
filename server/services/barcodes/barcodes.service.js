module.exports = app => {
	const CreateProductModel = app.get("productmodel")

	app.get("/products/:id", async (req, res, next) => {
		const { id="" } = req.params
		if(id) {
			const productModel = CreateProductModel()

			const product = await productModel.findBarCode({id})

			return res.json(product)
		}

		return res.status(301).send("ID missing")

	})
}