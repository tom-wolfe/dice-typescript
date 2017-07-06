import { TokenType } from "./token-type";

export class TokenMatch {
    constructor(public start: number, public type: TokenType, public value: string) {}
}