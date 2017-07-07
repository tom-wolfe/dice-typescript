import * as Ast from "../../src/ast";

describe("Expression", () => {
    describe("stringify", () => {
        it("should convert to JSON", () => {
            const root = Ast.Factory.create(Ast.NodeType.Add);
            root.addChild(Ast.Factory.create(Ast.NodeType.Dice))
                .setAttribute("times", 4)
                .setAttribute("dice", 20);
            root.addChild(Ast.Factory.create(Ast.NodeType.Integer))
                .setAttribute("value", 10);
            const exp = new Ast.Expression(root);
            expect(() => {
                JSON.stringify(exp);
            }).not.toThrow();
        });
    });
});
