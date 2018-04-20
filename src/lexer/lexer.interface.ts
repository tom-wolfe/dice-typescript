import { Token } from './token.class';

export interface Lexer {
    peekNextToken(): Token;
    getNextToken(): Token;
}
