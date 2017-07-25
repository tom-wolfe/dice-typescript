import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("correctly evaluates a group {5, 2}.", () => {
            const group = Ast.Factory.create(Ast.NodeType.Group);

            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 5));
            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(group, errors);
            expect(group.getChildCount()).toBe(2);
        });
         it("correctly evaluates a group with a repeat {5...2}.", () => {
            const group = Ast.Factory.create(Ast.NodeType.Group);

            const repeat = Ast.Factory.create(Ast.NodeType.Repeat);
            repeat.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 5));
            repeat.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            group.addChild(repeat);

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(group, errors);
            expect(group.getChildCount()).toBe(2);
            expect(group.getChild(0).type).toEqual(Ast.NodeType.Number);
            expect(group.getChild(0).getAttribute("value")).toEqual(5);
            expect(group.getChild(1).type).toEqual(Ast.NodeType.Number);
            expect(group.getChild(1).getAttribute("value")).toEqual(5);
            expect(group.getAttribute("value")).toEqual(10);
        });
        it("correctly evaluates a group with modifiers {5, 2, 4}kh2.", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Keep)
                .setAttribute("type", "highest");

            const group = Ast.Factory.create(Ast.NodeType.Group);

            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 5));
            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));
            group.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 4));

            exp.addChild(group);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);
            expect(group.getChildCount()).toBe(3);
            expect(group.getChild(0).getAttribute("drop")).toBe(false);
            expect(group.getChild(1).getAttribute("drop")).toBe(true);
            expect(group.getChild(2).getAttribute("drop")).toBe(false);
        });
    });
});
