import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { ErrorMessage } from "../../src/interpreter/error-message";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("correctly evaluates a group {5, 2}.", () => {
            const int = Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4);
            const interpreter = new Interpreter.DiceInterpreter();
            const errors: ErrorMessage[] = [];
            expect(interpreter.evaluate(int, errors)).toBe(4);
        });
    });
});
