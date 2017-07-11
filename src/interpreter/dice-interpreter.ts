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
        if (!expression) { throw new Error("Null node reference found."); }

        if (!expression.getAttribute("value")) {
            let value = 0;
            switch (expression.type) {
                case Ast.NodeType.Add:
                    this.expectChildCount(expression, 2);
                    value = this.evaluate(expression.getChild(0)) + this.evaluate(expression.getChild(1));
                    break;
                case Ast.NodeType.Subtract:
                    this.expectChildCount(expression, 2);
                    value = this.evaluate(expression.getChild(0)) - this.evaluate(expression.getChild(1));
                    break;
                case Ast.NodeType.Multiply:
                    this.expectChildCount(expression, 2);
                    value = this.evaluate(expression.getChild(0)) * this.evaluate(expression.getChild(1));
                    break;
                case Ast.NodeType.Divide:
                    this.expectChildCount(expression, 2);
                    value = this.evaluate(expression.getChild(0)) / this.evaluate(expression.getChild(1));
                    break;
                case Ast.NodeType.Modulo:
                    this.expectChildCount(expression, 2);
                    value = this.evaluate(expression.getChild(0)) % this.evaluate(expression.getChild(1));
                    break;
                case Ast.NodeType.Negate:
                    this.expectChildCount(expression, 1);
                    value = -this.evaluate(expression.getChild(0));
                    break;
                case Ast.NodeType.DiceSides: value = expression.getAttribute("value"); break;
                case Ast.NodeType.Dice: value = this.evaluateDice(expression); break;
                case Ast.NodeType.DiceRoll: value = this.evaluateDiceRoll(expression); break;
                case Ast.NodeType.Integer: value = expression.getAttribute("value"); break;
                case Ast.NodeType.Function: value = this.evaluateFunction(expression); break;
                case Ast.NodeType.Group: value = this.evaluateGroup(expression); break;
                case Ast.NodeType.Explode: value = this.evaluateExplode(expression); break;
                case Ast.NodeType.Keep: value = this.evaluateKeep(expression); break;
                case Ast.NodeType.Drop: value = this.evaluateDrop(expression); break;
                case Ast.NodeType.Critical: value = this.evaluateCritical(expression); break;
                case Ast.NodeType.Reroll: value = this.evaluateReroll(expression); break;
                case Ast.NodeType.Sort: value = this.evaluateSort(expression); break;
                case Ast.NodeType.Exponent:
                    this.expectChildCount(expression, 2);
                    value = Math.pow(this.evaluate(expression.getChild(0)), this.evaluate(expression.getChild(1)));
                    break;
                case Ast.NodeType.Equal:
                case Ast.NodeType.Greater:
                case Ast.NodeType.GreaterOrEqual:
                case Ast.NodeType.Less:
                case Ast.NodeType.LessOrEqual:
                    for (let x = 0; x < expression.getChildCount(); x++) {
                        this.evaluate(expression.getChild(x));
                    }
                    break;
                default: throw new Error("Unrecognized node.");
            }
            expression.setAttribute("value", value);
        }
        return expression.getAttribute("value");
    }

    evaluateComparison(lhs: number, expression: Ast.ExpressionNode): boolean {
        this.expectChildCount(expression, 1);
        switch (expression.type) {
            case Ast.NodeType.Equal: return lhs === this.evaluate(expression.getChild(0));
            case Ast.NodeType.Greater: return lhs > this.evaluate(expression.getChild(0));
            case Ast.NodeType.GreaterOrEqual: return lhs >= this.evaluate(expression.getChild(0));
            case Ast.NodeType.Less: return lhs < this.evaluate(expression.getChild(0));
            case Ast.NodeType.LessOrEqual: return lhs <= this.evaluate(expression.getChild(0));
            default: throw new Error("Unrecognized comparison operator.");
        }
    }

    private evaluateDiceRoll(expression: Ast.ExpressionNode): number {
        if (expression.getAttribute("success") !== 0) {
            return expression.getAttribute("value");
        }
        return 0;
    }

    private evaluateDice(expression: Ast.ExpressionNode): number {
        this.expectChildCount(expression, 2);
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
        this.expectChildCount(expression, 1);
        const dice = expression.getChild(0);
        let condition: Ast.ExpressionNode;
        const penetrate = expression.getAttribute("penetrate") === "yes";
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition);
        }

        this.evaluate(dice);

        const newRolls: Ast.ExpressionNode[] = [];

        let total = 0;
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            let die = dice.getChild(rollIndex);
            let dieValue = this.evaluate(die);
            total += dieValue;
            while (condition && this.evaluateComparison(dieValue, condition) || dieValue === die.getAttribute("sides")) {
                die = this.createDiceRoll(die.getAttribute("sides"));
                dieValue = this.evaluate(die);
                if (penetrate) { dieValue -= 1; }
                total += dieValue;
                newRolls.push(die);
            }
        }

        newRolls.forEach(newRoll => dice.addChild(newRoll));
        return total;
    }

    private evaluateKeep(expression: Ast.ExpressionNode): number {
        // TODO: Implement evaluateKeep.
        return 0;
    }

    private evaluateDrop(expression: Ast.ExpressionNode): number {
        // TODO: Implement evaluateDrop.
        return 0;
    }

    private evaluateCritical(expression: Ast.ExpressionNode): number {
        // TODO: Implement evaluateCritical.
        return 0;
    }

    private evaluateReroll(expression: Ast.ExpressionNode): number {
        this.expectChildCount(expression, 1);
        const dice = expression.getChild(0);
        let condition: Ast.ExpressionNode;
        const once = expression.getAttribute("once") === "yes";
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition);
        }

        this.evaluate(dice);

        let total = 0;
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            const die = dice.getChild(rollIndex);
            let dieValue = this.evaluate(die);
            while (condition && this.evaluateComparison(dieValue, condition) || dieValue === 1) {
                dieValue = this.createDiceRollValue(die.getAttribute("sides"));
                if (once) { break; }
            }
            die.setAttribute("value", dieValue);
            total += dieValue;
        }

        return total;
    }

    private evaluateSort(expression: Ast.ExpressionNode): number {
        // TODO: Implement evaluateSort.
        return 0;
    }

    private createDiceRoll(sides: Ast.ExpressionNode | number): Ast.ExpressionNode {
        const sidesValue = sides instanceof Ast.ExpressionNode
            ? sides.getAttribute("value")
            : sides;
        const diceRoll = this.createDiceRollValue(sides);
        return Ast.Factory.create(Ast.NodeType.DiceRoll)
            .setAttribute("value", diceRoll)
            .setAttribute("sides", sidesValue);
    }

    private createDiceRollValue(sides: Ast.ExpressionNode | number): number {
        let minValue = 1, maxValue = 0;

        const sidesValue = sides instanceof Ast.ExpressionNode
            ? sides.getAttribute("value")
            : sides;

        if (sidesValue === "fate") {
            minValue = -1; maxValue = 1;
        } else {
            maxValue = Math.round(sides instanceof Ast.ExpressionNode ? this.evaluate(sides) : sides);
        }
        return this.random.numberBetween(minValue, maxValue);
    }

    countSuccesses(expression: Ast.ExpressionNode): number {
        // TODO: Implement successes.
        return 0;
    }

    countFailures(expression: Ast.ExpressionNode): number {
        // TODO: Implement failures.
        return 0;
    }

    private expectChildCount(expression: Ast.ExpressionNode, count: number) {
        const findCount = expression.getChildCount();
        if (findCount < count) {
            throw new Error(`Expected ${expression.type} node to have ${count} children, but found ${findCount}.`)
        }
    }
}
