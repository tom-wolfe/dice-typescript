import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates a simple integer.", () => {
            const num = Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 4);

            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(num)).toBe(4);
        });
        it("correctly evaluates a subtraction (10-2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Subtract);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 10));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(exp)).toBe(8);
        });
        it("correctly evaluates a multiplication (10*2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Multiply);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 10));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(exp)).toBe(20);
        });
        it("correctly evaluates a division (10/2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 10));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(exp)).toBe(5);
        });
        it("correctly evaluates a exponentiation (10^2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Exponent);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 10));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(exp)).toBe(100);
        });
        it("correctly evaluates a modulo (10%2).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Modulo);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 10));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 2));
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(exp)).toBe(0);
        });
        it("correctly evaluates a negation (-10).", () => {
            const exp = Ast.Factory.create(Ast.NodeType.Negate);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Integer).setAttribute("value", 10));
            const interpreter = new Interpreter.DiceInterpreter();
            expect(interpreter.evaluate(exp)).toBe(-10);
        });
    });
});
