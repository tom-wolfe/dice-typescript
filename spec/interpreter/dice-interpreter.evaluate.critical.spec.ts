import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';
import { MockListRandomProvider } from '../helpers';

describe('DiceInterpreter', () => {
  describe('evaluate', () => {
    it('evaluates critical success dice no condition (4d20cs).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Critical)
        .setAttribute('type', 'success');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 20));

      exp.addChild(dice);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(8, 12, 18, 20);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);

      expect(exp.getAttribute('value')).toBe(20);

      expect(dice.getChildCount()).toBe(4);
      expect(dice.getAttribute('value')).toBe(58);
      expect(dice.getChild(0).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(1).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(2).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(3).getAttribute('critical')).toBe('success');
    });
    it('evaluates critical success dice (4d20cs>=18).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Critical)
        .setAttribute('type', 'success');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 20));

      const comp = Ast.Factory.create(Ast.NodeType.GreaterOrEqual);
      comp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 18));

      exp.addChild(dice);
      exp.addChild(comp);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(8, 12, 18, 19);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);

      expect(exp.getAttribute('value')).toBe(37);

      expect(dice.getChildCount()).toBe(4);
      expect(dice.getAttribute('value')).toBe(57);
      expect(dice.getChild(0).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(1).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(2).getAttribute('critical')).toBe('success');
      expect(dice.getChild(3).getAttribute('critical')).toBe('success');
    });
    it('evaluates critical failure dice no condition (4d20cf).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Critical)
        .setAttribute('type', 'fail');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 20));

      exp.addChild(dice);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(8, 1, 18, 20);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);

      expect(exp.getAttribute('value')).toBe(1);

      expect(dice.getChildCount()).toBe(4);
      expect(dice.getAttribute('value')).toBe(47);
      expect(dice.getChild(0).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(1).getAttribute('critical')).toBe('fail');
      expect(dice.getChild(2).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(3).getAttribute('critical')).toBeUndefined();
    });
    it('evaluates critical success dice (4d20cf<=3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Critical)
        .setAttribute('type', 'fail');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 20));

      const comp = Ast.Factory.create(Ast.NodeType.LessOrEqual);
      comp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      exp.addChild(dice);
      exp.addChild(comp);

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(8, 2, 3, 19);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const errors: Interpreter.InterpreterError[] = [];
      interpreter.evaluate(exp, errors);

      expect(exp.getAttribute('value')).toBe(5);

      expect(dice.getChildCount()).toBe(4);
      expect(dice.getAttribute('value')).toBe(32);
      expect(dice.getChild(0).getAttribute('critical')).toBeUndefined();
      expect(dice.getChild(1).getAttribute('critical')).toBe('fail');
      expect(dice.getChild(2).getAttribute('critical')).toBe('fail');
      expect(dice.getChild(3).getAttribute('critical')).toBeUndefined();
    });
  });
});
