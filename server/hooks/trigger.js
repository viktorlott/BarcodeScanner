// const eventsSchema = {
// 	before: {
// 		yolo: [],
// 		find: [],
// 		insert: [],
// 	},
// 	after: {
// 		yolo: [],

// 		find: [],
// 		insert: [],	
// 	},
// 	error: {
// 		find: [],
// 		insert: [],	
// 	}
// }


const isArray = value => Array.isArray(value) 

const isObject = value => (!isArray(value) && value instanceof Object)

const isNumber = value => (typeof value === "number") 

const isString = value => (typeof value === "string")

const isFunction = value => (typeof value === "function") 




const isProtoArray = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Array"

const isProtoObject = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Object"

const isProtoNumber = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Number"

const isProtoString = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "String"

const isProtoFunction = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Function"


const schema = {
	name: String,
	arr: [String],
	test: { type: String},
	list: [
		{ phonenumber: String, name: String }
	],
	coords: {
		x: Number,
		y: Number
	},
	// lastname: { type: String, index: true }
}

const value = {
	name: "viktor",
	arr: ["hwdwkiwd", "viktor", 434],
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


function validateTypes(cmp1, cmp2, key, parent, path) {
	const isSame = getType(cmp1) === getType(cmp2)
	const msg = isSame ? "Is same type; " + " -> " + getType(cmp1) + " and " + getType(cmp2) : "Not same type." + (!isNaN(+key) ? " Index " : " Key ")  + key + " is of type " + getType(cmp1) + " instead of type " + getType(cmp2)
	const validation = { 
		[path]: { 
			key,
			schema: getType(cmp2),
			value: getType(cmp1),
			valid: isSame, 
			msg
		} 
	}
	return validation
}

function validateLength(cmp1, cmp2, key, parent, path) {
	const isSame = cmp1.length === cmp2.length
	const msg = isSame ? "Same length " + " -> " + cmp1.length + " and " + cmp2.length : "Not same length" + ". " + cmp1.length + " instead of length " + cmp1.length
	const validation = { 
		[path]: { 
			key,
			schemaLength: cmp1.length,
			valueLength: cmp2.length,
			valid: isSame, 
			msg
		} 
	}
	return validation
}

function getPath(path) {
	return path.reduce((acc, curr) => {
		if(typeof curr === "number") acc += "["+curr+"]"
		else if(acc.length === 0) acc += curr 
		else acc += "."+curr
		return acc
	},"")
}



function set(obj, path, value, type) {
	let paths = path
	if(getType(path) === "string") {
		paths = path.split(/(!?\[\d+\])|(!?[.])/gi).filter(e => e || e === ".")
	} 
	let current = obj
	let last = paths.length - 1
	let prev = undefined
	for(let [index, key] of Object.entries(paths)) {
		if(isIndex(key)) {
			const ind = getIndex(key)
			console.log("arr", current, ind, current[paths[+index - 1]], paths[+index - 1])
			const c = current[paths[+index - 1]]
			console.log("c", c, )
			if(c && c[+ind]) {

				current = current[paths[+index - 1]][ind]

			} else {
				if(+index === +last) {
					console.log("value", value)
					current[paths[+index - 1]][ind] = value

				} else {

						if(isIndex(paths[+index + 1])) {

							current[paths[+index - 1]][ind] = []
		
						} else {
							if(Array.isArray(current)) {
								if(current[ind]) {
									current = current[ind]
								} else {
									current[ind] = {}
								}
							} else {
								if(current[paths[+index - 1]]) {

								} else {
									current[paths[+index - 1]] = []
								}
								current[paths[+index - 1]][ind] = {}
								
								current = current[paths[+index - 1]][ind]
							}
							console.log("value",current, current[ind])
						
							
						}
			
					// console.log(index, last, current, ind, paths[index === 0 ? 0 : index - 1],key)
					// current = current[ind]
				}
			}
		} else if(key in current) {
			console.log("obj", current, key, current[key])
			current = current[key]
		} else {
			if(+index === +last) {
				current[key] = value
			} else {
				if(isIndex(paths[+index + 1])) {
					current[key] = []

				} else {
					current[key] = {}
					current = current[key]
				}
			}
		}
		prev = key
	}
	return obj
}

const getType = value => {
	if(isProtoArray(value)) {
		return "Array"
	} else if(isProtoObject(value)) {
		return "Object"
	} else if(isProtoNumber(value)) {
		return "Number"
	} else if(isProtoString(value)) {
		return "String"
	} else if(isProtoFunction(value)) {
		return "Function"
	} else if(isNumber(value)) {
		return "Number"
	} else if(isString(value)) {
		return "String"
	} else if(isArray(value)) {
		return "Array"
	} else if(isObject(value)) {
		return "Object"
	} else {
		return false
	}
}

function hasKey(obj, key) {
	if(key === null) return false

	return key in obj
}

function hasIndex(arr, index) {
	if(index === null || !arr) return false
	return !!(arr[+index])
}

function isIndex(val) {
	return (/\[\d+\]/gi).test(val)
}
function getIndex(val) {
	if(isIndex(val)) {
		return +(val.replace(/\[|\]/gi, ""))
	}
	return val
}

function splitPath(p) {
	return p.split(/(!?\[\d+\])|(!?[.])/gi).filter(e => e || e === ".")
}

function setValue(obj, path, value, type) {
	let current = obj
	const paths = getType(path) === "string" ? splitPath(path) : path
	const set = (o=obj, key=null, parent=null, child=null, val=null) => {
		if(isIndex(key)) {
			const index = getIndex(key)
			if(hasIndex(o, index) === false) {
				if(child === null) {
					o[index] = val
				} else if(isIndex(child)) {
					const cindex = getIndex(child)
					if(hasIndex(o[index], cindex)) {
						
					} else {
						o[key] = []
					}
				} else {
					o[index] = {}
				}
			} else if(child === null) {
				o[key] = val
			}
			o = o[index]
		} else {
			if(hasKey(o, key) === false) {
				if(child === null) {
					o[key] = val
				} else if(isIndex(child)) {
					const index = getIndex(child)
					if(hasIndex(o[key], index)) {

					} else {
						o[key] = []
					}
				} else {
					o[key] = {}
				}
			} else if(child === null) {
				o[key] = val
			}
			o = o[key]
		}

		return o
	}

	const pathsEntries = Object.entries(paths)
	let prev = null

	for(let [index, key] of pathsEntries) {
		const child = pathsEntries.length - 1 == +index ? null : +index + 1
		let ob = set(current, key, prev, child === null ? null : pathsEntries[child][1], value)

		prev = key
		current = ob
	}
	return obj
}



let m = {}
setValue(m, ["test", "names", "[0]", "name"], "viktor")
setValue(m, ["test", "names", "[1]", "name"], "jens")

setValue(m, ["test", "test", "[0]"], "jens")

setValue(m, ["test", "names"], "jens")


console.log(JSON.stringify(m, null, 2))
console.log(m)

function schemaChecker({ value, vparent, vparentkey }, { schema, sparent, sparentkey }, arr=[], path=[]) {
	if(isFunction(schema)) {
		arr.push(validateTypes(value, schema, vparentkey, vparent, getPath(path)))
	} else if(isArray(schema)) {
		if(vparentkey) {
			arr.push(validateTypes(value, schema, vparentkey, vparent, getPath(path)))
		} 

		for(let [index, scm] of Object.entries(schema)) {
			if(isFunction(scm)) {
				for(let [vindex, _] of Object.entries(value)) {
					arr.push(validateTypes(vparent[vparentkey][vindex], scm, vindex, vparent, getPath([...path, +vindex])))
				}
			} else {
					const cmp1 = { value: value[index], vparent: value, vparentkey: index}
					const cmp2 = { schema: schema[index], sparent: schema, sparentkey: index}
					schemaChecker(cmp1, cmp2, arr, [...path, +index])
			}
		}

	} else if(isObject(schema)) {
		const schemaEntries = Object.entries(schema)
		const valueEntries = Object.entries(value)
		const [first] = schemaEntries

		if(vparentkey && !(first[0] === "type" && isFunction(first[1])) ) {
			arr.push(validateTypes(value, schema, vparentkey, vparent, getPath(path)))
			arr.push(validateLength(valueEntries, schemaEntries, vparentkey, vparent, getPath(path)))
		}

			for(let [key, scm] of schemaEntries) {
				if(key === "type" && isFunction(scm)) {
					arr.push(validateTypes(vparent[vparentkey], scm, vparentkey, vparent, getPath(path)))
				} else {
						const cmp1 = { value: value[key], vparent: value, vparentkey: key}
						const cmp2 = { schema: schema[key], sparent: schema, sparentkey: key}
						schemaChecker(cmp1, cmp2, arr, [...path, key])
				}
			}
	}
	return arr
}


function Schema(schema) {
	return {
		validate(value) {
			const results = schemaChecker({value}, {schema})


		}
	}
}

const Person = Schema(schema)


console.log(Person.validate(value))


const eventsSchema = {
	before: {
		yolo: [],
		find: [],
		insert: [],
	},
	after: {
		yolo: [],

		find: [],
		insert: [],	
	},
	error: {
		find: [],
		insert: [],	
	}
}

function createTriggerEvent(events) {
	return async function(type, name, args, data) {
		const funcs = events[type][name]
		for(let func of funcs) {
			await Promise.resolve(func(args, data))
		}
		return Promise.resolve()
	}
}


function isInObject(events, name) {
	return (name in events) && events[name].length
}

function addTriggers(obj, events) {
	const target = obj.__proto__
	const descriptors = Object.getOwnPropertyDescriptors(target)
	try {
		for(let [name, descriptor] of Object.entries(descriptors)) {
			if(name !== "constructor" && (isInObject(events.before, name) || isInObject(events.after, name) || isInObject(events.error, name))) {
				const value = descriptor.value
				const trigger = createTriggerEvent(events)
				Object.defineProperty(target, name, { 
					value: async function(...args) {
						(name in events.before) &&  await trigger("before", name, args)
						let result
						try {
							result = value.call(this, ...args)
						} catch(error) {
							(name in events.error) &&  await trigger("error", name, args, error)
							return error
						}

						(name in events.after) &&  await trigger("after", name, args, result)
						return result
					} 
				})
			}
		}
	} catch(error) {
		console.log(error)
	}
}


module.exports = addTriggers