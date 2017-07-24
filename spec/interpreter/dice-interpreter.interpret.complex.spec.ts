import { ErrorMessage } from "../../src/interpreter/error-message";
import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockListRandomProvider } from "../helpers/mock-list-random-provider";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("interpret", () => {
        it("interprets a complex dice expression (2d20kl>14).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Greater);

            const keep = Ast.Factory.create(Ast.NodeType.Keep);
            keep.setAttribute("type", "lowest");

            exp.addChild(keep);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 14));

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            keep.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(20, 15);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const res = interpreter.interpret(exp);

            expect(res.errors.length).toBe(0, "Unexpected errors found.");
            expect(res.successes).toBe(1, "Successes counted incorrectly");
            expect(res.failures).toBe(0, "Failures counted incorrectly");
            expect(res.total).toBe(15, "Total counted incorrectly");
        });
    });
});
