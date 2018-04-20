import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
    describe('generate', () => {
        it('generates a simple reroll (2d6r).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute('once', false);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

            exp.addChild(dice);

            const generator = new Generator.DiceGenerator();
            expect(generator.generate(exp)).toBe('2d6r');
        });
        it('generates a reroll once (2d6ro).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute('once', true);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

            exp.addChild(dice);

            const generator = new Generator.DiceGenerator();
            expect(generator.generate(exp)).toBe('2d6ro');
        });
        it('generates a reroll with a condition (2d6r<3).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute('once', false);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));
            exp.addChild(dice);

            const less = Ast.Factory.create(Ast.NodeType.Less);
            less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 3));
            exp.addChild(less);

            const generator = new Generator.DiceGenerator();
            expect(generator.generate(exp)).toBe('2d6r<3');
        });
    });
});
