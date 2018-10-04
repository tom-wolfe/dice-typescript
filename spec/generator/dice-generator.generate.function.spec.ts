import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';
import { MockRandomProvider } from '../helpers';

describe('DiceGenerator', () => {
  describe('evaluate', () => {
    it('correctly evaluates a function(floor(5 / 2)).', () => {
      const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute('name', 'floor');

      const exp = Ast.Factory.create(Ast.NodeType.Divide);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      func.addChild(exp);

      const generator = new Generator.DiceGenerator();

      const res = generator.generate(func);
      expect(res).toBe('floor(5 / 2)');
    });
    it('correctly evaluates a function(ceil(5 / 2)).', () => {
      const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute('name', 'ceil');

      const exp = Ast.Factory.create(Ast.NodeType.Divide);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      func.addChild(exp);

      const generator = new Generator.DiceGenerator();

      const res = generator.generate(func);
      expect(res).toBe('ceil(5 / 2)');
    });
    it('correctly evaluates a function(sqrt(9)).', () => {
      const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute('name', 'sqrt');
      func.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 9));

      const generator = new Generator.DiceGenerator();

      const res = generator.generate(func);
      expect(res).toBe('sqrt(9)');
    });
    it('correctly evaluates a function(abs(-9)).', () => {
      const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute('name', 'abs');

      const negate = Ast.Factory.create(Ast.NodeType.Negate);
      negate.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 9));

      func.addChild(negate);

      const generator = new Generator.DiceGenerator();

      const res = generator.generate(func);
      expect(res).toBe('abs(-9)');
    });
    it('correctly evaluates multiple parameters function(round(5, 2)).', () => {
      const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute('name', 'round');
      func.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));
      func.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      const generator = new Generator.DiceGenerator();

      const res = generator.generate(func);
      expect(res).toBe('round(5, 2)');
    });
  });
});
