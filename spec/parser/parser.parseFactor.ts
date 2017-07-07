import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("Parser", () => {
    describe("parseFactor", () => {
        it("can correctly identify a number factor", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, "10")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseFactor();
            expect(exp.type).toBe(NodeType.Integer);
            expect(exp.getChildCount()).toBe(0);
            expect(exp.getAttribute("value")).toBe(10);
        });
        it("can correctly identify a function call", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, "floor"),
                new Token(TokenType.ParenthesisOpen, "("),
                new Token(TokenType.NumberInteger, "10"),
                new Token(TokenType.ParenthesisClose, ")")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseFactor();
            expect(exp.type).toBe(NodeType.Function);
            expect(exp.getChildCount()).toBe(1);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
        });
        it("can correctly identify a bracketed expression", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, "("),
                new Token(TokenType.NumberInteger, "6"),
                new Token(TokenType.MathOpAdd, "+"),
                new Token(TokenType.NumberInteger, "4"),
                new Token(TokenType.ParenthesisClose, ")"),
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseFactor();
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(6);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(4);
        });
    });
});
