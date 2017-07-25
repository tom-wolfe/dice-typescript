import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockListRandomProvider } from "../helpers/mock-list-random-provider";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates dice compare modifier (4d20>5).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Greater)

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(1, 2, 6, 20);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(4);
            expect(dice.getChild(0).getAttribute("success")).toBe(false);
            expect(dice.getChild(1).getAttribute("success")).toBe(false);
            expect(dice.getChild(2).getAttribute("success")).toBe(true);
            expect(dice.getChild(3).getAttribute("success")).toBe(true);
        });
        it("evaluates dice compare modifier (4d20>=5).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.GreaterOrEqual)

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(1, 2, 5, 20);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(4);
            expect(dice.getChild(0).getAttribute("success")).toBe(false);
            expect(dice.getChild(1).getAttribute("success")).toBe(false);
            expect(dice.getChild(2).getAttribute("success")).toBe(true);
            expect(dice.getChild(3).getAttribute("success")).toBe(true);
        });
        it("evaluates dice compare modifier (4d20=5).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Equal)

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(1, 2, 5, 20);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(4);
            expect(dice.getChild(0).getAttribute("success")).toBe(false);
            expect(dice.getChild(1).getAttribute("success")).toBe(false);
            expect(dice.getChild(2).getAttribute("success")).toBe(true);
            expect(dice.getChild(3).getAttribute("success")).toBe(false);
        });
        it("evaluates dice compare modifier (4d20<5).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Less)

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(1, 2, 5, 20);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(4);
            expect(dice.getChild(0).getAttribute("success")).toBe(true);
            expect(dice.getChild(1).getAttribute("success")).toBe(true);
            expect(dice.getChild(2).getAttribute("success")).toBe(false);
            expect(dice.getChild(3).getAttribute("success")).toBe(false);
        });
        it("evaluates dice compare modifier (4d20<=5).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.LessOrEqual)

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 20));

            exp.addChild(dice);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 5));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(1, 2, 5, 20);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);

            expect(dice.getChildCount()).toBe(4);
            expect(dice.getChild(0).getAttribute("success")).toBe(true);
            expect(dice.getChild(1).getAttribute("success")).toBe(true);
            expect(dice.getChild(2).getAttribute("success")).toBe(true);
            expect(dice.getChild(3).getAttribute("success")).toBe(false);
        });
    });
});
