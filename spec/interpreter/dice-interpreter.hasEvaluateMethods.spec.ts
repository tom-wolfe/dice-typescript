import * as Ast from '../../src/ast';
import * as Interpreter from '../../src/interpreter';

describe('DiceInterpreter', () => {
    describe('evaluate method', () => {
        it('exists for each node type.', () => {
            const interpreter = new Interpreter.DiceInterpreter();
            Object.keys(Ast.NodeType).forEach(nodeType => {
                const methodName = 'evaluate' + nodeType;
                expect(interpreter[methodName]).toBeDefined(`Evaluate method ${methodName} does not exist.`);
            });
        });
    });
});
