import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("correctly evaluates a function(floor(5 / 2)).", () => {
            const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute("name", "floor");

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            func.addChild(exp);

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(2);
        });
        it("correctly evaluates a function(ceil(5 / 2)).", () => {
            const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute("name", "ceil");

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            func.addChild(exp);

            const interpreter = new Interpreter.DiceInterpreter();

            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(3);
        });
        it("correctly evaluates a function(sqrt(9)).", () => {
            const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute("name", "sqrt");
            func.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 9));

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(3);
        });
        it("correctly evaluates a function(abs(-9)).", () => {
            const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute("name", "abs");

            const negate = Ast.Factory.create(Ast.NodeType.Negate);
            negate.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 9));

            func.addChild(negate);

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(9);
        });
        it("correctly evaluates a function(round(5 / 2)).", () => {
            const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute("name", "round");

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            func.addChild(exp);

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            const res = interpreter.evaluate(func, errors);
            expect(res).toBe(3);
        });
        it("throws an error on an unknown function.", () => {
            const func = Ast.Factory.create(Ast.NodeType.Function).setAttribute("name", "xxx");

            const exp = Ast.Factory.create(Ast.NodeType.Divide);
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 5));
            exp.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));

            func.addChild(exp);

            const interpreter = new Interpreter.DiceInterpreter();
            const errors: Interpreter.ErrorMessage[] = [];
            expect(() => interpreter.evaluate(func, errors)).toThrow();
        });
    });
});
