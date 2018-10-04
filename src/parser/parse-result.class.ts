import * as Ast from '../ast';
import { ParserError } from './error-message.class';

export class ParseResult {
  root: Ast.ExpressionNode;
  errors: ParserError[] = [];
}
