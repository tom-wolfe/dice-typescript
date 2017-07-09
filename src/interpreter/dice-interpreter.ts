import * as Ast from "../ast";
import { DefaultRandomProvider } from "../default-random-provider";
import { RandomProvider } from "../random-provider";
import { DefaultFunctionDefinitions } from "./default-function-definitions";
import { DiceResult } from "./dice-result";
import { FunctionDefinitionList } from "./function-definition-list";
import { Interpreter } from "./interpreter";

export class DiceInterpreter implements Interpreter {
    protected functions: FunctionDefinitionList;

    constructor(functions?: FunctionDefinitionList, protected random: RandomProvider = new DefaultRandomProvider()) {
        this.functions = DefaultFunctionDefinitions;
        (<any>Object).assign(this.functions, functions);
    }

    interpret(expression: Ast.ExpressionNode): DiceResult {
        const exp = expression.copy();
        const total = this.evaluate(exp);
        const successes = this.countSuccesses(exp);
        const fails = this.countFailures(exp);
        return new DiceResult(exp, total, successes, fails);
    }

    evaluate(expression: Ast.ExpressionNode): number {
        if (!expression.getAttribute("value")) {
            let value: number;
            switch (expression.type) {
                case Ast.NodeType.Add: value = this.evaluate(expression.getChild(0)) + this.evaluate(expression.getChild(1)); break;
                case Ast.NodeType.Subtract: value = this.evaluate(expression.getChild(0)) - this.evaluate(expression.getChild(1)); break;
                case Ast.NodeType.Multiply: value = this.evaluate(expression.getChild(0)) * this.evaluate(expression.getChild(1)); break;
                case Ast.NodeType.Divide: value = this.evaluate(expression.getChild(0)) / this.evaluate(expression.getChild(1)); break;
                case Ast.NodeType.Modulo: value = this.evaluate(expression.getChild(0)) % this.evaluate(expression.getChild(1)); break;
                case Ast.NodeType.Negate: value = -this.evaluate(expression.getChild(0)); break;
                case Ast.NodeType.DiceSides: value = expression.getAttribute("value"); break;
                case Ast.NodeType.Dice: value = this.evaluateDice(expression); break;
                case Ast.NodeType.DiceRoll: value = this.evaluateDiceRoll(expression); break;
                case Ast.NodeType.Integer: value = expression.getAttribute("value"); break;
                case Ast.NodeType.Function: value = this.evaluateFunction(expression); break;
                case Ast.NodeType.Exponent:
                    value = Math.pow(this.evaluate(expression.getChild(0)), this.evaluate(expression.getChild(1)));
                    break;
            }
            expression.setAttribute("value", value);
        }
        return expression.getAttribute("value");
    }

    private evaluateDiceRoll(expression: Ast.ExpressionNode): number {
        if (expression.getAttribute("success") !== 0) {
            return expression.getAttribute("value");
        }
        return 0;
    }

    private evaluateDice(expression: Ast.ExpressionNode): number {
        const num = this.evaluate(expression.getChild(0));
        const sides = expression.getChild(1);
        expression.clearChildren();

        let total = 0;
        for (let x = 0; x < num; x++) {
            let minValue = 1, maxValue = 0;
            if (sides.getAttribute("value") === "fate") {
                minValue = -1; maxValue = 1;
            } else {
                maxValue = this.evaluate(sides)
            }
            const diceRoll = this.random.numberBetween(minValue, maxValue);
            expression.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute("value", diceRoll));
            total += diceRoll;
        }
        return total;
    }

    private evaluateFunction(expression: Ast.ExpressionNode): number {
        const fName = expression.getAttribute("name");
        if (Object.keys(this.functions).indexOf(fName) === -1) {
            throw new Error(`Unknown function: ${fName}`);
        }
        const result = this.functions[fName](this, expression);
        return result;
    }

    countSuccesses(expression: Ast.ExpressionNode): number {
        // TODO: Implement.
        return 0;
    }

    countFailures(expression: Ast.ExpressionNode): number {
        // TODO: Implement.
        return 0;
    }
}
