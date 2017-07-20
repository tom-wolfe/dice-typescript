import { ExpressionNode } from "../ast";

export class ErrorMessage {
    constructor(public message: string, expression: ExpressionNode) { }
};
