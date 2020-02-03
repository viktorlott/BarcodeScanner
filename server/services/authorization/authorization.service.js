const Token = require("../../authentication/strategies/token.strategy")
const jwt = require("jsonwebtoken")




module.exports = app => {
	const CreateUserModel = app.get("usermodel")

	app.post("/auth/login", async (req, res, next) => {
		const { username="", password="" } = req.body
		if(username && password) {
			const userModel = CreateUserModel()

            const result = await userModel.login({ username, password})

            if(result instanceof Error) return res.status(301).json({ error: result })

			const token = Token.create({ username, permissions: result.permissions })

			return res.json({ token })
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
		const { username="", password="" } = req.body
		if(username && password) {
			const userModel = CreateUserModel()
			const userDocument = { username, password, permission: ["CREATE", "READ", "UPDATE", "DELETE"]}
            const result = await userModel.register(userDocument)

            if(result instanceof Error) return res.status(301).json({ error: result })

			const token = Token.create({username: userDocument.username, permission: userDocument.permission })

			return res.json({ token })
		}
		return res.status(301).send("Data missing")
    })
    
    app.get("/auth/refresh/:token", async (req, res, next) => {
		const { token: oldToken } = req.params

		if(!oldToken) {
			return res.status(301).json({ error: "No token provided" })
		}

		const token = Token.refresh(oldToken)

		if(!token) {
			return res.status(301).json({ error: "Not valid token" })
		}

		return res.json({ token })
		
	})
}