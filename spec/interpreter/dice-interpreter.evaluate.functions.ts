import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("reduce", () => {
        it("correctly evaluates a function(floor(5 / 2)).", () => {
            const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute("name", "floor");

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            func.addChild(exp);

            const interpreter = new Interpreter.DiceInterpreter();

            const res = interpreter.evaluate(func);
            expect(res).toBe(2);
        });
        // TODO: correctly evaluates groups and modifiers.
    });
});
