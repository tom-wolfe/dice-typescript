import * as Ast from "../../src/ast";

describe("ExpressionNode", () => {
    describe("copy", () => {
        const root = Ast.Factory.create(Ast.NodeType.Add);
        root.addChild(Ast.Factory.create(Ast.NodeType.Dice))
            .setAttribute("times", 4)
            .setAttribute("dice", 20);
        root.addChild(Ast.Factory.create(Ast.NodeType.Integer))
            .setAttribute("value", 10);

        it("should be equal", () => {
            expect(root.copy()).toEqual(root);
        });
        it("should not be the same object", () => {
            expect(root.copy()).not.toBe(root);
        });
    });
    describe("insertChild", () => {
        it("should be equal", () => {
            const root = Ast.Factory.create(Ast.NodeType.Integer);
            expect(() => {
                root.insertChild(root, 0);
            }).toThrow();
        });
    });
});
