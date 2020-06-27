
import ConditionEvaluation from './ConditionEvaluation'

import get from 'lodash/get'

class Dependencies {
    constructor(dependencies) {
        this.dependencies = dependencies
    }

    _findFunction(name) {
        return name ? this.dependencies.functions.find(func => func.name === name) : null
    }

    _findAction(name) {
        if(name && this.dependencies.actions[name]) {
            return this.dependencies.actions[name]
        }
        return () => {}
    }

}



class Reference extends Dependencies {
    constructor(reference, dependencies) {
        super(dependencies)

        this.type = reference.type
        this.reference = reference
    }

    dispatch(reference) {
        const ref = new DispatchType(reference, this.dependencies)
        return ref.evaluate()
    }

    anonymous(reference) {
        const ref = new AnonymousType(reference, this.dependencies)
        return ref.evaluate()
    }

    component(reference) {
        const ref = new ComponentType(reference, this.dependencies)
        return ref.evaluate()
    }

    function(reference) {
        const ref = new FunctionType(reference, this.dependencies)
        return ref.evaluate()
    }

    statement(reference) {
        const ref = new StatementType(reference, this.dependencies)
        return ref.evaluate()
    }

    object(reference) {
        const ref = new ObjectType(reference, this.dependencies)
        return ref.evaluate()
    }

    array(reference) {
        const ref = new ArrayType(reference, this.dependencies)
        return ref.evaluate()
    }

    number(reference) {
        const ref = new NumberType(reference, this.dependencies)
        return ref.evaluate()
    }

    string(reference) {
        const ref = new StringType(reference, this.dependencies)
        return ref.evaluate()
    }

    boolean(reference) {
        const ref = new BooleanType(reference, this.dependencies)
        return ref.evaluate()
    }

    _create(reference) {
        if(reference.type && this[reference.type]) {
            return this[reference.type](reference)
        } else {
            return null
        }
    }

    evaluate() {
        return this._create(this.reference)
    }

    static evaluate(reference, dependencies) {
        const ref = new Reference(reference, dependencies)
        return ref.evaluate()
    }

}



class DispatchType extends Reference {
    evaluate() {
        const { name, arguments: params } = this.reference
        const action = this._findAction(name)

        if(name && action) {
            const args = params.map(arg => this.create(arg))
            return this.dependencies.dispatch(action(...args))
        }
        return this.dependencies.dispatch(this._create(this.reference.action))
    }
}

class StatementType extends Reference {
    evaluate() {
        const { condition, then, elseThen } = this.reference

		const conditionEvaluation = new ConditionEvaluation(condition, this.dependencies)
        const result = conditionEvaluation.evaluate()

        if(result) {
            return this._create(then)
        } else {
            return this._create(elseThen)
        }
    }
}

class ObjectType extends Reference {
    evaluate() {
        const { data } = this.reference
		let _data = {}
        for(let keyval of data) {
            _data[keyval.key] = keyval.path ? get(this.dependencies.context, keyval.path, null) : keyval.value
        }
        return _data
    }
    
}
class AnonymousType extends Reference {
    evaluate() {
        const { returns } = this.reference
        return returns ? this._create(returns) : null
    }
    
}
class FunctionType extends Reference {

    _anonymousFunction() {
        const { returns, anonymous } = this.reference
        return anonymous ? (() => returns ? this._create(returns) : null)() : () => returns ? this._create(returns) : null
    }

    evaluate() {
        const { name } = this.reference
        let { function: func } = this._findFunction(name)

        if(func) {
            return this._create(func)
        }

        return this._anonymousFunction()
    }
    
}
class ComponentType extends Reference {
    evaluate() {
        const { data } = this.reference
        let _data = null
        if(Array.isArray(data)) {
            for(let keyval of data) {
                _data = keyval.name ? get(this.dependencies.context, ["components",keyval.name], null) : keyval.value
            }
        } else {
            _data = data.name ? get(this.dependencies.context, ["components",data.name], null) : data.value
        }
        return _data
    }
    
}

class ArrayType extends Reference {
    evaluate() {
        const { data } = this.reference
		let _data = []
        for(let keyval of data) {
            _data.push(keyval.path ? get(this.dependencies.context, keyval.path, null) : keyval.value)
        }
        return _data
    }
    
}
class NumberType extends Reference {
    evaluate() {
        const { data } = this.reference
		let _data = 0
			if(Array.isArray(data)) {
				for(let keyval of data) {
					_data = keyval.path ? get(this.dependencies.context, keyval.path, null) : keyval.value
				}
			} else {
				_data = data.path ? get(this.dependencies.context, data.path, null) : data.value
			}
			return Number(_data)
    }
    
}
class StringType extends Reference {
    evaluate() {
        const { data } = this.reference
        let _data = ""
        if(Array.isArray(data)) {
            for(let keyval of data) {
                _data = keyval.path ? get(this.dependencies.context, keyval.path, null) : keyval.value
            }
        } else {
            _data = data.path ? get(this.dependencies.context, data.path, null) : data.value
        }
        return _data
    }
    
}
class BooleanType extends Reference {
    evaluate() {
        const { data } = this.reference
		let _data = false
			if(Array.isArray(data)) {
				for(let keyval of data) {
					_data = keyval.path ? get(this.dependencies.context, keyval.path, null) : keyval.value
				}
			} else {
				_data = data.path ? get(this.dependencies.context, data.path, null) : data.value
			}
			return !!_data
    }
    
}





export default Reference

