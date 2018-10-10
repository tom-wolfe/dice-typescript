import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';
import { MockListRandomProvider } from '../helpers';

describe('DiceInterpreter', () => {
  describe('interpret', () => {
    it('interprets a simple dice expression (4d10 + 5).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Add);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 10));

      exp.addChild(dice);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(1, 7, 4, 5);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const res = interpreter.interpret(exp);

      expect(res.errors.length).toBe(0, 'Unexpected errors found.');
      expect(res.renderedExpression).toBe('[1, 7, 4, 5] + 5', 'Expression rendered incorrectly');
      expect(res.total).toBe(22, 'Total counted incorrectly');
    });
    it('interprets a simple dice expression (4d6kh3).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Keep)
        .setAttribute('type', 'highest');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

      exp.addChild(dice);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));

      const mockList = new MockListRandomProvider();
      mockList.numbers.push(6, 1, 4, 3);

      const interpreter = new Interpreter.DiceInterpreter(null, mockList);
      const res = interpreter.interpret(exp);

      expect(res.errors.length).toBe(0, 'Unexpected errors found.');
      expect(res.renderedExpression).toBe('[6, 1, 4, 3]kh3', 'Expression rendered incorrectly');
      expect(res.total).toBe(13, 'Total counted incorrectly');
    });
  });
});
