import * as Ast from "../ast";
import { DiceLexer, Lexer, Token, TokenType } from "../lexer";
import { Parser } from "./";

export abstract class BasicParser implements Parser {
    protected readonly lexer: Lexer;

    constructor(input: Lexer | string) {
        if (this.isLexer(input)) {
            this.lexer = input;
        } else if (typeof input === "string") {
            this.lexer = new DiceLexer(input);
        } else {
            throw new Error("Unrecognized input type. input must be of type 'Lexer | string'.")
        }
    }

    private isLexer(input: any): input is Lexer {
        return input.getNextToken;
    }

    abstract parse(): Ast.ExpressionNode;

    protected expectAndConsume(expected: TokenType, actual?: Token): Token {
        this.expect(expected, actual);
        return this.lexer.getNextToken();
    }

    protected expect(expected: TokenType, actual?: Token): Token {
        actual = actual || this.lexer.peekNextToken();
        if (actual.type !== expected) {
            this.error(expected, actual);
        }
        return actual;
    }

    protected error(expected: TokenType, actual: Token) {
        let msg = `Error at position ${actual.position}.`;
        msg += `Expected token of type ${expected}, found token of type ${actual.type} of value "${actual.value}".`;
        throw new Error(msg);
    }
}
