import * as Ast from "../../src/ast";
import * as Generator from "../../src/generator";

describe("DiceGenerator", () => {
    describe("generate", () => {
        it("throws on unrecognized node type (--).", () => {
            const exp = new Ast.ExpressionNode(<any>"Face", null);

            const dice = Ast.Factory.create(Ast.NodeType.Dice);
            dice.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute("value", 2));
            dice.addChild(Ast.Factory.create(Ast.NodeType.DiceSides).setAttribute("value", 6));
            exp.addChild(dice);

            const generator = new Generator.DiceGenerator();
            expect(() => generator.generate(exp)).toThrow();
        });
    });
});
