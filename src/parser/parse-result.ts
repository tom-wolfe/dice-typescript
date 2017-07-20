import * as Ast from "../ast";
import { ErrorMessage } from "./error-message";

export class ParseResult {
    root: Ast.ExpressionNode;
    errors: ErrorMessage[] = [];
}
