const LocalStrategy = require("../../authentication/strategies/local.strategy")
const jwt = require("jsonwebtoken")


module.exports = app => {
	const CreateUserModel = app.get("usermodel")

	app.post("/auth/login", async (req, res, next) => {
		const { username="", password="" } = req.body
		if(username && password) {
			const userModel = CreateUserModel()

            const result = await userModel.login({ username, password})
			console.log(result)
            if(result instanceof Error) return res.status(301).send(result)

            const token = jwt.sign({ username, date: new Date(), permissions: result.permissions }, process.env.JWT_SECRET)

			return res.json({ token, "authorized": true })
		}
		return res.status(301).send("Data missing")
    })
    
    app.post("/auth/logout", async (req, res, next) => {
		const { id="" } = req.params
		if(id) {
			const userModel = CreateUserModel()

		}
		return res.status(301).send("ID missing")
    })


    app.post("/auth/register", async (req, res, next) => {
        console.log("heeloo", req.body)
		const { username="", password="" } = req.body
		if(username && password) {
			const userModel = CreateUserModel()

            const result = await userModel.register({ username, password, premission: ["CREATE", "READ", "UPDATE", "DELETE"]})

            if(result instanceof Error) return res.status(301).send("ID missing")

            const token = jwt.sign({ username, date: new Date(), permissions: ["CREATE", "READ", "UPDATE", "DELETE"] }, process.env.JWT_SECRET)

			return res.json({ token, "authorized": true })
		}
		return res.status(301).send("Data missing")
    })
    
    app.post("/auth/token/:token", async (req, res, next) => {
		const { id="" } = req.params
		if(id) {
            const userModel = CreateUserModel()
            

		}
		return res.status(301).send("ID missing")
	})
}