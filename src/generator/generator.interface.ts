import * as Ast from '../ast';

export interface Generator<TResult> {
  generate(expression: Ast.ExpressionNode): TResult;
}
