import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("Interpreter", () => {
    describe("reduce", () => {
        it("evaluates a simple integer.", () => {
            const num = Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4);

            const interpreter = new Interpreter.Interpreter();
            expect(interpreter.evaluate(num)).toBe(4);
        });
        it("evaluates a simple dice expression (2d6).", () => {
            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute("value", 6));

            const interpreter = new Interpreter.Interpreter(new MockRandomProvider(4));
            expect(interpreter.evaluate(dice)).toBe(8);
        });
        it("evaluates a hidden simple dice expression (2d6 + 4).", () => {
            const add = Ast.Factory.create(Ast.NodeType.Add);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute("value", 6));

            add.addChild(dice);
            add.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4));

            const interpreter = new Interpreter.Interpreter(new MockRandomProvider(3));
            expect(interpreter.evaluate(add)).toBe(10);
        });
        it("evaluates a complex dice expression ((1 + 2)d6).", () => {
            const dice = Ast.Factory.create(Ast.NodeType.Dice);

            const add = Ast.Factory.create(Ast.NodeType.Add);
            add.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 1));
            add.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));

            dice.addChild(add);
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute("value", 6));

            const interpreter = new Interpreter.Interpreter(new MockRandomProvider(2));

            expect(interpreter.evaluate(dice)).toBe(6);
        });
    });
});
