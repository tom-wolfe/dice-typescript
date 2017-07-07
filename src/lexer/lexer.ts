import { Token } from "./";

export interface Lexer {
    peekNextToken(): Token;
    getNextToken(): Token;
}
