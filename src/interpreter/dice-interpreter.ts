import { ErrorMessage } from "./error-message";
import * as Ast from "../ast";
import { DefaultRandomProvider } from "../default-random-provider";
import { RandomProvider } from "../random-provider";
import { DefaultFunctionDefinitions } from "./default-function-definitions";
import { DiceResult } from "./dice-result";
import { FunctionDefinitionList } from "./function-definition-list";
import { Interpreter } from "./interpreter";

export class DiceInterpreter implements Interpreter<DiceResult> {
    protected functions: FunctionDefinitionList;
    protected random: RandomProvider;

    constructor(functions?: FunctionDefinitionList, random?: RandomProvider) {
        this.functions = DefaultFunctionDefinitions;
        (<any>Object).assign(this.functions, functions);
        this.random = random || new DefaultRandomProvider()
    }

    interpret(expression: Ast.ExpressionNode): DiceResult {
        const exp = expression.copy();
        const errors: ErrorMessage[] = []
        const total = this.evaluate(exp, errors);
        const successes = this.countSuccesses(exp, errors);
        const fails = this.countFailures(exp, errors);
        return new DiceResult(exp, total, successes, fails, errors);
    }

    evaluate(expression: Ast.ExpressionNode, errors: ErrorMessage[]): any {
        if (!expression) { errors.push(new ErrorMessage("Unexpected null node reference found.", expression)); return 0; }
        if (expression.type === Ast.NodeType.DiceRoll) {
            return this.evaluateDiceRoll(expression, errors);
        } else if (!expression.getAttribute("value")) {
            let value: any = 0;
            switch (expression.type) {
                case Ast.NodeType.Add: value = this.evaluateAdd(expression, errors); break;
                case Ast.NodeType.Subtract: value = this.evaluateSubtract(expression, errors); break;
                case Ast.NodeType.Multiply: value = this.evaluateMultiply(expression, errors); break;
                case Ast.NodeType.Divide: value = this.evaluateDivide(expression, errors); break;
                case Ast.NodeType.Modulo: value = this.evaluateModulo(expression, errors); break;
                case Ast.NodeType.Negate: value = this.evaluateNegate(expression, errors); break;
                case Ast.NodeType.Exponent: value = this.evaluateExponent(expression, errors); break;
                case Ast.NodeType.DiceSides: value = this.evaluateDiceSides(expression, errors); break;
                case Ast.NodeType.Dice: value = this.evaluateDice(expression, errors); break;
                case Ast.NodeType.Integer: value = this.evaluateInteger(expression, errors); break;
                case Ast.NodeType.Function: value = this.evaluateFunction(expression, errors); break;
                case Ast.NodeType.Group: value = this.evaluateGroup(expression, errors); break;
                case Ast.NodeType.Explode: value = this.evaluateExplode(expression, errors); break;
                case Ast.NodeType.Keep: value = this.evaluateKeep(expression, errors); break;
                case Ast.NodeType.Drop: value = this.evaluateDrop(expression, errors); break;
                case Ast.NodeType.Critical: value = this.evaluateCritical(expression, errors); break;
                case Ast.NodeType.Reroll: value = this.evaluateReroll(expression, errors); break;
                case Ast.NodeType.Sort: value = this.evaluateSort(expression, errors); break;
                case Ast.NodeType.Equal: value = this.evaluateEqual(expression, errors); break;
                case Ast.NodeType.Greater: value = this.evaluateGreater(expression, errors); break;
                case Ast.NodeType.GreaterOrEqual: value = this.evaluateGreaterOrEqual(expression, errors); break;
                case Ast.NodeType.Less: value = this.evaluateLess(expression, errors); break;
                case Ast.NodeType.LessOrEqual: value = this.evaluateLessOrEqual(expression, errors); break;
                default:
                    errors.push(new ErrorMessage(`Unrecognized node type '${expression.type}'.`, expression));
                    return 0;
            }
            expression.setAttribute("value", value);
        }
        return expression.getAttribute("value");
    }

    evaluateAdd(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) + this.evaluate(expression.getChild(1), errors);
    }

    evaluateSubtract(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) - this.evaluate(expression.getChild(1), errors);
    }

    evaluateMultiply(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) * this.evaluate(expression.getChild(1), errors);
    }

    evaluateDivide(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) / this.evaluate(expression.getChild(1), errors);
    }

    evaluateModulo(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) % this.evaluate(expression.getChild(1), errors);
    }

    evaluateExponent(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 2, errors);
        return Math.pow(this.evaluate(expression.getChild(0), errors), this.evaluate(expression.getChild(1), errors));
    }

    evaluateNegate(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 1, errors);
        return -this.evaluate(expression.getChild(0), errors);
    }

    evaluateInteger(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        return expression.getAttribute("value");
    }

    evaluateDiceSides(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        return expression.getAttribute("value");
    }

    evaluateDiceRoll(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        if (expression.getAttribute("drop") !== "yes") {
            return expression.getAttribute("value");
        }
        return 0;
    }

    evaluateDice(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 2, errors);
        const num = Math.round(this.evaluate(expression.getChild(0), errors));
        const sides = expression.getChild(1);
        expression.setAttribute("sides", this.evaluate(sides, errors));

        expression.clearChildren();

        let total = 0;
        for (let x = 0; x < num; x++) {
            const diceRoll = this.createDiceRoll(sides, errors);
            expression.addChild(diceRoll);
            total += this.evaluate(diceRoll, errors);
        }
        return total;
    }

    evaluateFunction(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        const fName = expression.getAttribute("name");
        if (Object.keys(this.functions).indexOf(fName) === -1) {
            errors.push(new ErrorMessage(`Unknown function: ${fName}`, expression));
        }
        const result = this.functions[fName](this, expression, errors);
        return result;
    }

    private evaluateGroup(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        let total = 0;
        for (let x = 0; x < expression.getChildCount(); x++) {
            total += this.evaluate(expression.getChild(x), errors);
        }
        return total;
    }

    evaluateExplode(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 1, errors);
        const dice = this.findLeftmostDiceNode(expression, errors);
        let condition: Ast.ExpressionNode;
        const penetrate = expression.getAttribute("penetrate") === "yes";
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition, errors);
        }

        this.evaluate(dice, errors);

        const newRolls: Ast.ExpressionNode[] = [];

        let total = 0;
        const sides = dice.getAttribute("sides");
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            let die = dice.getChild(rollIndex);
            if (die.getAttribute("drop") === "yes") { continue; }
            let dieValue = this.evaluate(die, errors);
            total += dieValue;
            while (condition && this.evaluateComparison(dieValue, condition, errors) || dieValue === sides) {
                die = this.createDiceRoll(sides, errors);
                dieValue = this.evaluate(die, errors);
                if (penetrate) { dieValue -= 1; }
                total += dieValue;
                newRolls.push(die);
            }
        }

        newRolls.forEach(newRoll => dice.addChild(newRoll));
        return total;
    }

    evaluateKeep(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 1, errors);
        const dice = this.findLeftmostDiceNode(expression, errors);
        const countTotal = (expression.getChildCount() > 1) ? this.evaluate(expression.getChild(1), errors) : 1;
        const type = expression.getAttribute("type");
        this.evaluate(dice, errors);

        const rolls = this.getSortedDiceRolls(dice, (type === "lowest") ? "ascending" : "descending", errors).rolls;

        let count = 0;
        let total = 0;
        rolls.forEach(roll => {
            if (count < countTotal) {
                roll.setAttribute("drop", "no");
                total += roll.getAttribute("value");
            } else {
                roll.setAttribute("drop", "yes");
            }
            count++;
        });
        return total;
    }

    evaluateDrop(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 1, errors);
        const dice = this.findLeftmostDiceNode(expression, errors);
        const countTotal = (expression.getChildCount() > 1) ? this.evaluate(expression.getChild(1), errors) : 1;
        const type = expression.getAttribute("type");
        this.evaluate(dice, errors);

        const rolls = this.getSortedDiceRolls(dice, (type === "lowest") ? "ascending" : "descending", errors).rolls;
        let count = 0;
        let total = 0;
        rolls.forEach(roll => {
            if (count < countTotal) {
                roll.setAttribute("drop", "yes");
            } else {
                roll.setAttribute("drop", "no");
                total += roll.getAttribute("value");
            }
            count++;
        });
        return total;
    }

    evaluateCritical(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 1, errors);
        const dice = this.findLeftmostDiceNode(expression, errors);
        const type = expression.getAttribute("type");

        let condition: Ast.ExpressionNode;
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition, errors);
        } else {
            condition = Ast.Factory.create(Ast.NodeType.Equal);
            if (type === "success") {
                this.expectChildCount(dice, 2, errors);
                condition.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", dice.getAttribute("sides")));
            } else {
                condition.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 1));
            }
        }

        this.evaluate(dice, errors);

        let total = 0;
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            const die = dice.getChild(rollIndex);
            const dieValue = this.evaluate(die, errors);
            if (this.evaluateComparison(dieValue, condition, errors)) {
                die.setAttribute("critical", type);
            }
            total += dieValue;
        }

        return total;
    }

    evaluateReroll(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 1, errors);
        const dice = this.findLeftmostDiceNode(expression, errors);
        let condition: Ast.ExpressionNode;
        const once = expression.getAttribute("once") === "yes";
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition, errors);
        }

        this.evaluate(dice, errors);

        let total = 0;
        const sides = dice.getAttribute("sides");
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            const die = dice.getChild(rollIndex);
            if (die.getAttribute("drop") === "yes") { continue; }
            let dieValue = this.evaluate(die, errors);
            while (condition && this.evaluateComparison(dieValue, condition, errors) || dieValue === 1) {
                dieValue = this.createDiceRollValue(sides, errors);
                if (once) { break; }
            }
            die.setAttribute("value", dieValue);
            total += dieValue;
        }

        return total;
    }

    evaluateSort(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        this.expectChildCount(expression, 1, errors);
        const dice = this.findLeftmostDiceNode(expression, errors);
        const rolls = this.getSortedDiceRolls(dice, expression.getAttribute("direction"), errors);
        dice.clearChildren();
        rolls.rolls.forEach(roll => dice.addChild(roll));
        return rolls.total;
    }

    evaluateEqual(expression: Ast.ExpressionNode, errors: ErrorMessage[]): boolean {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) === this.evaluate(expression.getChild(1), errors);
    }

    evaluateGreater(expression: Ast.ExpressionNode, errors: ErrorMessage[]): boolean {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) < this.evaluate(expression.getChild(1), errors);
    }

    evaluateGreaterOrEqual(expression: Ast.ExpressionNode, errors: ErrorMessage[]): boolean {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) >= this.evaluate(expression.getChild(1), errors);
    }

    evaluateLess(expression: Ast.ExpressionNode, errors: ErrorMessage[]): boolean {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) < this.evaluate(expression.getChild(1), errors);
    }

    evaluateLessOrEqual(expression: Ast.ExpressionNode, errors: ErrorMessage[]): boolean {
        this.expectChildCount(expression, 2, errors);
        return this.evaluate(expression.getChild(0), errors) <= this.evaluate(expression.getChild(1), errors);
    }

    countSuccesses(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        // TODO: Implement successes.
        return 0;
    }

    countFailures(expression: Ast.ExpressionNode, errors: ErrorMessage[]): number {
        // TODO: Implement failures.
        return 0;
    }

    private expectChildCount(expression: Ast.ExpressionNode, count: number, errors: ErrorMessage[]) {
        const findCount = expression.getChildCount();
        if (findCount < count) {
            const err = new ErrorMessage(`Expected ${expression.type} node to have ${count} children, but found ${findCount}.`, expression);
            errors.push(err);
        }
    }

    private evaluateComparison(lhs: number, expression: Ast.ExpressionNode, errors: ErrorMessage[]): boolean {
        this.expectChildCount(expression, 1, errors);
        switch (expression.type) {
            case Ast.NodeType.Equal: return lhs === this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.Greater: return lhs > this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.GreaterOrEqual: return lhs >= this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.Less: return lhs < this.evaluate(expression.getChild(0), errors);
            case Ast.NodeType.LessOrEqual: return lhs <= this.evaluate(expression.getChild(0), errors);
            default:
                errors.push(new ErrorMessage(`Unrecognized comparison operator '${expression.type}'.`, expression));
                return false;
        }
    }

    private findLeftmostDiceNode(expression: Ast.ExpressionNode, errors: ErrorMessage[]): Ast.ExpressionNode {
        if (expression.type === Ast.NodeType.Dice || expression.type === Ast.NodeType.Group) {
            return expression;
        }
        if (expression.getChildCount() < 1) {
            errors.push(new ErrorMessage("Missing dice/group node.", expression));
        }
        const child = expression.getChild(0);
        this.evaluate(child, errors);
        return this.findLeftmostDiceNode(child, errors);
    }

    private getSortedDiceRolls(dice: Ast.ExpressionNode, direction: string, errors: ErrorMessage[]):
        { rolls: Ast.ExpressionNode[], total: number } {
        const output = { rolls: [], total: 0 };

        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            const die = dice.getChild(rollIndex);
            output.rolls.push(die);
            output.total += this.evaluate(die, errors);
        }

        let sortOrder;
        if (direction === "descending") {
            sortOrder = (a, b) => b.getAttribute("value") - a.getAttribute("value");
        } else if (direction === "ascending") {
            sortOrder = (a, b) => a.getAttribute("value") - b.getAttribute("value");
        } else {
            errors.push(new ErrorMessage(`Unknown sort direction: ${direction}. Expected 'ascending' or 'descending'.`, dice));
        }

        output.rolls = output.rolls.sort(sortOrder);
        return output;
    }

    private createDiceRoll(sides: Ast.ExpressionNode | number, errors: ErrorMessage[]): Ast.ExpressionNode {
        const sidesValue = sides instanceof Ast.ExpressionNode
            ? sides.getAttribute("value")
            : sides;
        const diceRoll = this.createDiceRollValue(sides, errors);
        return Ast.Factory.create(Ast.NodeType.DiceRoll)
            .setAttribute("value", diceRoll)
            .setAttribute("drop", "no");
    }

    private createDiceRollValue(sides: Ast.ExpressionNode | number, errors: ErrorMessage[]): number {
        let minValue = 1, maxValue = 0;

        const sidesValue = sides instanceof Ast.ExpressionNode
            ? sides.getAttribute("value")
            : sides;

        if (sidesValue === "fate") {
            minValue = -1; maxValue = 1;
        } else {
            maxValue = Math.round(sides instanceof Ast.ExpressionNode ? this.evaluate(sides, errors) : sides);
        }
        return this.random.numberBetween(minValue, maxValue);
    }
}
