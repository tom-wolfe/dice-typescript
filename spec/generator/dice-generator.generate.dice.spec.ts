import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
  describe('generate', () => {
    it('generates a simple dice expression (2d6).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      const generator = new Generator.DiceGenerator();
      expect(generator.generate(dice)).toBe('2d6');
    });
    it('generates a hidden simple dice expression (2d6 + 4).', () => {
      const add = Ast.Factory.create(Ast.NodeType.Add);

      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      add.addChild(dice);
      add.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));

      const generator = new Generator.DiceGenerator();
      expect(generator.generate(add)).toBe('2d6 + 4');
    });
    it('generates a complex dice expression ((1 + 2)d6).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice);

      const add = Ast.Factory.create(Ast.NodeType.Add);
      add.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      add.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      dice.addChild(add);
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      const generator = new Generator.DiceGenerator();

      expect(generator.generate(dice)).toBe('(1 + 2)d6');
    });

    it('generates a simple fate dice expression (2dF).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 'fate'));

      const generator = new Generator.DiceGenerator();

      expect(generator.generate(dice)).toBe('2dF');
    });
    it('generates fractional dice rolls >=.5 ((5 / 2)d6).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice);

      const divide = Ast.Factory.create(Ast.NodeType.Divide);
      divide.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));
      divide.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      dice.addChild(divide);
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      const generator = new Generator.DiceGenerator();

      // 5 / 2 = 2.5, which is rounded to 3.
      expect(generator.generate(dice)).toBe('(5 / 2)d6');
    });
    it('generates fractional dice rolls <.5 ((7 / 5)d6).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice);

      const divide = Ast.Factory.create(Ast.NodeType.Divide);
      divide.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 7));
      divide.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));

      dice.addChild(divide);
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      const generator = new Generator.DiceGenerator();

      expect(generator.generate(dice)).toBe('(7 / 5)d6');
    });
    it('generates negative dice rolls at 0. ((-5)d6).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice);

      const negate = Ast.Factory.create(Ast.NodeType.Negate);
      negate.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));

      dice.addChild(negate);
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

      const generator = new Generator.DiceGenerator();

      // -5d6 will be interpreted as 0.
      expect(generator.generate(dice)).toBe('(-5)d6');
    });
    it('generates dice roll values ([4, 5, 6]).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice).setAttribute('sides', 6);

      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 4));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 5));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6));

      const generator = new Generator.DiceGenerator();

      expect(generator.generate(dice)).toBe('[4, 5, 6]');
    });
    it('generates dice decoration ({renderExpressionDecorators: true}).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice).setAttribute('sides', 6);

      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 1).setAttribute('reroll', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('explode', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 1).setAttribute('drop', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('critical', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('success', true));

      const generator = new Generator.DiceGenerator({renderExpressionDecorators: true});

      expect(generator.generate(dice)).toBe('[1↻, 6!, 1↓, 6*, 6✓]');
    });
    it('generates custom dice decoration ({renderExpressionDecorators: true, decorators: {...}}).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice).setAttribute('sides', 6);

      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 1).setAttribute('reroll', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('explode', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 1).setAttribute('drop', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('critical', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('success', true));

      const generator = new Generator.DiceGenerator({
        renderExpressionDecorators: true,
        decorators: {
          reroll: 'r',
          explode: 'e',
          drop: 'd',
          critical: 'c',
          success: 's',
        },
      });

      expect(generator.generate(dice)).toBe('[1r, 6e, 1d, 6c, 6s]');
    });
    it('generates custom dice decoration ({renderExpressionDecorators: true, decorators: {...}}).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice).setAttribute('sides', 6);

      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 1).setAttribute('reroll', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('explode', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 1).setAttribute('drop', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('critical', true));
      dice.addChild(Ast.Factory.create(Ast.NodeType.DiceRoll).setAttribute('value', 6).setAttribute('success', true));

      const generator = new Generator.DiceGenerator({
        renderExpressionDecorators: true,
        decorators: {
          reroll: ['<r>', '</r>'],
          explode: ['<e>', '</e>'],
          drop: ['<d>', '</d>'],
          critical: ['<c>', '</c>'],
          success: ['<s>', '</s>'],
        },
      });

      expect(generator.generate(dice)).toBe('[<r>1</r>, <e>6</e>, <d>1</d>, <c>6</c>, <s>6</s>]');
    });
    it('throws on malformed dice expression (2d).', () => {
      const dice = Ast.Factory.create(Ast.NodeType.Dice);
      dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

      const generator = new Generator.DiceGenerator();
      expect(() => generator.generate(dice)).toThrow();
    });
  });
});
