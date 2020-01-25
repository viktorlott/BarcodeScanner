import { 	
	isObject,
	isFunction,
	isArray,
} from "./types"

import {	
	getPath,
} from "./helper"

import {
	validateLengths,
	validateRegExp,
	validateTypes,
	validatePrimitive
} from "./comparisons"


function includes(x, y) {
	let list = [...x]
	let matches = [...y]
	for(let i in list) {
		for(let c in matches) {
			if(list[i] === matches[c]) {
				return true
			}
		}
	}
	return false
}

const primativeKeys = Object.keys(validatePrimitive)

function schemaChecker({ value, vparent, vparentkey }, { schema, sparent, sparentkey }, arr=[], path=[]) {
	if(isFunction(schema)) {
		arr.push(validateTypes(value, schema, vparentkey, vparent, getPath(path)))
	} else if(isArray(schema)) {
		if(vparentkey) {
			arr.push(validateTypes(value, schema, vparentkey, vparent, getPath(path)))
		} 
		for(let [index, scm] of Object.entries(schema)) {
			for(let [vindex, _] of Object.entries(value)) {
					const cmp1 = { value: value[vindex], vparent: value, vparentkey: vindex}
					const cmp2 = { schema: schema[index], sparent: schema, sparentkey: index}
					schemaChecker(cmp1, cmp2, arr, [...path, +vindex])
			}
		}

	} else if(isObject(schema)) {
		const schemaEntries = Object.entries(schema)
		const valueEntries = Object.entries(value)

		const [firstValue] = valueEntries

		const [firstScheme] = schemaEntries

		const isPrimitive = includes(Object.keys(schema), primativeKeys)

		if(vparentkey && !(isPrimitive && isFunction(firstScheme[1])) ) {
			arr.push(validateTypes(value, schema, vparentkey, vparent, getPath(path)))

			if(isObject(value)) {
				arr.push(validateLengths(valueEntries, schemaEntries, vparentkey, vparent, getPath(path)))
			}
		}

		for(let [key, scm] of schemaEntries) {
			if(key in validatePrimitive) {
				let validationData = validatePrimitive[key](vparent[vparentkey], scm, vparentkey, vparent, getPath(path))
				arr.push(validationData)
			} else {
					const cmp1 = { value: value[key], vparent: value, vparentkey: key}
					const cmp2 = { schema: schema[key], sparent: schema, sparentkey: key}
					schemaChecker(cmp1, cmp2, arr, [...path, key])
			}
		}
	}

	return arr
}


function validate(value, schema) {
	return schemaChecker({value}, {schema}, [])
}

export default validate