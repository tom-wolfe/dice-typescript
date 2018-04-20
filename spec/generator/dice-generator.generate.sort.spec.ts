import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
    describe('generate', () => {
        it('generates a simple sort (2d6sa).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Sort)
                .setAttribute('direction', 'ascending');

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

            exp.addChild(dice);

            const generator = new Generator.DiceGenerator();
            expect(generator.generate(exp)).toBe('2d6sa');
        });
        it('generates a simple sort (2d6sd).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Sort)
                .setAttribute('direction', 'descending');

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute('value', 6));

            exp.addChild(dice);

            const generator = new Generator.DiceGenerator();
            expect(generator.generate(exp)).toBe('2d6sd');
        });
    });
});
