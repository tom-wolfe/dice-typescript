import * as Ast from "../ast";
import { Lexer } from "../lexer";

import { TokenType } from "../lexer/token-type";

const BooleanOperatorMap: { [token: string]: Ast.NodeType } = { };
BooleanOperatorMap[TokenType.BoolOpEq] = Ast.NodeType.Equal;
BooleanOperatorMap[TokenType.BoolOpGreater] = Ast.NodeType.Greater;
BooleanOperatorMap[TokenType.BoolOpLess] = Ast.NodeType.Less;
BooleanOperatorMap[TokenType.BoolOpGreaterOrEq] = Ast.NodeType.GreaterOrEqual;
BooleanOperatorMap[TokenType.BoolOpLessOrEq] = Ast.NodeType.LessOrEqual;

export class Parser {
    protected readonly lexer: Lexer;

    constructor(input: Lexer | string) {
        if (input instanceof Lexer) {
            this.lexer = input;
        } else if (typeof input === "string") {
            this.lexer = new Lexer(input);
        } else {
            throw new Error("Unrecognized input type. input must be of type 'Lexer | string'.")
        }
    }

    parse(): Ast.Expression {
        const root: Ast.ExpressionNode = this.parseExpression();
        return new Ast.Expression(root);
    }

    parseExpression(): Ast.ExpressionNode {
        let root = this.parseSimpleExpression();
        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(BooleanOperatorMap[tokenType]);
            this.lexer.getNextToken();
            newRoot.addChild(root);
            newRoot.addChild(this.parseSimpleExpression());
            root = newRoot;
        }
        return root;
    }

    parseSimpleExpression(): Ast.ExpressionNode {
        // TODO: Implement.
        return null;
    }
}
