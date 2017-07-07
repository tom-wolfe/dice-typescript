import { CharacterStream } from "./character-stream";
import { Lexer } from "./lexer";
import { StringCharacterStream } from "./string-character-stream";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class DiceLexer implements Lexer {
    protected stream: CharacterStream;
    private currentToken: Token;
    private nextToken: Token;

    private numCharRegex: RegExp = /[0-9]/;
    private idCharRegex: RegExp = /[a-zA-Z]/;

    constructor(input: CharacterStream | string) {
        if (this.isCharacterStream(input)) {
            this.stream = input;
        } else if (typeof input === "string") {
            this.stream = new StringCharacterStream(input);
        } else {
            throw new Error("Unrecognized input type. input must be of type 'CharacterStream | string'.")
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
        while (this.idCharRegex.test(this.stream.peekNextCharacter())) {
            buffer += this.stream.getNextCharacter();
        }
        return new Token(TokenType.Identifier, buffer);
    }

    protected parseNumber(): Token {
        let buffer = this.stream.getCurrentCharacter();
        while (this.numCharRegex.test(this.stream.peekNextCharacter())) {
            buffer += this.stream.getNextCharacter();
        }
        return new Token(TokenType.NumberInteger, buffer);
    }

    private constructNextToken() {
        let curChar: string;
        while (curChar = this.stream.getNextCharacter()) {
            switch (true) {
                case this.idCharRegex.test(curChar): return this.parseIdentifier();
                case this.numCharRegex.test(curChar): return this.parseNumber();
                case curChar === "{": return new Token(TokenType.BraceOpen, curChar);
                case curChar === "}": return new Token(TokenType.BraceClose, curChar);
                case curChar === ",": return new Token(TokenType.Comma, curChar);
                case curChar === "(": return new Token(TokenType.ParenthesisOpen, curChar);
                case curChar === ")": return new Token(TokenType.ParenthesisClose, curChar);
                case curChar === "=": return new Token(TokenType.BoolOpEq, curChar);
                case curChar === "+": return new Token(TokenType.MathOpAdd, curChar);
                case curChar === "/": return new Token(TokenType.MathOpDivide, curChar);
                case curChar === "-": return new Token(TokenType.MathOpSubtract, curChar);
                case curChar === "%": return new Token(TokenType.MathOpModulo, curChar);
                case curChar === "*":
                    if (this.stream.peekNextCharacter() === "*") {
                        this.stream.getNextCharacter();
                        return new Token(TokenType.MathOpExponent, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return new Token(TokenType.MathOpMultiply, curChar);
                    }
                case curChar === ">":
                    if (this.stream.peekNextCharacter() === "=") {
                        this.stream.getNextCharacter();
                        return new Token(TokenType.BoolOpGreaterOrEq, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return new Token(TokenType.BoolOpGreater, curChar);
                    }
                case curChar === "<":
                    if (this.stream.peekNextCharacter() === "=") {
                        this.stream.getNextCharacter();
                        return new Token(TokenType.BoolOpLessOrEq, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return new Token(TokenType.BoolOpLess, curChar);
                    }
                case curChar === "!":
                    if (this.stream.peekNextCharacter() === "!") {
                        this.stream.getNextCharacter();
                        return new Token(TokenType.UnOpPenetrate, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return new Token(TokenType.UnOpExplode, curChar);
                    }
                case /\W/.test(curChar):
                    // Ignore whitespace.
                    break;
                default: throw new Error(`Unknown token: '${curChar}'.`);
            }
        }
        // Terminator at end of stream.
        return new Token(TokenType.Terminator);
    }
}
