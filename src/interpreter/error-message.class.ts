import { ExpressionNode } from '../ast';

export class InterpreterError {
  constructor(public message: string, public expression: ExpressionNode, public stack: string = (new Error().stack)) { }
}
