// const Schema = require('validate')

import validate from "./index"
import { setValue, reForge } from "./helper"

const schema = {
	name: String,
	arr: [String],
	user: String,
	test: { type: String, },
	list: [
		{ phonenumber: String, name: String }
	],
	coords: {
		x: Number,
		y: Number
	}
}

const schema2 = {
	state: { type: String, match: "viktor", required: true }
}

const value2 = {
	state: "23"
}


const value = {
	name: "viktor",
	arr: ["hwdwkiwd", "viktor", 434],
	user: { name: "viktor", year: 93 },
	test: "hello",
	list: [
		{ phonenumber: 44109093, name: "Carita" }, 
		{ phonenumber: 44233109093, name: "vsdsd" }
	],
	coords: {
		x: 2343234,
		y: 434324
	}
}
setValue


// console.time("First")
// const profile = new Schema(schema)
// const tes = profile.validate(value)
// console.timeEnd("First")

console.time("Second")
const validations = validate(value2, schema2)
// const remapped = reForge(validations)
console.timeEnd("Second")
console.log(validations)



// console.log("validate\n", remapped)