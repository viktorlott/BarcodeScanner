// const Schema = require('validate')

import validate from "./index.js"
import { setValue, reForge } from "./helper.js"

const schema = {
	name: String,
	arr: [String],
	user: String,
	test: { _type: String, _required: true },
	list: [
		{ phonenumber: String, name: String }
	],
	coords: {
		x: Number,
		y: Number
	}
}

const schema2 = {
	// state: { _type: String, _match: "viktor", _required: true },
	list: [ 
		{ 
			phonenumber: Number, 
			person: { 
				name: { 
					_type: String, 
					_message: "problem with type",
					_match: "viktor"
				}, 
				test: { _type: String, _match: "hello", _required: false },
				meta: { 
					coords: { 
						_type: String,
						_match: "viktor"
					},
					_message: "Wrong type, oh noes!"  
				},
			} 
		} 
	],
}

const value2 = {
	list: [ 
		{ phonenumber: 123123123, person: { name: 123123, meta: { coods: 2123 } } } 
	],
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
console.log(JSON.stringify(reForge(validations), null, 2))



// console.log("validate\n", remapped)