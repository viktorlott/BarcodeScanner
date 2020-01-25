
import React, { useState, useContext, useMemo, useEffect, useReducer, createContext, useCallback, useRef } from "react"

import { Form, Row, Col, Input, Button, Icon } from 'antd';

import validator from '../../utils/validator'

import actions from '../../actions'

import get from 'lodash/get'


const schema = {
	name: "Barcodes",
	layout: [
		{
			type: "row",
			props: {
				gutter: [8, 8]
			},
			children: [
				{
					type: "col",
					props: {
						span: 24
					},
					children: [
						{
							type: "Input",
							name: "_room",
							scheme: {
								state: { 
									type: String, 
									required: true, 
									match: "scanner"
								} 
							},
							rules: [
								{ path: "state", type: "Required", message: "Field is required" },
								{ path: "state", type: "RegExp",   message: "Match not found" }
							],
							required: true,
							defaultState: "",
							props: {
								label: "Room",
								style: { width: "100%"}
							},
							actions: [],
							bind: []
						},
					]
				},
			]
		},
		{
			type: "row",
			props: {
				gutter: [8, 8]
			},
			children: [
				{
					type: "col",
					props: {
						span: 24
					},
					children: [
						{
							type: "Input",
							name: "_name",
							scheme: {
								state: { 
									type: String, 
									required: true, 
									match: "scanner"
								} 
							},
							rules: [
								{ path: "state", type: "Required", message: "Field is required" },
								{ path: "state", type: "RegExp",   message: "Match not found" }
							],
							required: true,
							defaultState: "",
							props: {
								label: "Name",
								style: { width: "100%" }
							},
							actions: [],
							bind: []
						},
					]
				},
			]
		},
		{
			type: "row",
			props: {
			},
			children: [
				{
					type: "col",
					props: {
						span: 2,
						offset: 4
					},
					children: [
						{
							type: "Button",
							name: "_button_join",
							bind: [],
							props: {
								label: "Join"
							},
							functions: [
								{ 
									action: "joinRoom", 
									arguments: [
										ctx => ({ roomname: ctx.state.roomname })
									] 
								},
								{
									action: {
										type: "SOCKET_JOIN_ROOM_REQUESTED",
										payload: ctx => ({ roomname: ctx.components._room })
									}
								}
							]

						},
					]
				},
				{
					type: "col",
					props: {
						span: 2,
					},
					children: [
						{
							type: "Button",
							name: "_button_create",
							bind: [],
							props: {
								label: "Create"
							},
							functions: [	
								{ 
									action: "joinRoom", 
									arguments: [
										ctx => ({ roomname: ctx.state.roomname })
									] 
								},
								{
									action: {
										type: "SOCKET_JOIN_ROOM_REQUESTED",
										payload: ctx => ({ roomname: ctx.components._room })
									}
								}
							]

						},
					]
				}
			]
		},
	]
}


const FactoryContext = createContext()


const useValidator = (target, scheme, rules) => {
	const [validations, setValidations] = useState([])

	const hasMounted = useRef()

	useEffect(() => {
		if(hasMounted.current) {
			const validationList = validator(target, scheme)
				.map(validation => {
					const index = rules.findIndex(rule => (rule.path === validation.path && rule.type === validation.target.type))
					if(index !== -1) {
						return {...validation, message: rules[index].message}
					}
					return validation
				})

			setValidations(validationList)
		}
	}, [target.state])


	useEffect(() => {
		if(!hasMounted.current && rules.length > 0) hasMounted.current = true
	},[])

	const helpMessages = validations.length ? validations.filter(validation => !validation.valid) : []
	const validationStatus = validations.length ? helpMessages.length === 0 ? "success" : "error" : ""

	return [validations, helpMessages, validationStatus]
}

const components = {
	Input: ({props, state, setstate, ...rest}) => {
		const { rules=[], required, validations, helpMessages, validationStatus } = rest

		return (
			<Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
				<Form.Item 
					colon={true}
					required={required}
					label={props.label}
					hasFeedback
					validateStatus={validationStatus}
					help={helpMessages.map((validation, i) => <div key={i} style={{fontSize: 12}}>{validation.message}</div>)}>
					<Input placeholder={props.placeholder} value={state} style={props.style} onChange={e => void setstate(e.target.value)} />
				</Form.Item>
			</Form>
		)
	},
	Button: ({props, state, setstate, context, components}) => {


		return <Button type="text" onClick={() => {}}>{props.label}</Button>
	}
}


function getComponentByType(type) {
	switch(type) {
		case "row": 
			return ({children, props}) => <Row gutter={props.gutter}>{children}</Row>
		case "col": 
			return ({children, props}) => <Col span={props.span} offset={props.offset}>{children}</Col>
		default: 
			if(type in components) {
				const Component = components[type]
				return ({children, ...props}) => <Component {...props}>{children}</Component>
			}
			return <div>Component not found</div>
	}
}

const genKey = () => Math.random().toString(36).substring(2)


function createSharedStore(init, name) {
	let _state = init || null;
	let _connectedComponents = [];
	let _idCounter = 0;

	const useSharedState = (name, personalState = {}, listen) => {
	  const [state, setState] = useState({ ..._state, [name]: personalState });
  
	  const _updatePrevComponents = useCallback(state => {
		_connectedComponents.forEach(component => component.setState(state));
	  }, []);
  

	  const changeState = useCallback(newVal => {
		_state[name] = newVal instanceof Function ? newVal(_state[name]) : newVal;

		_connectedComponents.forEach(component => {
				if(component.listen.includes(name)) {
					component.setState({ ..._state })
				}
			}
		);
	  }, [listen, _state]);
  
	  useEffect(() => {
		const compID = ++_idCounter;
		_state = { ..._state, [name]: personalState };
		_updatePrevComponents(_state);
  
		_connectedComponents.push({ id: compID, name, listen, setState });
  
		return () => {
		  const index = _connectedComponents.findIndex(component => component.id === compID);
		  _connectedComponents.splice(index, 1);
		};
	  }, []);
  
	  return [state, changeState];
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



const { useSharedState } = createSharedStore({})


function Structure(cmp) {
	const { 
		type="", 
		name=genKey()+"-"+genKey(), 
		children=[], 
		props={}, 
		bind=[], 
		defaultState=null, 
		span=null, 
		scheme={},
		rules=[], 
		required=false
	} = cmp.layout

	const Component = useMemo(() => getComponentByType(type), [])

	const [state, setState] = useSharedState(name, defaultState, [name, ...bind])
	const [validations, helpMessages, validationStatus] = useValidator({components: state, state: state[name]}, scheme, rules)

	const isRequired = useMemo(() => validations.some(valid =>  (valid.target.type === "Required" && !valid.valid)),[validationStatus])
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
			required={required || isRequired}
			validations={validations}
			helpMessages={helpMessages}
			validationStatus={validationStatus}
			children={children.map((component, key) => <Structure key={key} layout={component} />)}/>, 
		[state[name], props, children])
}


function Reader(props) {
	const { schema } = props

	return (
		<FactoryContext.Provider value={{}}>
			{schema.layout.map((component, key) => <Structure key={key} layout={component} />)}
		</FactoryContext.Provider>
	)
}



export default (props) => <Reader schema={schema} />