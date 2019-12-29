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


const isArray = value => Array.isArray(value) 

const isObject = value => (!isArray(value) && value instanceof Object)

const isNumber = value => (typeof value === "number") 

const isString = value => (typeof value === "string")

const isFunction = value => (typeof value === "function") 


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

const isProtoArray = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Array"

const isProtoObject = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Object"

const isProtoNumber = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Number"

const isProtoString = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "String"

const isProtoFunction = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Function"


const schema = {
	name: String,
	arr: [String],
	test: [],
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
	arr: ["hwdwkiwd"],
	test:{},
	list: [
		{ phonenumber: 44109093, name: "Carita" }, 
		{ phonenumber: 44233109093, name: "vsdsd" }
	],
	coords: {
		x: 2343234,
		y: 434324
	}
}


function validate(cmp1, cmp2, key, parent, path) {

	const isSame = getType(cmp1) === getType(cmp2)
	const msg = isSame ? "Is same type" : "Not same type. " + key + " is of type " + getType(parent[key]) + " instead of type " + getType(cmp2)
	const validation = { 
		[path]: { 
			key,
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

function schemaChecker({ value, vparent, vparentkey }, { schema, sparent, sparentkey }, arr=[], path=[]) {
	if(isFunction(schema)) {

		arr.push(validate(value, schema, vparentkey, vparent, getPath(path)))

	} else if(isArray(schema)) {

		vparentkey && arr.push(validate(value, schema, vparentkey, vparent, getPath(path)))

		// if(isArray(value)) {
		// 	arr.push(validate(value, schema, vparentkey, vparent, getPath(path)))
		// } else {
			for(let [index, scm] of Object.entries(schema)) {
				if(isFunction(scm)) {
					arr.push(validate(vparent[vparentkey], scm, index, vparent, getPath(path)))
				} else {
					// for(let [vindex, _] of Object.entries(value)) {
						const cmp1 = { value: value[index], vparent: value, vparentkey: index}
						const cmp2 = { schema: schema[index], sparent: schema, sparentkey: index}
						schemaChecker(cmp1, cmp2, arr, [...path, +index])
					// }
				}
			}
		// }

	} else if(isObject(schema)) {
		vparentkey && arr.push(validate(value, schema, vparentkey, vparent, getPath(path)))

		// if(isObject(value)) {
		// 	arr.push(validate(value, schema, vparentkey, vparent, getPath(path)))
		// } else {
			for(let [key, scm] of Object.entries(schema)) {
				if(key === "type" && isFunction(scm)) {
					arr.push(validate(vparent[vparentkey], scm, vparentkey, vparent, getPath(path)))
				} else {
					// for(let [vkey, _] of Object.entries(value)) {
						const cmp1 = { value: value[key], vparent: value, vparentkey: key}
						const cmp2 = { schema: schema[key], sparent: schema, sparentkey: key}
						schemaChecker(cmp1, cmp2, arr, [...path, key])
					// }
				}
			}
		// }
	}
	return arr
}


// console.log(schemaChecker({value}, {schema}, []))

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