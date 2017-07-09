import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("reduce", () => {
        it("correctly evaluates a group {5, 2}.", () => {
            const group = Ast.Factory.create(Ast.NodeType.Group);

            group.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            group.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            const interpreter = new Interpreter.DiceInterpreter();

            const res = interpreter.evaluate(group);
            expect(7).toBe(7);
        });
    });
});
