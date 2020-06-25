import { 	
	isObject,
	isFunction,
	isArray,
} from "./types.js"

import {	
	getPath,
} from "./helper.js"

import {
	validateLengths,
	validateRegExp,
	validateTypes,
	validateRequired,
	validatePrimitive
} from "./comparisons.js"


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
const filterObject = (obj, func) => Object.fromEntries((Object.entries(obj).filter(func)))

function schemaChecker({ value, vparent, vparentkey }, { schema, sparent, sparentkey }, arr=[], path=[]) {
	
	if(isFunction(schema)) {
		const validation = validateTypes(value, schema, vparentkey, vparent, getPath(path))
		if(!validation.valid) {
			arr.push(validation)
		}
	} else if(isArray(schema)) {
		if(vparentkey) {
			const validation = validateTypes(value, schema, vparentkey, vparent, getPath(path))
			if(!validation.valid) {
				arr.push(validation)
			}
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

		const valueEntries = Object.entries(value ? value : {})


		const [firstScheme] = schemaEntries

		const isPrimitive = includes(Object.keys(schema), primativeKeys)

		/**
		 * This if expression check if value schema does not include primativeKeys if so, type eval value and check length
		 * 
		 */

		if(vparentkey && !isPrimitive) {

			if(!isFunction(firstScheme[1])) {
				// console.log(firstScheme)
				// const raw = filterObject(schema, ([key]) => !primativeKeys.includes(key))
				const validation = validateTypes(value, schema, vparentkey, vparent, getPath(path), schema["_message"])
				if(!validation.valid) {
					arr.push(validation)
				}
			}

			if(isObject(value) && schema["_strict"] === true ) {
				// Should maybe use strict instead?
				const validation = validateLengths(valueEntries, schemaEntries.filter(([key]) => key !== "_message"), vparentkey, vparent, getPath(path), schema["_message"])
				if(!validation.valid) {
					arr.push(validation)
				}
			}

		}

		for(let [key, scm] of schemaEntries) {
			if(key in validatePrimitive) {
				let validationData = validatePrimitive[key](vparent[vparentkey], scm, vparentkey, vparent, getPath(path), schema["_message"], scm[key])
				if(!validationData.valid) {
					arr.push(validationData)
				}
			} else {
				if((isObject(value) || isArray(value)) && key in value) {
					const cmp1 = { value: value[key], vparent: value, vparentkey: key}
					const cmp2 = { schema: schema[key], sparent: schema, sparentkey: key}
					schemaChecker(cmp1, cmp2, arr, [...path, key])
				} else {
					if(schema[key]["_required"]) {
						const validation = validateRequired(value, schema, key, vparent, getPath(path) + "."+key, schema["_message"], schema[key]["_required"])
						if(!validation.valid) {
							arr.push(validation)
						}
						
					}
				}
			}
		}
	}

	return arr
}


function validate(value, schema) {
	return schemaChecker({value}, {schema}, [])
}

export default validate