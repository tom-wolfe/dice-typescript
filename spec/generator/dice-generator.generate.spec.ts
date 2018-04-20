import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
    describe('generate', () => {
        it('generates a dice roll.', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Critical)
                .setAttribute('type', 'success');

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

            exp.addChild(dice);

            const generator = new Generator.DiceGenerator();
            expect(generator.generate(exp)).toBe('2d6cs');
        });
    });
});
