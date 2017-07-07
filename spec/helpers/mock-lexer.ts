import { Lexer, Token } from "../../src/lexer";
import { TokenType } from "../../src/lexer/token-type";

export class MockLexer implements Lexer {
    private index = -1;
    private terminator: Token = new Token(TokenType.Terminator);

    constructor(private readonly tokens: Token[]) { }

    peekNextToken(): Token {
        if (this.index >= this.tokens.length - 1) { return this.terminator; }
        return this.tokens[this.index + 1];
    }
    getNextToken(): Token {
        if (this.index >= this.tokens.length - 1) { return this.terminator; }
        return this.tokens[++this.index];
    }
}
