import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';
import { MockListRandomProvider } from '../helpers';

describe('DiceInterpreter', () => {
  describe('evaluate', () => {
    it('evaluates rerolling dice (4d6r<3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const less = Ast.Factory.create(Ast.NodeType.Less);
      less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      exp.addChild(dice);
      exp.addChild(less);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        6, 5, 6, 2, // This 2 should get re-rolled into a 1, then re-rolled into a 4.
        1, 4
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(21);
      expect(dice.getChildCount()).toBe(4);
    });
    it('evaluates rerolling once dice (4d6ro<3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', true);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const less = Ast.Factory.create(Ast.NodeType.Less);
      less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      exp.addChild(dice);
      exp.addChild(less);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        6, 5, 6, 2, // This 2 should get re-rolled into a 1, and then stop.
        1
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(18);
      expect(dice.getChildCount()).toBe(4);
    });
    it('evaluates rerolling dice no condition (4d6r).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));
      exp.addChild(dice);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        6, 5, 6, 1, // This 1 should get re-rolled into another 1, then re-rolled into a 4.
        1, 4
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(21);
      expect(dice.getChildCount()).toBe(4);
    });
    it('evaluates a rerolling once dice no condition (4d6ro).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', true);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));
      exp.addChild(dice);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        2, 5, 6, 1, // This 1 should get re-rolled into a 2, and then stop.
        2
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(15);
      expect(dice.getChildCount()).toBe(4);
    });
    it('evaluates rerolling dice equal condition (4d6r=3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const equal = Ast.Factory.create(Ast.NodeType.Equal);
      equal.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      exp.addChild(dice);
      exp.addChild(equal);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        6, 5, 6, 3, // This 3 should get re-rolled into a 1
        1 // Lowest dice faces (1) should not be automatically rerolled
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(18);
      expect(dice.getChildCount()).toBe(4);
    });
    it('evaluates not rerolling smallest dice value if specified a condition (4d6r>=5).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const greater = Ast.Factory.create(Ast.NodeType.GreaterOrEqual);
      greater.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      exp.addChild(dice);
      exp.addChild(greater);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        2, 4, 3, 6, // This 6 should get re-rolled into a 1
        1 // Lowest dice faces (1) should not be automatically rerolled
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(10);
      expect(dice.getChildCount()).toBe(4);
    });
    it('evaluates keeping rerolled results if renderExpressionDecorators is activated (4d6r).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      exp.addChild(dice);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(
        2, 1, // This 1 should get re-rolled
        3, 6, 4
      );

      const interpreter = new Interpreter.DiceInterpreter(null, mockList, null, {renderExpressionDecorators: true});
      const errors: Interpreter.InterpreterError[] = [];
      expect(interpreter.evaluate(exp, errors)).toBe(15);
      expect(dice.getChildCount()).toBe(5);

      expect(dice.getChild(0).getAttribute('value')).toBe(2);
      expect(dice.getChild(1).getAttribute('value')).toBe(1); // previous value should be kept
      expect(dice.getChild(1).getAttribute('reroll')).toBe(true); // previous value should be kept
      expect(dice.getChild(2).getAttribute('value')).toBe(4); // new value should be added after rerolled value
      expect(dice.getChild(3).getAttribute('value')).toBe(3);
      expect(dice.getChild(4).getAttribute('value')).toBe(6);
    });
    it('errors on an invalid condition (4d6ro[dice]).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', true);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const d2 = Ast.Factory.create(Ast.NodeType.Dice);
      d2.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      d2.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      exp.addChild(dice);
      exp.addChild(d2);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(6, 5, 6, 2, 1);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
    it('errors if condition includes all dice faces (4d6r<7).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const less = Ast.Factory.create(Ast.NodeType.Less);
      less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 7));

      exp.addChild(dice);
      exp.addChild(less);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(3, 4, 2, 1);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
    it('errors if condition includes all dice faces (4d6r>=1).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      const moreOrEqual = Ast.Factory.create(Ast.NodeType.GreaterOrEqual);
      moreOrEqual.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));

      exp.addChild(dice);
      exp.addChild(moreOrEqual);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(3, 4, 2, 1);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
    it('errors if condition includes all dice faces (4d1r=1).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Reroll)
        .setAttribute('once', false);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));

      const equal = Ast.Factory.create(Ast.NodeType.Equal);
      equal.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));

      exp.addChild(dice);
      exp.addChild(equal);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(3, 4, 2, 1);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
