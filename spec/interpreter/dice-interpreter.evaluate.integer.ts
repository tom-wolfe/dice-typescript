import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("correctly evaluates a group {5, 2}.", () => {
            const int = Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4);
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(int)).toBe(4);
        });
    });
});
