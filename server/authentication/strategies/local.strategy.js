const jwt = require("jsonwebtoken")

class Local {
	constructor(req, res, next, payload) {
		this.request = req
		this.response = res
		this.next = next
		this.payload = payload
		this.date = new Date()
		this.permissions = []
	}

	_signWith(permissions) {
		const token = jwt.sign({payload, date: this.date, permissions}, process.env.JWT_SECRET)
		return token
	}

	_user() {
		return {
			name: "Admin Viktor Lott",
			token: this._signWith(["superadmin"]),
			...payload
		}
	}


	login(username, password ) {
		if(username === "admin" && password === "123") {
			req.user = _user()
			this.next()
		} else {
			return this.response.status(401).send("Failed to login")
		}
	}
}

module.exports = Local