import { TokenType } from './token-type.enum';

export class Token {
    constructor(public type: TokenType, public position: number, public value?: string) { }
}
