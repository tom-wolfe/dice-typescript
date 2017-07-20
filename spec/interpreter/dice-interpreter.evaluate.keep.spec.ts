import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { ErrorMessage } from "../../src/interpreter/error-message";
import { MockListRandomProvider } from "../helpers/mock-list-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates keep modifier (5d20kh2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Keep)
                .setAttribute("type", "highest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(1).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(2).getAttribute("drop")).toBe("no");
            expect(dice.getChild(3).getAttribute("drop")).toBe("no");
            expect(dice.getChild(4).getAttribute("drop")).toBe("yes");
        });
        it("evaluates keep modifier (5d20kh).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Keep)
                .setAttribute("type", "highest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(1).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(2).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(3).getAttribute("drop")).toBe("no");
            expect(dice.getChild(4).getAttribute("drop")).toBe("yes");
        });
        it("evaluates keep modifier (5d20kl2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Keep)
                .setAttribute("type", "lowest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("no");
            expect(dice.getChild(1).getAttribute("drop")).toBe("no");
            expect(dice.getChild(2).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(3).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(4).getAttribute("drop")).toBe("yes");
        });
        it("evaluates keep modifier (5d20kl).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Keep)
                .setAttribute("type", "lowest");

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(8, 12, 18, 20, 14);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("drop")).toBe("no");
            expect(dice.getChild(1).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(2).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(3).getAttribute("drop")).toBe("yes");
            expect(dice.getChild(4).getAttribute("drop")).toBe("yes");
        });
    });
});
