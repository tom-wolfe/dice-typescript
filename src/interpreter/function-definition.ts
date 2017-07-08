import { ExpressionNode } from "../ast";
import { DiceInterpreter } from "./dice-interpreter";

export type FunctionDefinition = (interpreter: DiceInterpreter, functionNode: ExpressionNode) => number;
