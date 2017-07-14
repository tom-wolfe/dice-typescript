import { Result } from "./result";

import * as Ast from "../ast";

export interface Interpreter<TResult> {
    interpret(expression: Ast.ExpressionNode): TResult;
}
