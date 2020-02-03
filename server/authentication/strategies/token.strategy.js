const jwt = require("jsonwebtoken")

class Token {
	constructor() {

	}

	static create(payload, options={}) {
		delete payload["exp"]
		delete payload["iat"]

		const token = jwt.sign({...payload }, process.env.JWT_SECRET, { expiresIn: "1m" })

		return token
	}


	static verify(token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			return decoded
		} catch(error) {
			return false
		}
	}

	static decode(token) {
		const decoded = jwt.decode(token, { json: true })
		return decoded
	}

	static refresh(token, options={}) {
		const isAuthentic = Token.verify(token)

		if(isAuthentic) {
			const decoded = Token.decode(token)
			
			return Token.create(decoded, options)
		}
		return false
	}


}

module.exports = Token