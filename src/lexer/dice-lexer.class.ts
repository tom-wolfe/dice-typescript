import { CharacterStream } from './character-stream.interface';
import { Lexer } from './lexer.interface';
import { StringCharacterStream } from './string-character-stream.class';
import { Token } from './token.class';
import { TokenType } from './token-type.enum';

export class DiceLexer implements Lexer {
  protected stream: CharacterStream;
  private currentToken: Token;
  private nextToken: Token;

  private numCharRegex: RegExp = /[0-9]/;
  private idCharRegex: RegExp = /[a-zA-Z]/;

  constructor(input: CharacterStream | string) {
    if (this.isCharacterStream(input)) {
      this.stream = input;
    } else if (typeof input === 'string') {
      this.stream = new StringCharacterStream(input);
    } else {
      throw new Error('Unrecognized input type. input must be of type \'CharacterStream | string\'.');
    }
  }

  private isCharacterStream(input: any): input is CharacterStream {
    return input.getCurrentCharacter;
  }

  public peekNextToken(): Token {
    if (!this.nextToken) {
      this.nextToken = this.constructNextToken();
    }
    return this.nextToken;
  }

  public getNextToken(): Token {
    if (this.nextToken) {
      this.currentToken = this.nextToken;
      this.nextToken = null;
    } else {
      this.currentToken = this.constructNextToken();
    }
    return this.currentToken;
  }

  protected parseIdentifier(): Token {
    let buffer = this.stream.getCurrentCharacter();
    // TODO: klnull?!
    while (this.stream.peekNextCharacter() && this.idCharRegex.test(this.stream.peekNextCharacter())) {
      buffer += this.stream.getNextCharacter();
    }
    return this.createToken(TokenType.Identifier, buffer);
  }

  protected parseNumber(): Token {
    let buffer = this.stream.getCurrentCharacter();
    let hasDot = false;
    let nextChar = this.stream.peekNextCharacter();
    while (nextChar === '.' || this.numCharRegex.test(nextChar)) {
      if (nextChar === '.') {
        if (hasDot) { break; }
        hasDot = true;
      }
      buffer += this.stream.getNextCharacter();
      nextChar = this.stream.peekNextCharacter();
    }
    return this.createToken(TokenType.Number, buffer);
  }

  protected parseEllipsis(): Token {
    for (let x = 0; x < 2; x++) {
      if (this.stream.peekNextCharacter() !== '.') {
        throw new Error('Missing period in ellipsis.');
      }
      this.stream.getNextCharacter();
    }
    return this.createToken(TokenType.Ellipsis, '...');
  }

  private constructNextToken() {
    let curChar: string;
    while (curChar = this.stream.getNextCharacter()) {
      switch (true) {
        case this.idCharRegex.test(curChar): return this.parseIdentifier();
        case this.numCharRegex.test(curChar): return this.parseNumber();
        case curChar === '{': return this.createToken(TokenType.BraceOpen, curChar);
        case curChar === '}': return this.createToken(TokenType.BraceClose, curChar);
        case curChar === ',': return this.createToken(TokenType.Comma, curChar);
        case curChar === '(': return this.createToken(TokenType.ParenthesisOpen, curChar);
        case curChar === ')': return this.createToken(TokenType.ParenthesisClose, curChar);
        case curChar === '=': return this.createToken(TokenType.Equals, curChar);
        case curChar === '+': return this.createToken(TokenType.Plus, curChar);
        case curChar === '/': return this.createToken(TokenType.Slash, curChar);
        case curChar === '-': return this.createToken(TokenType.Minus, curChar);
        case curChar === '%': return this.createToken(TokenType.Percent, curChar);
        case curChar === '!': return this.createToken(TokenType.Exclamation, curChar);
        case curChar === '.': return this.parseEllipsis();
        case curChar === '*':
          if (this.stream.peekNextCharacter() === '*') {
            this.stream.getNextCharacter();
            return this.createToken(TokenType.DoubleAsterisk, curChar + this.stream.getCurrentCharacter());
          } else {
            return this.createToken(TokenType.Asterisk, curChar);
          }
        case curChar === '>':
          if (this.stream.peekNextCharacter() === '=') {
            this.stream.getNextCharacter();
            return this.createToken(TokenType.GreaterOrEqual, curChar + this.stream.getCurrentCharacter());
          } else {
            return this.createToken(TokenType.Greater, curChar);
          }
        case curChar === '<':
          if (this.stream.peekNextCharacter() === '=') {
            this.stream.getNextCharacter();
            return this.createToken(TokenType.LessOrEqual, curChar + this.stream.getCurrentCharacter());
          } else {
            return this.createToken(TokenType.Less, curChar);
          }
        case /\W/.test(curChar):
          // Ignore whitespace.
          break;
        default: throw new Error(`Unknown token: '${curChar}'.`);
      }
    }
    // Terminator at end of stream.
    return this.createToken(TokenType.Terminator);
  }

  private createToken(type: TokenType, value?: string): Token {
    let position = this.stream.getCurrentPosition();
    if (value) { position -= value.length - 1; }
    return new Token(type, position, value);
  }
}
