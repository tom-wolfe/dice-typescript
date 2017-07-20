import * as Ast from "../../src/ast";
import * as Parser from "../../src/parser";

describe("DiceParser", () => {
    describe("parse method", () => {
        it("exists for each node type.", () => {
            const parser = new Parser.DiceParser("");
            Object.keys(Ast.NodeType).forEach(nodeType => {
                const methodName = "parse" + nodeType
                expect(parser[methodName]).toBeDefined(`Parse method ${methodName} does not exist.`);
            });
        });
    });
});
