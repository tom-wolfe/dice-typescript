import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';
import { MockRandomProvider } from '../helpers';

describe('DiceInterpreter', () => {
  describe('evaluate', () => {
    it('correctly evaluates a dice side.', () => {
      const int = Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 'fate');
      const interpreter = new Interpreter.DiceInterpreter();
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(int, errors)).toBe('fate');
      expect(int.getAttribute('value')).toBe('fate');
    });
  });
});
