import * as Ast from "../ast";
import { DefaultRandomProvider } from "../default-random-provider";
import { RandomProvider } from "../random-provider";
import { DiceResult } from "./dice-result";
import { Interpreter } from "./interpreter";

export class DiceInterpreter implements Interpreter {
    constructor(protected random: RandomProvider = new DefaultRandomProvider()) { }

    interpret(expression: Ast.ExpressionNode): DiceResult {
        const exp = expression.copy();
        this.reduce(exp);
        const total = this.evaluate(exp);
        const successes = this.countSuccesses(exp);
        const fails = this.countFailures(exp);
        return new DiceResult(exp, total, successes, fails);
    }

    reduce(expression: Ast.ExpressionNode): void {
        switch (expression.type) {
            case Ast.NodeType.Dice:
                const num = this.evaluate(expression.getChild(0));
                const sides = expression.getChild(1);
                expression.clearChildren();

                let total = 0;
                for (let x = 0; x < num; x++) {
                    let minValue = 1, maxValue = 0;
                    if (sides.getAttribute("value") === "fate") {
                        minValue = -1; maxValue = 1;
                    } else {
                        maxValue = sides.getAttribute("value");
                    }
                    const diceRoll = this.random.numberBetween(minValue, maxValue);
                    expression.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute("value", diceRoll));
                    total += diceRoll;
                }
                expression.setAttribute("value", total);
                break;
            default: this.reduceChildren(expression); break;
        }
    }

    reduceChildren(expression: Ast.ExpressionNode): void {
        for (let x = 0; x < expression.getChildCount(); x++) {
            this.reduce(expression.getChild(x));
        }
    }

    evaluate(expression: Ast.ExpressionNode): number {
        switch (expression.type) {
            case Ast.NodeType.Add: return this.evaluate(expression.getChild(0)) + this.evaluate(expression.getChild(1));
            case Ast.NodeType.Subtract: return this.evaluate(expression.getChild(0)) - this.evaluate(expression.getChild(1));
            case Ast.NodeType.Multiply: return this.evaluate(expression.getChild(0)) * this.evaluate(expression.getChild(1));
            case Ast.NodeType.Divide: return this.evaluate(expression.getChild(0)) / this.evaluate(expression.getChild(1));
            case Ast.NodeType.Exponent: return Math.pow(this.evaluate(expression.getChild(0)), this.evaluate(expression.getChild(1)));
            case Ast.NodeType.Modulo: return this.evaluate(expression.getChild(0)) % this.evaluate(expression.getChild(1));
            case Ast.NodeType.Negate: return -this.evaluate(expression.getChild(0));
            case Ast.NodeType.Integer: return expression.getAttribute("value");
            case Ast.NodeType.Dice:
                if (!expression.getAttribute("value")) {
                    this.reduce(expression);
                }
                return expression.getAttribute("value");
            case Ast.NodeType.Function:
                // TODO: Implement.
                break;
        }
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
