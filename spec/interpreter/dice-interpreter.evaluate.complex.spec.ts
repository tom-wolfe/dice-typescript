import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockListRandomProvider } from "../helpers/mock-list-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates a complex dice roll with modifiers (4d6!kh2sa).", () => {
            const sort = Ast.Factory.create(Ast.NodeType.Sort)
                .setAttribute("direction", "ascending");

            const keep = Ast.Factory.create(Ast.NodeType.Keep);
            keep.setAttribute("type", "highest");
            sort.addChild(keep);

            const exp = Ast.Factory.create(Ast.NodeType.Explode)
                .setAttribute("penetrate", false)
                .setAttribute("compound", false);
            keep.addChild(exp);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            exp.addChild(dice)
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 4));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute("value", 6));

            keep.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            const mockList = new MockListRandomProvider();
            mockList.numbers.push(1, 6, 4, 2, 5);

            const interpreter = new Interpreter.DiceInterpreter(null, mockList);
            const errors: Interpreter.ErrorMessage[] = [];
            interpreter.evaluate(sort, errors);

            expect(sort.getAttribute("value")).toBe(11);
            expect(keep.getAttribute("value")).toBe(11);
            expect(dice.getAttribute("value")).toBe(13);
            expect(exp.getAttribute("value")).toBe(18);

            expect(dice.getChildCount()).toBe(5);
            expect(dice.getChild(0).getAttribute("value")).toBe(1);
            expect(dice.getChild(1).getAttribute("value")).toBe(2);
            expect(dice.getChild(2).getAttribute("value")).toBe(4);
            expect(dice.getChild(3).getAttribute("value")).toBe(5);
            expect(dice.getChild(4).getAttribute("value")).toBe(6);

            expect(dice.getChild(0).getAttribute("drop")).toBe(true);
            expect(dice.getChild(1).getAttribute("drop")).toBe(true);
            expect(dice.getChild(2).getAttribute("drop")).toBe(true);
            expect(dice.getChild(3).getAttribute("drop")).toBe(false);
            expect(dice.getChild(4).getAttribute("drop")).toBe(false);
        });
    });
});
