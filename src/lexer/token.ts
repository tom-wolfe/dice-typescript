import { TokenType } from "./token-type";

export class Token {
    constructor(public type: TokenType, public value: string) { }
}
