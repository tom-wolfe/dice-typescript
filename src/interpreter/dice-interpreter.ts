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
        const total = this.evaluate(exp);
        const successes = this.countSuccesses(exp);
        const fails = this.countFailures(exp);
        return new DiceResult(exp, total, successes, fails);
    }

    evaluate(expression: Ast.ExpressionNode): any {
        if (!expression) { throw new Error("Null node reference found."); }
        if (expression.type === Ast.NodeType.DiceRoll) {
            return this.evaluateDiceRoll(expression);
        } else if (!expression.getAttribute("value")) {
            let value: any = 0;
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
        if (expression.getAttribute("drop") !== "yes") {
            return expression.getAttribute("value");
        }
        return 0;
    }

    private evaluateDice(expression: Ast.ExpressionNode): number {
        this.expectChildCount(expression, 2);
        const num = Math.round(this.evaluate(expression.getChild(0)));
        const sides = expression.getChild(1);
        expression.setAttribute("sides", this.evaluate(sides));

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
        const dice = this.findLeftmostDiceNode(expression);
        let condition: Ast.ExpressionNode;
        const penetrate = expression.getAttribute("penetrate") === "yes";
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition);
        }

        this.evaluate(dice);

        const newRolls: Ast.ExpressionNode[] = [];

        let total = 0;
        const sides = dice.getAttribute("sides");
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            let die = dice.getChild(rollIndex);
            if (die.getAttribute("drop") === "yes") { continue; }
            let dieValue = this.evaluate(die);
            total += dieValue;
            while (condition && this.evaluateComparison(dieValue, condition) || dieValue === sides) {
                die = this.createDiceRoll(sides);
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
        this.expectChildCount(expression, 1);
        const dice = this.findLeftmostDiceNode(expression);
        const countTotal = (expression.getChildCount() > 1) ? this.evaluate(expression.getChild(1)) : 1;
        const type = expression.getAttribute("type");
        this.evaluate(dice);

        const rolls = this.getSortedDiceRolls(dice, (type === "lowest") ? "ascending" : "descending").rolls;

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

    private evaluateDrop(expression: Ast.ExpressionNode): number {
        this.expectChildCount(expression, 1);
        const dice = this.findLeftmostDiceNode(expression);
        const countTotal = (expression.getChildCount() > 1) ? this.evaluate(expression.getChild(1)) : 1;
        const type = expression.getAttribute("type");
        this.evaluate(dice);

        const rolls = this.getSortedDiceRolls(dice, (type === "lowest") ? "ascending" : "descending").rolls;
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

    private evaluateCritical(expression: Ast.ExpressionNode): number {
        this.expectChildCount(expression, 1);
        const dice = this.findLeftmostDiceNode(expression);
        const type = expression.getAttribute("type");

        let condition: Ast.ExpressionNode;
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition);
        } else {
            condition = Ast.Factory.create(Ast.NodeType.Equal);
            if (type === "success") {
                this.expectChildCount(dice, 2);
                condition.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", dice.getAttribute("sides")));
            } else {
                condition.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 1));
            }
        }

        this.evaluate(dice);

        let total = 0;
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            const die = dice.getChild(rollIndex);
            const dieValue = this.evaluate(die);
            if (this.evaluateComparison(dieValue, condition)) {
                die.setAttribute("critical", type);
            }
            total += dieValue;
        }

        return total;
    }

    private evaluateReroll(expression: Ast.ExpressionNode): number {
        this.expectChildCount(expression, 1);
        const dice = this.findLeftmostDiceNode(expression);
        let condition: Ast.ExpressionNode;
        const once = expression.getAttribute("once") === "yes";
        if (expression.getChildCount() > 1) {
            condition = expression.getChild(1);
            this.evaluate(condition);
        }

        this.evaluate(dice);

        let total = 0;
        const sides = dice.getAttribute("sides");
        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            const die = dice.getChild(rollIndex);
            if (die.getAttribute("drop") === "yes") { continue; }
            let dieValue = this.evaluate(die);
            while (condition && this.evaluateComparison(dieValue, condition) || dieValue === 1) {
                dieValue = this.createDiceRollValue(sides);
                if (once) { break; }
            }
            die.setAttribute("value", dieValue);
            total += dieValue;
        }

        return total;
    }

    private evaluateSort(expression: Ast.ExpressionNode): number {
        this.expectChildCount(expression, 1);
        const dice = this.findLeftmostDiceNode(expression);
        const rolls = this.getSortedDiceRolls(dice, expression.getAttribute("direction"));
        dice.clearChildren();
        rolls.rolls.forEach(roll => dice.addChild(roll));
        return rolls.total;
    }

    private findLeftmostDiceNode(expression: Ast.ExpressionNode): Ast.ExpressionNode {
        if (expression.type === Ast.NodeType.Dice) {
            return expression;
        }
        if (expression.getChildCount() < 1) {
            throw new Error("Missing dice node.");
        }
        const child = expression.getChild(0);
        this.evaluate(child);
        return this.findLeftmostDiceNode(child);
    }

    private getSortedDiceRolls(dice: Ast.ExpressionNode, direction: string): { rolls: Ast.ExpressionNode[], total: number } {
        const output = { rolls: [], total: 0 };

        for (let rollIndex = 0; rollIndex < dice.getChildCount(); rollIndex++) {
            const die = dice.getChild(rollIndex);
            output.rolls.push(die);
            output.total += this.evaluate(die);
        }

        let sortOrder;
        if (direction === "descending") {
            sortOrder = (a, b) => b.getAttribute("value") - a.getAttribute("value");
        } else {
            sortOrder = (a, b) => a.getAttribute("value") - b.getAttribute("value");
        }

        output.rolls = output.rolls.sort(sortOrder);
        return output;
    }

    private createDiceRoll(sides: Ast.ExpressionNode | number): Ast.ExpressionNode {
        const sidesValue = sides instanceof Ast.ExpressionNode
            ? sides.getAttribute("value")
            : sides;
        const diceRoll = this.createDiceRollValue(sides);
        return Ast.Factory.create(Ast.NodeType.DiceRoll)
            .setAttribute("value", diceRoll)
            .setAttribute("drop", "no");
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
