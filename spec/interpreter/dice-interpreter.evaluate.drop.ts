import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockListRandomProvider } from "../helpers/mock-list-random-provider";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates drop modifier (5d20dh2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Drop)
                .setAttribute("type", "highest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            interpreter.evaluate(exp);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("no");
            expect(dice.getChild(1).getAttribute("drop")).toBe("no");
            expect(dice.getChild(2).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(3).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(4).getAttribute("drop")).toBe("no");
        });
        it("evaluates drop modifier (5d20dh).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Drop)
                .setAttribute("type", "highest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            interpreter.evaluate(exp);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("no");
            expect(dice.getChild(1).getAttribute("drop")).toBe("no");
            expect(dice.getChild(2).getAttribute("drop")).toBe("no");
            expect(dice.getChild(3).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(4).getAttribute("drop")).toBe("no");
        });
        it("evaluates drop modifier (5d20dl2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Drop)
                .setAttribute("type", "lowest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            interpreter.evaluate(exp);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(1).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(2).getAttribute("drop")).toBe("no");
            expect(dice.getChild(3).getAttribute("drop")).toBe("no");
            expect(dice.getChild(4).getAttribute("drop")).toBe("no");
        });
        it("evaluates drop modifier (5d20dl).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Drop)
                .setAttribute("type", "lowest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            interpreter.evaluate(exp);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(1).getAttribute("drop")).toBe("no");
            expect(dice.getChild(2).getAttribute("drop")).toBe("no");
            expect(dice.getChild(3).getAttribute("drop")).toBe("no");
            expect(dice.getChild(4).getAttribute("drop")).toBe("no");
        });
    });
});