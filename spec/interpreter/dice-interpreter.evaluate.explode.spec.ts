import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';
import { MockListRandomProvider } from '../helpers';

describe('DiceInterpreter', () => {
  describe('evaluate', () => {
    it('evaluates an exploding dice (4d6!>3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Explode)
        .setAttribute('compound', false)
        .setAttribute('penetrate', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const greater = Ast.Factory.create(Ast.NodeType.Greater);
      greater.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      exp.addChild(dice);
      exp.addChild(greater);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        1, 2, 3, 4, // This 4 should get exploded into the next.
        1
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(11);

      expect(dice.getChildCount()).toBe(5);
    });
    it('evaluates a penetrating dice (4d6!p>3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Explode)
        .setAttribute('compound', false)
        .setAttribute('penetrate', true);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const greater = Ast.Factory.create(Ast.NodeType.Greater);
      greater.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      exp.addChild(dice);
      exp.addChild(greater);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        1, 2, 3, 4, // This 4 should get exploded into the next.
        2
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(11);

      expect(dice.getChildCount()).toBe(5);
    });
  });
});
