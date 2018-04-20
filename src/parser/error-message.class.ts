import { Token } from '../lexer';

export class ErrorMessage {
    constructor(public message: string, token: Token, stackTrace: string) { }
}
