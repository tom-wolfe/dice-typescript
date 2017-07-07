import { Token } from "./token";
import { TokenType } from "./token-type";

export class Lexer {
    private index = -1;

    private numCharRegex: RegExp = /[0-9]/;
    private idCharRegex: RegExp = /[a-zA-Z]/;

    constructor(protected input: string) { }

    public getNextToken(): Token {
        let curChar: string;
        while (curChar = this.getNextCharacter()) {
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
                    if (this.peekNextCharacter() === "*") {
                        this.getNextCharacter();
                        return new Token(TokenType.MathOpExponent, curChar + this.currentCharacter);
                    } else {
                        return new Token(TokenType.MathOpMultiply, curChar);
                    }
                case curChar === ">":
                    if (this.peekNextCharacter() === "=") {
                        this.getNextCharacter();
                        return new Token(TokenType.BoolOpGreaterOrEq, curChar + this.currentCharacter);
                    } else {
                        return new Token(TokenType.BoolOpGreater, curChar);
                    }
                case curChar === "<":
                    if (this.peekNextCharacter() === "=") {
                        this.getNextCharacter();
                        return new Token(TokenType.BoolOpLessOrEq, curChar + this.currentCharacter);
                    } else {
                        return new Token(TokenType.BoolOpLess, curChar);
                    }
                case curChar === "!":
                    if (this.peekNextCharacter() === "!") {
                        this.getNextCharacter();
                        return new Token(TokenType.UnOpPenetrate, curChar + this.currentCharacter);
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

    protected parseIdentifier(): Token {
        let buffer = this.currentCharacter;
        while (this.idCharRegex.test(this.peekNextCharacter())) {
            buffer += this.getNextCharacter();
        }
        return new Token(TokenType.Identifier, buffer);
    }

    protected parseNumber(): Token {
        let buffer = this.currentCharacter;
        while (this.numCharRegex.test(this.peekNextCharacter())) {
            buffer += this.getNextCharacter();
        }
        return new Token(TokenType.NumberInteger, buffer);
    }

    protected getNextCharacter(): string {
        this.index = Math.min(this.index + 1, this.input.length);
        if (this.index >= this.input.length) { return null; }
        return this.input[this.index];
    }

    protected get currentCharacter(): string {
        if (this.index < 0 || this.index >= this.input.length) { return null; }
        return this.input[this.index];
    }

    protected peekNextCharacter(): string {
        if (this.index >= this.input.length) { return null; }
        return this.input[this.index + 1];
    }
}
