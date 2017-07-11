import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("correctly evaluates a dice side.", () => {
            const int = Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute("value", "fate");
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(int)).toBe("fate");
        });
    });
});
