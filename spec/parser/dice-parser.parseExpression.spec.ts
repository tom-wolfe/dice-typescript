import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseExpression", () => {
        it("can correctly identify a boolean operator", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "10"),
                new Token(TokenType.Greater, 2, ">"),
                new Token(TokenType.Integer, 3, "5"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseExpression();
            expect(exp.type).toBe(NodeType.Greater);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(5);
        });
    });
});