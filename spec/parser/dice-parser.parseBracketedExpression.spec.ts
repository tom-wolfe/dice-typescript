import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseBracketedExpression", () => {
        it("can correctly parse a simple expression", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Integer, 1, "10"),
                new Token(TokenType.ParenthesisClose, 3, ")")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new Parser.ParseResult();
            const exp = parser.parseBracketedExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Integer);
            expect(exp.getChildCount()).toBe(0);
            expect(exp.getAttribute("value")).toBe(10);
        });
        it("can correctly parse an addition", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Integer, 1, "10"),
                new Token(TokenType.Plus, 3, "+"),
                new Token(TokenType.Integer, 4, "6"),
                new Token(TokenType.ParenthesisClose, 5, ")"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new Parser.ParseResult();
            const exp = parser.parseBracketedExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(6);
        });
        it("throws on missing closing bracket", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Integer, 1, "10"),
                new Token(TokenType.Plus, 3, "+"),
                new Token(TokenType.Integer, 4, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);

            const result = new Parser.ParseResult();
            const exp = parser.parseBracketedExpression(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
