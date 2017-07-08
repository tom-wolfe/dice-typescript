import { ExpressionNode } from "../ast";

export class DiceResult {
    readonly reducedExpression: ExpressionNode
    readonly total: number;
    readonly successes: number;
    readonly fails: number;

    constructor(reducedExpression: ExpressionNode, total: number, successes: number, fails: number) {
        this.reducedExpression = reducedExpression;
        this.total = total;
        this.successes = successes;
        this.fails = fails;
    }
}
