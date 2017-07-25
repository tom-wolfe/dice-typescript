import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { ParseResult } from "../../src/parser/parse-result";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("constructor", () => {
        it("does not throw.", () => {
            expect(() => {
                const parser = new Parser.DiceParser("");
            }).not.toThrow();
        });
    });
    describe("parseNumber", () => {
        it("can correctly parse a number", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, "12")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const node = parser.parseNumber(result);
            expect(result.errors.length).toBe(0);
            expect(node.type).toBe(NodeType.Number);
            expect(node.getAttribute("value")).toBe(12);
        });
    });
});
