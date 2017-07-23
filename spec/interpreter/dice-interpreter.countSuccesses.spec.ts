import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { ErrorMessage } from "../../src/interpreter/error-message";
import { MockListRandomProvider } from "../helpers/mock-list-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates successes (5d20>10).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Greater);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 10));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 6, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            const res = interpreter.countSuccesses(exp, errors);

            expect(res).toBe(3);
        });
    });
});
