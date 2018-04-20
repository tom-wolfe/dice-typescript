import { ErrorMessage } from './error-message.class';
import { ExpressionNode } from '../ast';
import { DiceInterpreter } from './dice-interpreter.class';

export type FunctionDefinition = (interpreter: DiceInterpreter, functionNode: ExpressionNode, errors: ErrorMessage[]) => number;
