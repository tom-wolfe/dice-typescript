import { ExpressionNode } from "../ast";

export class Result {
    readonly reducedExpression: ExpressionNode
    readonly total: number;

    constructor(reducedExpression: ExpressionNode, total: number) {
        this.reducedExpression = reducedExpression;
        this.total = total;
    }
}
