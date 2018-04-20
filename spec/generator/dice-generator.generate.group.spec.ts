import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';
import { MockRandomProvider } from '../helpers';

describe('DiceGenerator', () => {
    describe('evaluate', () => {
        it('correctly evaluates a group {5, 2}.', () => {
            const group = Ast.Factory.create(Ast.NodeType.Group);

            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));
            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

            const generator = new Generator.DiceGenerator();

            expect(generator.generate(group)).toBe('{5, 2}');
        });
        it('correctly evaluates a group with a repeater {5...2}.', () => {
            const group = Ast.Factory.create(Ast.NodeType.Group);

            const repeat = Ast.Factory.create(Ast.NodeType.Repeat);
            repeat.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));
            repeat.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

            group.addChild(repeat);

            const generator = new Generator.DiceGenerator();

            expect(generator.generate(group)).toBe('{5...2}');
        });
        it('correctly evaluates a group with modifiers {5, 2}kh.', () => {
            const keep = Ast.Factory.create(Ast.NodeType.Keep);
            keep.setAttribute('type', 'highest');

            const group = Ast.Factory.create(Ast.NodeType.Group);

            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 5));
            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 2));

            keep.addChild(group);

            const generator = new Generator.DiceGenerator();

            expect(generator.generate(keep)).toBe('{5, 2}kh');
        });
    });
});
