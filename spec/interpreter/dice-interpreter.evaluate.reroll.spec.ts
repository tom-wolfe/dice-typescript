import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockListRandomProvider } from "../helpers/mock-list-random-provider";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates rerolling dice (4d6r<3).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute("once", false);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 6));

            const less = Ast.Factory.create(Ast.NodeType.Less);
            less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 3));

            exp.addChild(dice);
            exp.addChild(less);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(
                6, 5, 6, 2, // This 2 should get re-rolled into a 1, then re-rolled into a 4.
                1, 4
            );

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            expect(interpreter.evaluate(exp, errors)).toBe(21);
            expect(dice.getChildCount()).toBe(4);
        });
        it("evaluates a rerolling dice (4d6ro<3).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute("once", true);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 6));

            const less = Ast.Factory.create(Ast.NodeType.Less);
            less.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 3));

            exp.addChild(dice);
            exp.addChild(less);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(
                6, 5, 6, 2, // This 2 should get re-rolled into a 1, and then stop.
                1
            );

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            expect(interpreter.evaluate(exp, errors)).toBe(18);
            expect(dice.getChildCount()).toBe(4);
        });
        it("evaluates rerolling dice (4d6r).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute("once", false);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 6));
            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(
                6, 5, 6, 1, // This 1 should get re-rolled into another 1, then re-rolled into a 4.
                1, 4
            );

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            expect(interpreter.evaluate(exp, errors)).toBe(21);
            expect(dice.getChildCount()).toBe(4);
        });
        it("evaluates a rerolling dice no condition (4d6ro).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute("once", true);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 6));
            exp.addChild(dice);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(
                2, 5, 6, 1, // This 1 should get re-rolled into a 2, and then stop.
                2
            );

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            expect(interpreter.evaluate(exp, errors)).toBe(15);
            expect(dice.getChildCount()).toBe(4);
        });
        it("errors on an invalid condition (4d6ro[dice]).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Reroll)
                .setAttribute("once", true);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 6));

            const d2 = Ast.Factory.create(Ast.NodeType.Dice);
            d2.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 1));
            d2.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            exp.addChild(dice);
            exp.addChild(d2);

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(6, 5, 6, 2, 1);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(exp, errors);
            expect(errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
