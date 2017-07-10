import * as Ast from "../ast";
import { DefaultRandomProvider } from "../default-random-provider";
import { RandomProvider } from "../random-provider";
import { DefaultFunctionDefinitions } from "./default-function-definitions";
import { DiceResult } from "./dice-result";
import { FunctionDefinitionList } from "./function-definition-list";
import { Interpreter } from "./interpreter";

export class DiceInterpreter implements Interpreter {
    protected functions: FunctionDefinitionList;
    protected random: RandomProvider;

    constructor(functions?: FunctionDefinitionList, random?: RandomProvider) {
        this.functions = DefaultFunctionDefinitions;
        (<any>Object).assign(this.functions, functions);
        this.random = random || new DefaultRandomProvider()
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
                case Ast.NodeType.Group: value = this.evaluateGroup(expression); break;

                case Ast.NodeType.Equal: break;
                case Ast.NodeType.Greater: break;
                case Ast.NodeType.GreaterOrEqual: break;
                case Ast.NodeType.Less: break;
                case Ast.NodeType.LessOrEqual: break;

                case Ast.NodeType.Explode: value = this.evaluateExplode(expression); break;
                case Ast.NodeType.Keep: break;
                case Ast.NodeType.Drop: break;
                case Ast.NodeType.Critical: break;
                case Ast.NodeType.Reroll: break;
                case Ast.NodeType.Sort: break;

                case Ast.NodeType.Exponent:
                    value = Math.pow(this.evaluate(expression.getChild(0)), this.evaluate(expression.getChild(1)));
                    break;
                default: throw new Error("Unrecognized node.");
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
        const num = Math.round(this.evaluate(expression.getChild(0)));
        const sides = expression.getChild(1);
        expression.clearChildren();

        let total = 0;
        for (let x = 0; x < num; x++) {
            const diceRoll = this.createDiceRoll(sides);
            expression.addChild(diceRoll);
            total += this.evaluate(diceRoll);
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

    private evaluateGroup(expression: Ast.ExpressionNode): number {
        let total = 0;
        for (let x = 0; x < expression.getChildCount(); x++) {
            total += this.evaluate(expression.getChild(x));
        }
        return total;
    }

    private evaluateExplode(expression: Ast.ExpressionNode): number {
        const dice = expression.getChild(0);
        let greater: Ast.ExpressionNode;

        if (expression.getChildCount() > 1) {
            greater = expression.getChild(1);
        }

        this.evaluate(dice);
        this.evaluate(greater);

        const newRolls: Ast.ExpressionNode[] = [];

        let total = 0;
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            let die = dice.getChild(rollIndex);
            let dieValue = this.evaluate(die);
            total += dieValue;
            while (greater && this.evaluateComparison(dieValue, greater) || dieValue === die.getAttribute("sides")) {
                die = this.createDiceRoll(die.getAttribute("sides"));
                dieValue = this.evaluate(die);
                total += dieValue;
                newRolls.push(die);
            }
        }

        newRolls.forEach(newRoll => dice.addChild(newRoll));
        return total;
    }

    private evaluateComparison(lhs: number, expression: Ast.ExpressionNode): boolean {
        switch (expression.type) {
            case Ast.NodeType.Equal: return lhs === this.evaluate(expression.getChild(0));
            case Ast.NodeType.Greater: return lhs > this.evaluate(expression.getChild(0));
            case Ast.NodeType.GreaterOrEqual: return lhs >= this.evaluate(expression.getChild(0));
            case Ast.NodeType.Less: return lhs < this.evaluate(expression.getChild(0));
            case Ast.NodeType.LessOrEqual: return lhs <= this.evaluate(expression.getChild(0));
            default: throw new Error("Unrecognized comparison operator.");
        }
    }

    private createDiceRoll(sides: Ast.ExpressionNode | number): Ast.ExpressionNode {
        let minValue = 1, maxValue = 0;

        const sidesValue = sides instanceof Ast.ExpressionNode
            ? sides.getAttribute("value")
            : sides;

        if (sidesValue === "fate") {
            minValue = -1; maxValue = 1;
        } else {
            maxValue = Math.round(sides instanceof Ast.ExpressionNode ? this.evaluate(sides) : sides);
        }
        const diceRoll = this.random.numberBetween(minValue, maxValue);
        return Ast.Factory.create(Ast.NodeType.DiceRoll)
            .setAttribute("value", diceRoll)
            .setAttribute("sides", sidesValue);
    }

    countSuccesses(expression: Ast.ExpressionNode): number {
        // TODO: Implement successes.
        return 0;
    }

    countFailures(expression: Ast.ExpressionNode): number {
        // TODO: Implement failures.
        return 0;
    }
}
