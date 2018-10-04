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
  });
});
