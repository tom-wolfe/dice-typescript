import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("constructor", () => {
        it("does not throw.", () => {
            expect(() => {
                const parser = new Parser.DiceParser("");
            }).not.toThrow();
        });
    });
    describe("parseInteger", () => {
        it("can correctly parse an integer", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, 0, "12")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const node = parser.parseInteger();
            expect(node.type).toBe(NodeType.Integer);
            expect(node.getAttribute("value")).toBe(12);
        });
    });
});
