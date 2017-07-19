import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates a simple dice roll expression (dropped).", () => {
            const dice = Ast.Factory.create(Ast.NodeType.DiceRoll)
                .setAttribute("drop", "yes")
                .setAttribute("value", 4);

            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(dice)).toBe(0);
        });
        it("evaluates a simple dice roll expression (not dropped).", () => {
            const dice = Ast.Factory.create(Ast.NodeType.DiceRoll)
                .setAttribute("drop", "no")
                .setAttribute("value", 4);

            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(dice)).toBe(4);
        });
    });
});
