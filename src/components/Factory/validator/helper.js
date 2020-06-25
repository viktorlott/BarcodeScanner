import {
	isObject,
	isArray,
	isString,
	isNumber,
	isBoolean,
	isProtoArray,
	isProtoObject,
	isProtoNumber,
	isProtoString,
	isProtoFunction,
} from "./types.js"


export function hasKey(obj, key) {
	if(key === null || isBoolean(obj) || isNumber(obj)) return false
	return key in obj
}

export function hasIndex(arr, index) {
	if(index === null || !arr) return false
	return !!(arr[+index])
}

export function isIndex(val) {
	return (/\[\d+\]/gi).test(val)
}
export function getIndex(val) {
	if(isIndex(val)) {
		return +(val.replace(/\[|\]/gi, ""))
	}
	return val
}

export function splitPath(p) {
	return p.split(/(!?\[\d+\])|(!?[.])/gi).filter(val => val === "." ? false : val)
}


export function getPath(path) {
	return path.reduce((acc, curr) => {
		if(typeof curr === "number") acc += "["+curr+"]"
		else if(acc.length === 0) acc += curr 
		else acc += "."+curr
		return acc
	},"")
}

export const getType = value => {
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

export function setValue(obj, path, value, type) {
	let current = obj

	const paths = getType(path) === "String" ? splitPath(path) : path
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


export function reForge(validations) {
	return validations.reduce((obj, item) => {
		if(item.schemaLength) return obj
		if(item.schema === "Array") {
			setValue(obj, item.path, [])
		} else if(item.schema === "Object") {
			setValue(obj, item.path, {})
			setValue(obj, item.path, item)
		} else {
			setValue(obj, item.path, item)
		}
		return obj
	}, {})
}

export default {
	getPath,
	getType,
	setValue,
	splitPath,
	reForge
}