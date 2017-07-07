import * as Ast from "../../src/ast";

describe("ExpressionNode", () => {
    const root = Ast.Factory.create(Ast.NodeType.Add);
    root.addChild(Ast.Factory.create(Ast.NodeType.Dice))
        .setAttribute("times", 4)
        .setAttribute("dice", 20);
    root.addChild(Ast.Factory.create(Ast.NodeType.Integer))
        .setAttribute("value", 10);

    describe("copy", () => {
        it("should be equal", () => {
            expect(root.copy()).toEqual(root);
        });
        it("should not be the same object", () => {
            expect(root.copy()).not.toBe(root);
        });
    });
});
