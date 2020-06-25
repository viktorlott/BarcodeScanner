export const isArray = value => Array.isArray(value) || value === "Array"
export const isObject = value => (!isArray(value) && value instanceof Object) || value === "Object"
export const isNumber = value => (typeof value === "number") || value === "Number"
export const isString = value => (typeof value === "string") || value === "String"
export const isFunction = value => (typeof value === "function") || value === "Function"
export const isBoolean = value => (typeof value === "boolean") || value === "Boolean"

export const isProtoArray = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Array"
export const isProtoObject = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Object"
export const isProtoNumber = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Number"
export const isProtoString = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "String"
export const isProtoFunction = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Function"
export const isProtoBoolean = value => isFunction(value) && Object.getOwnPropertyDescriptor(value, "name").value === "Boolean"

export default {
	isObject,
	isFunction,
	isArray,
	isString,
	isNumber,
	isBoolean,
	isProtoArray,
	isProtoObject,
	isProtoNumber,
	isProtoString,
	isProtoFunction,
	isProtoBoolean
}