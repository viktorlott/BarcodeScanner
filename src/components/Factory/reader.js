
import React, { useState, useContext, useMemo, useEffect, useReducer, createContext, useCallback, useRef } from "react"

import { Form, Row, Col, Input, Button, Icon } from 'antd';

import validator from '../../utils/validator'

import actions from '../../actions'

import get from 'lodash/get'

import schema from './schema_test'

import { useDispatch, useSelector } from 'react-redux'


import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components'

import Reference from './ReferenceType'
import isEmpty from 'lodash/isEmpty'
import { set } from "lodash";

const FactoryContext = createContext()

const { useSharedState } = createSharedStore({})


const Hover = styled.div`
	box-sizing: border-box;
	border: 2px dashed transparent;
	transition: border 0.1s ease-in-out;

	&:hover {
		border: 2px dashed #5050501f;
	}
`

const IsActive = styled.div`
	box-sizing: border-box;
	transition: border 0.1s ease-in-out;
	border: ${props => props.over ? "2px dashed #5050501f" : "2px dashed transparent"};
	background: ${props => props.over ? "#eee" : "unset"};
	border-radius: 3px;
	
`


const DroppableWrapper = (props) => {


	return (
		<Droppable droppableId={props.droppableId}>
		{(provided, snapshot) => {

			return (
				<IsActive 
					className={props.className}
					over={snapshot.isDraggingOver} 
					ref={provided.innerRef}
					{...provided.droppableProps}>
						{props.children}
						{provided.placeholder}
				</IsActive>
			)
		}}
		</Droppable>
	)
}





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
					// validateStatus={validationStatus}
					// help={helpMessages.map((validation, i) => <div key={i} style={{ fontSize: 12 }}>{validation.message}</div>)}
					>
					<Input placeholder={props.placeholder} value={state || defaultState} style={props.style} onChange={e => void setstate(e.target.value)} />
				</Form.Item>
			</Form>
		)
	},
	Button: ({ props, state, setstate, context, components, events }) => {
		return <Button type="text" {...events}>{props.label}</Button>
	},
	OldInput: ({ props, state, setstate, context, components, events }) => {
		return (
				<div>
					<label htmlFor="">{props.label}</label>
					<input type="text" {...events} value={state} onChange={e => void setstate(e.target.value)} />
				</div>

		)
	}
}


function getComponentByType(type) {

	switch (type) {
		case "row":
			return ({ children, props, name, id }) => 
			<Row gutter={props.gutter}>
				<DroppableWrapper droppableId={id}>
						{children}
				</DroppableWrapper>
			</Row>
		case "col":
			return ({ children, props, name, id, index }) => {
				return (
					<Col span={props.span} offset={props.offset}>
						<DroppableWrapper droppableId={id}>
							{children}
						</DroppableWrapper>
					</Col>
				)

			}
		default: {
			if (type in components) {
				const Component = components[type]

				return ({ children, ...props }) => {

					return (
						<Draggable draggableId={props.id} index={props.index}>
						{(provided, snapshot) => {
							const style = {
							backgroundColor: snapshot.isDragging ? 'unset' : 'unset',
							...provided.draggableProps.style,
							}

							return (
								<Hover
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									style={style}>
									<Component {...props} >{children}</Component>
								</Hover>
							)
						}}
						</Draggable>
					)
				}
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



function useComponentEvents({events, context, id, name, functions, actions}) {
	const dispatch = useDispatch()

	const _events = useMemo(() => {
		let transformedEvents = {}
		for(let [eventName, event] of Object.entries(events)) {
			transformedEvents[eventName] = (e) => {
				e.presist && e.presist()
				event.forEach(ev => void Reference.evaluate(ev, { context, dispatch, functions, actions }))
			}
		}
		return transformedEvents
	},[events, context.components, name, id])
	
	return _events
}


function useEffectHandlers(effects, state, factoryContext) {
	const hasMounted = useRef()
	const dispatch = useDispatch()

	useEffect(() => {
		if(effects && effects.onMount) {
			effects.onMount.map(effect => Reference.evaluate(effect, {context: { components: state }, functions: factoryContext.functions, dispatch, actions}))
		}

		return () => {
			if(effects && effects.onUnMount) {
				effects.onUnMount.map(effect =>  Reference.evaluate(effect, {context: { components: state }, functions: factoryContext.functions, dispatch, actions}))
			}
		}
	},[])


	useEffect(() => {
		if(effects && effects.onUpdate) {
			effects.onUpdate.map(effect =>  Reference.evaluate(effect, {context: { components: state }, functions: factoryContext.functions, dispatch, actions}))
		}
	})
}



function Structure(comp) {
	const {
		type = "",
		name = genKey() + "-" + genKey(),
		id,
		children = [],
		props = {},
		bind = [],
		defaultState = null,
		events={},
		effects=[],
		span = null,
		scheme = {},
		rules = [],
		required = false,
	} = comp.layout

	const index = comp.index
	const Component =                                     useMemo(() => getComponentByType(type), [name, id])
	const factoryContext =                                useContext(FactoryContext)
	const [personalState, state, setState] =              useSharedState(name, (_state) => defaultState ?  Reference.evaluate(defaultState, {context: { components: _state }, functions: factoryContext.functions, actions }) : null, [name, id, ...bind], { filter: true })
	// const [validations, helpMessages, validationStatus] = useValidator({ components: state, state: personalState }, scheme, rules)
	// const isRequired =                                    useMemo(() => validations.some(valid => (valid.target.type === "Required" && !valid.valid)), [validationStatus])
	const _events =                                       useComponentEvents({events, context: { components: state }, name, functions: factoryContext.functions, actions})
	const viewState =                                     useViewStore({ id: "1234", page: factoryContext.page })
	

	useEffectHandlers(effects, state, factoryContext)

	const size = span ? { span } : {}

	return useMemo(() =>
			<Component
				{...size}
				index={index}

				props={{...props, label: props.label ? Reference.evaluate(props.label, {  context: { components: state }, functions: factoryContext.functions, actions }) : null }}
				name={name}
				id={id}
				state={state[name]}
				setstate={setState}
				components={state}
				rules={rules}
				events={_events}
				// required={required || isRequired}
				// validations={validations}
				// helpMessages={helpMessages}
				// validationStatus={validationStatus}
				children={children.map((component, key) => <Structure key={key} index={key} layout={component} />)} />,
		[state[name], props, children, id, name])
}


function Reader(props) {
	const [layout, setLayout] = useState(props.layout)


	const onDragEnd = ({ source, destination }) => {

		if (!destination) {
		  return
		}

		setLayout(_layout => _layout.move(source, destination))
	}


	return (
			
		<DragDropContext onDragEnd={onDragEnd}>
			{layout.children.map((component, key) => <Structure key={key} index={key} layout={component} />)}
		</DragDropContext>
	)
}



class Layout {
	constructor(children) {
		this.children = children
	}

	static create(children) {
		return new Layout(Layout._addIDsToLayout(children))
	}

	static _addIDsToLayout(children) {
		return children.map(component => {
	
			component.id = genKey() + "-" + genKey()
			if(component.children) {
				component.children = this._addIDsToLayout(component.children)
			}
			return component
		})
	}

	move(source, destination) {
		const comp = this._flatten(this.children)[source.droppableId].children[source.index]
		return new Layout(this._move(this.children, source, destination, comp))
	}

	_move(children, source, destination, comp) {
		return children.map(component => {
	
			if(component.id === source.droppableId) {
				if(component.children) {
	
					component.children.splice(source.index, 1)
				}
			}
			if(component.id === destination.droppableId) {
				if(component.children) {
					component.children.splice(destination.index, 0, comp)
				}
			}
			if(component.children) {
				this._move(component.children, source, destination, comp)
			}
			return component
		})

	}

	_flatten(children, compSet={}) {
		children.forEach(component => {
	
			compSet[component.id] = {...component}
			if(component.children) {
				this._flatten(component.children, compSet)
			}
		})
		return compSet
	}

}



export default (props) => {
 return (
	<FactoryContext.Provider value={{ functions: schema.functions, page: schema.name, id: genKey() + "-" + genKey() }}>
 		<Reader schema={schema} layout={Layout.create(schema.layout)} />
	</FactoryContext.Provider>
 )
}