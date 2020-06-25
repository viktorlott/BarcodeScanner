
import React, { useState, useContext, useMemo, useEffect, useReducer, createContext, useCallback, useRef } from "react"

import { Form, Row, Col, Input, Button, Icon } from 'antd';

import validator from '../../utils/validator'

import actions from '../../actions'

import get from 'lodash/get'

import schema from './schema_test'

import { useDispatch, useSelector } from 'react-redux'

import ConditionEvaluation from './ConditionEvaluation'




const FactoryContext = createContext()

const { useSharedState } = createSharedStore({})



function useViewStore({ page, id }) {
	
	const state = useSelector(state => {
		return get(state, [page, id], null)
	})

	return state
}


const useValidator = (target, scheme, rules) => {
	const [validations, setValidations] = useState([])

	const hasMounted = useRef()

	useEffect(() => {
		if (hasMounted.current) {
			const validationList = validator(target, scheme)
				.map(validation => {
					const index = rules.findIndex(rule => (rule.path === validation.path && rule.type === validation.target.type))
					if (index !== -1) {
						return { ...validation, message: rules[index].message }
					}
					return validation
				})

			setValidations(validationList)
		}
	}, [target.state])


	useEffect(() => {
		if (!hasMounted.current && rules.length > 0) hasMounted.current = true
	}, [])

	const helpMessages = validations.length ? validations.filter(validation => !validation.valid) : []
	const validationStatus = validations.length ? helpMessages.length === 0 ? "success" : "error" : ""

	return [validations, helpMessages, validationStatus]
}



const components = {
	Input: ({ props, state, setstate, rules = [], required, validations, helpMessages, validationStatus, events, defaultState }) => {
		return (
			<Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
				<Form.Item
					colon={true}
					required={required}
					label={props.label}
					hasFeedback
					validateStatus={validationStatus}
					help={helpMessages.map((validation, i) => <div key={i} style={{ fontSize: 12 }}>{validation.message}</div>)}>
					<Input placeholder={props.placeholder} value={state || defaultState} style={props.style} onChange={e => void setstate(e.target.value)} />
				</Form.Item>
			</Form>
		)
	},
	Button: ({ props, state, setstate, context, components, events }) => {
		return <Button type="text" {...events}>{props.label}</Button>
	}
}


function getComponentByType(type) {

	switch (type) {
		case "row":
			return ({ children, props }) => <Row gutter={props.gutter}>{children}</Row>
		case "col":
			return ({ children, props }) => <Col span={props.span} offset={props.offset}>{children}</Col>
		default: {
			if (type in components) {
				const Component = components[type]
				return ({ children, ...props }) => <Component {...props}  >{children}</Component>
			}
			return <div>Component not found</div>
		}
	}
}

const genKey = () => Math.random().toString(36).substring(2)






function createSharedStore(init, name) {
	let _state = init || null;
	let _connectedComponents = [];
	let _idCounter = 0;

	const _has = (listen, name, filter) => filter ? listen.includes(name) : true

	const useSharedState = (name, personalState = () => ({}), listen, options = {}) => {

		const [state, setState] = useState({ ..._state, [name]: personalState(_state) });

		const _options = useMemo(() => ({ filter: options.filter }), [options])
		const _dependency = [...listen, state, _options]


		useEffect(() => {
			const compID = ++_idCounter;
			_state = { ..._state, [name]: personalState(_state) };
			_updatePrevComponents(_state);

			_connectedComponents.push({ id: compID, name, listen, setState });

			return () => {
				const index = _connectedComponents.findIndex(component => component.id === compID);
				_connectedComponents.splice(index, 1);
			};
		}, []);


		const _updatePrevComponents = useCallback(state => {
			_connectedComponents.forEach(component => void _has(listen, component.name, _options.filter) && component.setState(state));
		}, _dependency);


		const sharedState = useMemo(() => {
			if (_options.filter) {
				let _state = {}
				for (let name of listen) {
					_state[name] = state[name]
				}
				return _state
			}
			return state
		}, _dependency)


		const changeState = useCallback(newVal => {
			_state[name] = newVal instanceof Function ? newVal(_state[name]) : newVal;

			_connectedComponents.forEach(component => {
				if (component.listen.includes(name)) {
					component.setState({ ..._state })
				}
			}
			);
		}, _dependency);

		return [state[name], sharedState, changeState];
	};

	if (name) {
		const customName = "useShared" + name + "State";
		return Object.create().defineProperty(customName, {
			value: useSharedState
		});
	} else {
		return { useSharedState };
	}

}






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
	}
}

function useComponentEvents({events, context, name, functions}) {
	const dispatch = useDispatch()

	const _events = useMemo(() => {
		let transformedEvents = {}
		for(let [eventName, event] of Object.entries(events)) {
			transformedEvents[eventName] = (e) => {
				e.presist && e.presist()
				event.forEach(ev => void generateEvent({...ev, context, dispatch, functions })  )
			}
		}
		return transformedEvents
	},[events, context.components, name])
	
	return _events
}


function useEffectHandlers(effects, state, factoryContext) {
	const hasMounted = useRef()
	const dispatch = useDispatch()

	useEffect(() => {
		if(effects && effects.onMount) {
			effects.onMount.map(effect => generateEvent({...effect, context: { components: state }, functions: factoryContext.functions, dispatch }))
		}

		return () => {
			if(effects && effects.onUnMount) {
				effects.onUnMount.map(effect => generateEvent({...effect, context: { components: state }, functions: factoryContext.functions, dispatch }))
			}
		}
	},[])


	useEffect(() => {
		if(effects && effects.onUpdate) {
			effects.onUpdate.map(effect => generateEvent({...effect, context: { components: state, hasMounted: hasMounted.current }, functions: factoryContext.functions, dispatch }))
		}
	})
}



function Structure(comp) {
	const {
		type = "",
		name = genKey() + "-" + genKey(),
		children = [],
		props = {},
		bind = [],
		defaultState = null,
		events={},
		effects=[],
		span = null,
		scheme = {},
		rules = [],
		required = false
	} = comp.layout

	const Component =                                     useMemo(() => getComponentByType(type), [])
	const factoryContext =                                useContext(FactoryContext)
	const [personalState, state, setState] =              useSharedState(name, (_state) => defaultState ? generateEvent({ ...defaultState, context: { components: _state }, functions: factoryContext.functions }) : null, [name, ...bind], { filter: true })
	const [validations, helpMessages, validationStatus] = useValidator({ components: state, state: personalState }, scheme, rules)
	const isRequired =                                    useMemo(() => validations.some(valid => (valid.target.type === "Required" && !valid.valid)), [validationStatus])
	const _events =                                       useComponentEvents({events, context: { components: state }, name, functions: factoryContext.functions})
	const viewState =                                     useViewStore({ id: "1234", page: factoryContext.page})
	

	useEffectHandlers(effects, state, factoryContext)

	const size = span ? { span } : {}

	return useMemo(() =>
		<Component
			{...size}
			props={props}
			name={name}
			state={state[name]}
			setstate={setState}
			components={state}
			rules={rules}
			events={_events}
			required={required || isRequired}
			validations={validations}
			helpMessages={helpMessages}
			validationStatus={validationStatus}
			children={children.map((component, key) => <Structure key={key} layout={component} />)} />,
		[state[name], props, children])
}


function Reader(props) {
	const { schema } = props

	return (
		<FactoryContext.Provider value={{ functions: schema.functions, page: schema.name, id: genKey() + "-" + genKey() }}>
			{schema.layout.map((component, key) => <Structure key={key} layout={component} />)}
		</FactoryContext.Provider>
	)
}



export default (props) => <Reader schema={schema} />