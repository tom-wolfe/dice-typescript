import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("Parser", () => {
    describe("parseBracketedExpression", () => {
        it("can correctly parse a simple expression", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, "("),
                new Token(TokenType.NumberInteger, "10"),
                new Token(TokenType.ParenthesisClose, ")")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseBracketedExpression();
            expect(exp.type).toBe(NodeType.Integer);
            expect(exp.getChildCount()).toBe(0);
            expect(exp.getAttribute("value")).toBe(10);
        });
        it("can correctly parse an addition", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, "("),
                new Token(TokenType.NumberInteger, "10"),
                new Token(TokenType.MathOpAdd, "+"),
                new Token(TokenType.NumberInteger, "6"),
                new Token(TokenType.ParenthesisClose, ")"),
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseBracketedExpression();
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(6);
        });
        it("throws on missing closing bracket", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, "("),
                new Token(TokenType.NumberInteger, "10"),
                new Token(TokenType.MathOpAdd, "+"),
                new Token(TokenType.NumberInteger, "6")
            ]);
            const parser = new Parser.Parser(lexer);
            expect(() => parser.parseBracketedExpression()).toThrow();
        });
    });
});
