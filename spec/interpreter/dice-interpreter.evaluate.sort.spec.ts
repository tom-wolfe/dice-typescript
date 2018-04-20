import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';
import { MockListRandomProvider } from '../helpers';

describe('DiceInterpreter', () => {
    describe('evaluate', () => {
        it('evaluates ascending sort dice (4d6sa).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Sort)
                .setAttribute('direction', 'ascending');

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(6, 5, 4, 3);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);
            expect(dice.getChildCount()).toBe(4);

            expect(dice.getChild(0).getAttribute('value')).toBe(3);
            expect(dice.getChild(1).getAttribute('value')).toBe(4);
            expect(dice.getChild(2).getAttribute('value')).toBe(5);
            expect(dice.getChild(3).getAttribute('value')).toBe(6);
        });
        it('evaluates descending sort dice (4d6sd).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Sort)
                .setAttribute('direction', 'descending');

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(3, 5, 4, 6);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);
            expect(dice.getChildCount()).toBe(4);

            expect(dice.getChild(0).getAttribute('value')).toBe(6);
            expect(dice.getChild(1).getAttribute('value')).toBe(5);
            expect(dice.getChild(2).getAttribute('value')).toBe(4);
            expect(dice.getChild(3).getAttribute('value')).toBe(3);
        });
        it('errors on unknown sort direction (4d6s-).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Sort)
                .setAttribute('direction', 'face');

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(6, 5, 4, 3);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);
            expect(errors.length).toBeGreaterThanOrEqual(1);
        });
        it('errors on missing dice node (-sa).', () => {
            const exp = Ast.Factory.create(Ast.NodeType.Sort)
                .setAttribute('direction', 'ascending');

            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 6));

            const interpreter = new Interpreter.DiceInterpreter(null);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);
            expect(errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
