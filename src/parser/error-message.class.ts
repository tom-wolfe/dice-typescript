import { Token } from '../lexer';

export class ParserError {
  constructor(public message: string, public token: Token, public stackTrace: string) { }
}
