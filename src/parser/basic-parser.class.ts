import { DiceLexer, Lexer, Token, TokenType } from '../lexer';
import { ErrorMessage } from './error-message.class';
import { ParseResult } from './parse-result.class';
import { Parser } from './parser.interface';

export abstract class BasicParser implements Parser {
    protected readonly lexer: Lexer;

    constructor(input: Lexer | string) {
        if (this.isLexer(input)) {
            this.lexer = input;
        } else if (typeof input === 'string') {
            this.lexer = new DiceLexer(input);
        } else {
            throw new Error('Unrecognized input type. input must be of type \'Lexer | string\'.');
        }
    }

    private isLexer(input: any): input is Lexer {
        return input.getNextToken;
    }

    abstract parse(): ParseResult;

    protected expectAndConsume(result: ParseResult, expected: TokenType, actual?: Token): Token {
        this.expect(result, expected, actual);
        return this.lexer.getNextToken();
    }

    protected expect(result: ParseResult, expected: TokenType, actual?: Token): Token {
        actual = actual || this.lexer.peekNextToken();
        if (actual.type !== expected) {
            this.errorToken(result, expected, actual);
        }
        return actual;
    }

    protected errorToken(result: ParseResult, expected: TokenType, actual: Token) {
        let message = `Error at position ${actual.position}.`;
        message += ` Expected token of type ${expected}, found token of type ${actual.type} of value "${actual.value}".`;
        this.errorMessage(result, message, actual);
    }

    protected errorMessage(result: ParseResult, message: string, token: Token) {
        result.errors.push(new ErrorMessage(message, token, new Error().stack));
    }
}
