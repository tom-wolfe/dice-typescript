import * as Ast from "../ast";
import { DefaultRandomProvider } from "../default-random-provider";
import { RandomProvider } from "../random-provider";
import { DefaultFunctionDefinitions } from "./default-function-definitions";
import { DiceResult } from "./dice-result";
import { FunctionDefinitionList } from "./function-definition-list";
import { Interpreter } from "./interpreter";

export class DicePrintInterpreter implements Interpreter<string> {
    interpret(expression: Ast.ExpressionNode): string {
        switch (expression.type) {
          case Ast.NodeType.Add:
            this.expectChildCount(expression, 2);
            return this.interpret(expression.getChild(0)) + " + " + this.interpret(expression.getChild(1));
          case Ast.NodeType.Subtract:
            this.expectChildCount(expression, 2);
            return this.interpret(expression.getChild(0)) + " - " + this.interpret(expression.getChild(1));
          case Ast.NodeType.Multiply:
            this.expectChildCount(expression, 2);
            return this.interpret(expression.getChild(0)) + " * " + this.interpret(expression.getChild(1));
          case Ast.NodeType.Divide:
            this.expectChildCount(expression, 2);
            return this.interpret(expression.getChild(0)) + " / " + this.interpret(expression.getChild(1));
          // TODO: Continue with other node types.
        }
    }

    private expectChildCount(expression: Ast.ExpressionNode, count: number) {
        const findCount = expression.getChildCount();
        if (findCount < count) {
            throw new Error(`Expected ${expression.type} node to have ${count} children, but found ${findCount}.`)
        }
    }
}
