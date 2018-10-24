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
    it('evaluates an exploding dice with equal condition (4d6!=3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Explode)
        .setAttribute('compound', false)
        .setAttribute('penetrate', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const equal = Ast.Factory.create(Ast.NodeType.Equal);
      equal.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      exp.addChild(dice);
      exp.addChild(equal);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        1, 2, 4, 3, // This 3 should get exploded into the next.
        6 // Highest dice face should not automatically explode
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(16);

      expect(dice.getChildCount()).toBe(5);
    });
    it('evaluates not exploding highest dice value if specified a condition (4d6!<=2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Explode)
        .setAttribute('compound', false)
        .setAttribute('penetrate', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const less = Ast.Factory.create(Ast.NodeType.LessOrEqual);
      less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      exp.addChild(dice);
      exp.addChild(less);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        4, 3, 5, 2, // This 2 should get exploded into the next.
        6 // Highest dice face should not automatically explode
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(20);

      expect(dice.getChildCount()).toBe(5);
    });
    it('errors if condition includes all dice faces (4d6!>=1).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Explode)
        .setAttribute('compound', false)
        .setAttribute('penetrate', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const greater = Ast.Factory.create(Ast.NodeType.GreaterOrEqual);
      greater.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));

      exp.addChild(dice);
      exp.addChild(greater);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
          1, 2, 3, 4,
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
    it('errors if condition includes all dice faces (4d6!<7).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Explode)
        .setAttribute('compound', false)
        .setAttribute('penetrate', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const less = Ast.Factory.create(Ast.NodeType.Less);
      less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 7));

      exp.addChild(dice);
      exp.addChild(less);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        1, 2, 3, 4,
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
    it('errors if condition includes all dice faces (4d1!=1).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Explode)
        .setAttribute('compound', false)
        .setAttribute('penetrate', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));

      const Equal = Ast.Factory.create(Ast.NodeType.Equal);
      Equal.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));

      exp.addChild(dice);
      exp.addChild(Equal);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        1, 1, 1, 1
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
