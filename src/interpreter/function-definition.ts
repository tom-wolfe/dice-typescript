import { ErrorMessage } from "./error-message";
import { ExpressionNode } from "../ast";
import { DiceInterpreter } from "./dice-interpreter";

export type FunctionDefinition = (interpreter: DiceInterpreter, functionNode: ExpressionNode, errors: ErrorMessage[]) => number;
