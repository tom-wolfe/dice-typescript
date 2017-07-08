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
        return this.createToken(TokenType.Identifier, buffer);
    }

    protected parseNumber(): Token {
        let buffer = this.stream.getCurrentCharacter();
        while (this.numCharRegex.test(this.stream.peekNextCharacter())) {
            buffer += this.stream.getNextCharacter();
        }
        return this.createToken(TokenType.NumberInteger, buffer);
    }

    private constructNextToken() {
        let curChar: string;
        while (curChar = this.stream.getNextCharacter()) {
            switch (true) {
                case this.idCharRegex.test(curChar): return this.parseIdentifier();
                case this.numCharRegex.test(curChar): return this.parseNumber();
                case curChar === "{": return this.createToken(TokenType.BraceOpen, curChar);
                case curChar === "}": return this.createToken(TokenType.BraceClose, curChar);
                case curChar === ",": return this.createToken(TokenType.Comma, curChar);
                case curChar === "(": return this.createToken(TokenType.ParenthesisOpen, curChar);
                case curChar === ")": return this.createToken(TokenType.ParenthesisClose, curChar);
                case curChar === "=": return this.createToken(TokenType.BoolOpEq, curChar);
                case curChar === "+": return this.createToken(TokenType.MathOpAdd, curChar);
                case curChar === "/": return this.createToken(TokenType.MathOpDivide, curChar);
                case curChar === "-": return this.createToken(TokenType.MathOpSubtract, curChar);
                case curChar === "%": return this.createToken(TokenType.MathOpModulo, curChar);
                case curChar === "*":
                    if (this.stream.peekNextCharacter() === "*") {
                        this.stream.getNextCharacter();
                        return this.createToken(TokenType.MathOpExponent, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return this.createToken(TokenType.MathOpMultiply, curChar);
                    }
                case curChar === ">":
                    if (this.stream.peekNextCharacter() === "=") {
                        this.stream.getNextCharacter();
                        return this.createToken(TokenType.BoolOpGreaterOrEq, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return this.createToken(TokenType.BoolOpGreater, curChar);
                    }
                case curChar === "<":
                    if (this.stream.peekNextCharacter() === "=") {
                        this.stream.getNextCharacter();
                        return this.createToken(TokenType.BoolOpLessOrEq, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return this.createToken(TokenType.BoolOpLess, curChar);
                    }
                case curChar === "!":
                    if (this.stream.peekNextCharacter() === "!") {
                        this.stream.getNextCharacter();
                        return this.createToken(TokenType.UnOpPenetrate, curChar + this.stream.getCurrentCharacter());
                    } else {
                        return this.createToken(TokenType.UnOpExplode, curChar);
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
