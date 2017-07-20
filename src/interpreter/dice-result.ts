import { ExpressionNode } from "../ast";
import { ErrorMessage } from "../parser/error-message";
import { Result } from "./result";

export class DiceResult extends Result {
    readonly successes: number;
    readonly failures: number;
    readonly errors: ErrorMessage[];

    constructor(expression: ExpressionNode, total: number, successes: number, failures: number, errors: ErrorMessage[]) {
        super(expression, total);
        this.successes = successes;
        this.failures = failures;
        this.errors = errors;
    }
}
