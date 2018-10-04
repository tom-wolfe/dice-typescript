import { Lexer, Token, TokenType } from '../../src/lexer';

export class MockLexer implements Lexer {
  private index = -1;
  private terminator: Token;

  constructor(private readonly tokens: Token[]) {
    this.terminator = new Token(TokenType.Terminator, this.getEndOfTokens());
  }

  peekNextToken(): Token {
    if (this.index >= this.tokens.length - 1) { return this.terminator; }
    return this.tokens[this.index + 1];
  }
  getNextToken(): Token {
    if (this.index >= this.tokens.length - 1) { return this.terminator; }
    return this.tokens[++this.index];
  }

  private getEndOfTokens(): number {
    if (this.tokens.length === 0) { return 0; }
    const lastToken = this.tokens[this.tokens.length - 1];
    return lastToken.position + lastToken.value.length;
  }
}
