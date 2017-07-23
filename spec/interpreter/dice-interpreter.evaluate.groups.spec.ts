import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { ErrorMessage } from "../../src/interpreter/error-message";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("correctly evaluates a group {5, 2}.", () => {
            const group = Ast.Factory.create(Ast.NodeType.Group);

            group.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            group.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: ErrorMessage[] = [];
            interpreter.evaluate(group, errors);
            expect(group.getChildCount()).toBe(2);
        });
        it("correctly evaluates a group with modifiers {5, 2, 4}kh2.", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Keep)
                .setAttribute("type", "highest");

            const group = Ast.Factory.create(Ast.NodeType.Group);

            group.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            group.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            group.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4));

            exp.addChild(group);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);
            expect(group.getChildCount()).toBe(3);
            expect(group.getChild(0).getAttribute("drop")).toBe(false);
            expect(group.getChild(1).getAttribute("drop")).toBe(true);
            expect(group.getChild(2).getAttribute("drop")).toBe(false);
        });
    });
});
