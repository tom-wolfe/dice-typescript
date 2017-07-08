import * as Ast from "../ast";

export interface Parser {
    parse(): Ast.ExpressionNode;
}
