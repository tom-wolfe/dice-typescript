import { Result } from "./result";

import * as Ast from "../ast";

export interface Interpreter {
    interpret(expression: Ast.ExpressionNode): Result;
}
