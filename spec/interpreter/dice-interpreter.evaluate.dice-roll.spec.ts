import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';
import { MockRandomProvider } from '../helpers';

describe('DiceInterpreter', () => {
    describe('evaluate', () => {
        it('evaluates a simple dice roll expression (dropped).', () => {
            const dice = Ast.Factory.create(Ast.NodeType.DiceRoll)
                .setAttribute('drop', true)
                .setAttribute('value', 4);

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            expect(interpreter.evaluate(dice, errors)).toBe(0);
            expect(dice.getAttribute('value')).toBe(4);
        });
        it('evaluates a simple dice roll expression (not dropped).', () => {
            const dice = Ast.Factory.create(Ast.NodeType.DiceRoll)
                .setAttribute('drop', false)
                .setAttribute('value', 4);

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            expect(interpreter.evaluate(dice, errors)).toBe(4);
            expect(dice.getAttribute('value')).toBe(4);
        });
    });
});
