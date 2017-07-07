import { Lexer, Token } from "../../src/lexer";

export class MockLexer implements Lexer {
    private index = -1;
    constructor(private readonly tokens: Token[]) { }

    peekNextToken(): Token {
        return this.tokens[this.index + 1];
    }
    getNextToken(): Token {
        return this.tokens[++this.index];
    }
}
