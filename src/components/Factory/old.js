



function generateEvent({
	type, 
	name, 
	returns, 
	action, 
	data, 
	arguments: params, 
	anonymous, 
	context, 
	dispatch, 
	functions,
	then, 
	elseThen,
	condition
}) {
	switch(type) {
		case "dispatch": {

			if(name && actions[name]) {
				const args = params.map(arg => generateEvent({...arg, context, dispatch, functions}))
				return dispatch(actions[name](...args))
			}
			return dispatch(generateEvent({...action, context}))
		}
		case "function": {
			let storedFunction = name ? functions.find(func => func.name === name) : null
			if(storedFunction) {
				return generateEvent({...storedFunction.function, context, dispatch, functions})
			}
			return anonymous ? (() => returns ? generateEvent({...returns, context, dispatch, functions}) : null)() : () => returns ? generateEvent({...returns, context, dispatch, functions}) : null
		}
		case "anonymous": {
			return returns ? generateEvent({...returns, context, dispatch, functions}) : null
		}
		case "component": {
			let _data = null
			if(Array.isArray(data)) {
				for(let keyval of data) {
					_data = keyval.name ? get(context, ["components",keyval.name], null) : keyval.value
				}
			} else {
				_data = data.name ? get(context, ["components",data.name], null) : data.value
			}
			return _data
		}
		case "object": {
			let _data = {}
			for(let keyval of data) {
				_data[keyval.key] = keyval.path ? get(context, keyval.path, null) : keyval.value
			}
			return _data
		}
		case "array": {
			let _data = []
			for(let keyval of data) {
				_data.push(keyval.path ? get(context, keyval.path, null) : keyval.value)
			}
			return _data
		}
		case "string": {
			let _data = ""
			if(Array.isArray(data)) {
				for(let keyval of data) {
					_data = keyval.path ? get(context, keyval.path, null) : keyval.value
				}
			} else {
				_data = data.path ? get(context, data.path, null) : data.value
			}
			return _data
		}
		case "number": {
			let _data = 0
			if(Array.isArray(data)) {
				for(let keyval of data) {
					_data = keyval.path ? get(context, keyval.path, null) : keyval.value
				}
			} else {
				_data = data.path ? get(context, data.path, null) : data.value
			}
			return Number(_data)
		}
		case "bool": case "boolean": {
			let _data = false
			if(Array.isArray(data)) {
				for(let keyval of data) {
					_data = keyval.path ? get(context, keyval.path, null) : keyval.value
				}
			} else {
				_data = data.path ? get(context, data.path, null) : data.value
			}
			return !!_data
		}
		case "statement": {
			const conditionEvaluation = new ConditionEvaluation(condition, context, generateEvent, dispatch, functions)
			const result = conditionEvaluation.evaluate()

			if(result) {
				return generateEvent({ ...then, context, dispatch, functions})
			} else {
				return generateEvent({ ...elseThen, context, dispatch, functions})
			}
		}
		case "schema": {
			const conditionEvaluation = new ConditionEvaluation(condition, context, generateEvent, dispatch, functions)
			const result = conditionEvaluation.evaluate()

			if(result) {
				return generateEvent({ ...then, context, dispatch, functions})
			} else {
				return generateEvent({ ...elseThen, context, dispatch, functions})
			}
		}
	}
}
