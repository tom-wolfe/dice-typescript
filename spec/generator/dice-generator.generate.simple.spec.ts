import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
  describe('generate', () => {
    it('generates a simple number.', () => {
      const num = Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4);
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(num)).toBe('4');
    });
    it('correctly generates a subtraction (10 - 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Subtract);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 10));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('10 - 2');
    });
    it('correctly generates a multiplication (10 * 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Multiply);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 10));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('10 * 2');
    });
    it('correctly generates a division (10 / 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Divide);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 10));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('10 / 2');
    });
    it('correctly generates a exponentiation (10 ^ 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Exponent);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 10));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('10 ^ 2');
    });
    it('correctly generates a modulo (10 % 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Modulo);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 10));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('10 % 2');
    });
    it('correctly generates a negation (-10).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Negate);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 10));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('-10');
    });
    it('correctly generates a boolean condition (1 = 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Equal);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('1 = 2');
    });
    it('correctly generates a boolean condition (1 > 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Greater);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('1 > 2');
    });
    it('correctly generates a boolean condition (1 >= 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.GreaterOrEqual);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('1 >= 2');
    });
    it('correctly generates a boolean condition (1 < 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Less);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('1 < 2');
    });
    it('correctly generates a boolean condition (1 <= 2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.LessOrEqual);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('1 <= 2');
    });
  });
});
