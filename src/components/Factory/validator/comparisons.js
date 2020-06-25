import { getType, } from "./helper.js"
import { isObject } from "./types.js"


class ValidationMessage {
	constructor(path, ) {
		this.path = path
		this.key = key
		// this.target = target
		this.valid = valid
		this.message = message
	}

	format(msg) {
		// const path = /\$path/gi
		// const type = {find: /\$type/gi, replace: this.type}
		// const regexp = {find: /\$regexp/gi, replace: this.}
		// const value = {find: /\$value/gi, replace: this.}
		// const target = {find: /\$target/gi, replace: this.}
		// const valid = {find: /\$valid/gi, replace: this.}
		// const length = {find: /\$length/gi, replace: this.}
	}
}


// {path, key, target: { type: "Required", value: cmp1 }, valid: isSame, message} 
export function validateRequired(cmp1, cmp2, key, parent, path, msg, required) {
	let isSame = required === false ? true : cmp2 ? !!(cmp1 && cmp1.length && cmp1 !== "") : false
	console.log(required, cmp1, cmp2)
	const message = isSame ? "Success"  : "Field is required"

	// const validation = new ValidationMessage(path, )
	// {path, key, target: { type: "Required", value: cmp1 }, valid: isSame, message} 

	return {
		method: "_required",
		expected: cmp2[key],
		result: cmp1[key] && undefined,
		valid: isSame,
		path,
		message
	}
}

export function validateRegExp(cmp1, cmp2, key, parent, path, msg) {
	let isSame = null
	if(isObject(cmp2)) {
		isSame = (new RegExp(cmp2.value, cmp2.flag)).test(cmp1)
	} else {
		isSame = (new RegExp(cmp2)).test(cmp1)
	}

	const message = isSame ? "Match: " + cmp2 + " found in " + cmp1 : "Match failed"

	return {
		method: "_match",
		valid: isSame,
		expected: { value: cmp2 },
		result: { value: cmp1 },
		path,
		message
	}
}

export function validateTypes(cmp1, cmp2, key, parent, path, msg) {
	const isSame = getType(cmp1) === getType(cmp2)
	const message = isSame ? "Type is right" : msg || "Type is wrong"
	//  "Not same type: " + (!isNaN(+key) ? "Index " : "Key ")  + key + " is of type " + getType(cmp1) + " instead of type " + getType(cmp2)
	const validation = { 
			method: "_type",
			expected: { type: getType(cmp2) },
			result: { type: getType(cmp1) },
			valid: isSame, 
			path,
			message
	}
	return validation
}

export function validateLengths(cmp1, cmp2, key, parent, path) {
	const isSame = cmp1.length === cmp2.length
	const message = isSame ? "Length is right" : "Length is wrong"

	return {
		method: "_length",
		expected: { length: cmp2.length },
		result: { length: cmp2.length },
		valid: isSame,
		path,
		message
	}
}



export const validatePrimitive = {
	_type: validateTypes,
	_match: validateRegExp,
	_length: validateLengths,
	_required: validateRequired
}

export default {
	validateLengths,
	validateRegExp,
	validateTypes,
	validatePrimitive
}