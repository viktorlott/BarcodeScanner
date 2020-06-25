


class ConditionEvaluation {
	constructor(event, context, generator, dispatch, functions) {
        this.context = context
        this.generator = generator
        this.dispatch = dispatch
        this.functions = functions

        if(this.checkIfUnaryExpression(event)) {
            this.create(event)
        } else {
            this.operation = "none"
            this.value = this.generator({...event, context: this.context})
        }

	}

    checkIfUnaryExpression(event) {
        switch(event.type) {
            case "and": 
            case "or": 
            case "equal": 
            case "notequal":
            case "lt":
            case "gt":  
            case "lte": 
            case "gte": 
                return true
        }
        return false
    }

    create(event) {
        this.addOperation(event)
        this.addLeft(event.left)
        this.addRight(event.right)
    }

    addOperation(event) {
        this.operation = event.type
    }

    addRight(event) {
        this.right = new ConditionEvaluation(event, this.context, this.generator, this.dispatch, this.functions)
    }

    addLeft(event) {
        this.left = new ConditionEvaluation(event, this.context, this.generator, this.dispatch, this.functions)
    }


    evaluate() {
        switch(this.operation) {
            case "and": 
                return this.left.evaluate() && this.right.evaluate()
            case "or": 
                return this.left.evaluate() || this.right.evaluate()
            case "equal": 
                return this.left.evaluate() === this.right.evaluate()
            case "notequal": 
                return this.left.evaluate() !== this.right.evaluate()
            case "lt": 
                return this.left.evaluate() < this.right.evaluate()
            case "gt": 
                return this.left.evaluate() > this.right.evaluate()
            case "lte": 
                return this.left.evaluate() <= this.right.evaluate()
            case "gte": 
                return this.left.evaluate() >= this.right.evaluate()
            case "none": 
                return this.value
        }
    }
}


export default ConditionEvaluation