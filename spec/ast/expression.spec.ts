import * as Ast from "../../src/ast";

describe("Expression", () => {
    describe("stringify", () => {
        it("should convert to JSON", () => {
            const root = Ast.Factory.create(Ast.NodeType.Add);
            root.addChild(Ast.Factory.create(Ast.NodeType.Dice))
                .setAttribute("times", 4)
                .setAttribute("dice", 20);
            root.addChild(Ast.Factory.create(Ast.NodeType.Number))
                .setAttribute("value", 10);
            expect(() => {
                JSON.stringify(root);
            }).not.toThrow();
        });
    });
});
