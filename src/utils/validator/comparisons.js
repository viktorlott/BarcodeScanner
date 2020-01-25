import { getType, } from "./helper"
import { isObject } from "./types"


export function validateRequired(cmp1, cmp2, key, parent, path) {
	let isSame = cmp2 ? !!(cmp1.length && cmp1 !== "") : true

	const message = isSame ? "Success"  : "Field is required"

	const validation = { 
			path,	
			key,
			target: { type: "Required", value: cmp1 },
			valid: isSame, 
			message
	}
	return validation
}

export function validateRegExp(cmp1, cmp2, key, parent, path) {
	let isSame = null
	if(isObject(cmp2)) {
		isSame = (new RegExp(cmp2.value, cmp2.flag)).test(cmp1)
	} else {
		isSame = (new RegExp(cmp2)).test(cmp1)
	}

	const message = isSame ? "Match: " + cmp2 + " found in " + cmp1 : "Match failed"

	const validation = { 
			path,	
			key,
			target: { type: "RegExp", value: cmp1 },
			valid: isSame, 
			message
	}
	return validation
}

export function validateTypes(cmp1, cmp2, key, parent, path) {
	const isSame = getType(cmp1) === getType(cmp2)
	const message = isSame ? "Type is right" : "Type is wrong"
	//  "Not same type: " + (!isNaN(+key) ? "Index " : "Key ")  + key + " is of type " + getType(cmp1) + " instead of type " + getType(cmp2)
	const validation = { 
			path,
			key,
			schema: getType(cmp2),
			target: { type: getType(cmp1), value: cmp1 },
			valid: isSame, 
			message
	}
	return validation
}

export function validateLengths(cmp1, cmp2, key, parent, path) {
	const isSame = cmp1.length === cmp2.length
	const message = isSame ? "Length is right" : "Length is wrong"
	// "Not same length: " + cmp1.length + " instead of length " + cmp1.length
	const validation = { 
			path,
			key,
			schemaLength: cmp2.length,
			target: { type: "Length", value: cmp1 },
			valid: isSame, 
			message
	}
	return validation
}



export const validatePrimitive = {
	type: validateTypes,
	match: validateRegExp,
	length: validateLengths,
	required: validateRequired
}

export default {
	validateLengths,
	validateRegExp,
	validateTypes,
	validatePrimitive
}