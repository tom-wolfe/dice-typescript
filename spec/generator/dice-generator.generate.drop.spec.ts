import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
  describe('generate', () => {
    it('generates a simple drop (2d6dl).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Drop)
        .setAttribute('type', 'lowest');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      exp.addChild(dice);

      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('2d6dl');
    });
    it('generates a simple drop (2d6dh).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Drop)
        .setAttribute('type', 'highest');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      exp.addChild(dice);

      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('2d6dh');
    });
    it('generates a drop with modifier (3d6dh2).', () => {
      const exp = Ast.Factory.create(Ast.NodeType.Drop)
        .setAttribute('type', 'highest');

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      exp.addChild(dice);
      exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      const generator = new Generator.DiceGenerator();
      expect(generator.generate(exp)).toBe('3d6dh2');
    });
  });
});
