import { ExpressionNode } from "../ast";
import { Result } from "./result";

export class DiceResult extends Result {
    readonly successes: number;
    readonly failures: number;

    constructor(reducedExpression: ExpressionNode, total: number, successes: number, failures: number) {
        super(reducedExpression, total);
        this.successes = successes;
        this.failures = failures;
    }
}
