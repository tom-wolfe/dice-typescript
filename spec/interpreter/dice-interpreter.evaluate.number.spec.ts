import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';

describe('DiceInterpreter', () => {
    describe('evaluate', () => {
        it('correctly evaluates a group {5, 2}.', () => {
            const int = Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 4);
            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            expect(interpreter.evaluate(int, errors)).toBe(4);
        });
    });
});
