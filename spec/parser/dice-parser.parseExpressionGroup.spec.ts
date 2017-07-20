import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { ParseResult } from "../../src/parser/parse-result";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseExpressionGroup", () => {
        it("can correctly parse a group with no elements.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.BraceClose, 1, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpressionGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(0);
        });
        it("can correctly parse a group with one simple argument", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 5, "{"),
                new Token(TokenType.Integer, 6, "10"),
                new Token(TokenType.BraceClose, 8, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpressionGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(1);

            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
        });
        it("can correctly parse a group with one complex argument", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 5, "{"),
                new Token(TokenType.Integer, 6, "10"),
                new Token(TokenType.Asterisk, 8, "*"),
                new Token(TokenType.Integer, 9, "2"),
                new Token(TokenType.BraceClose, 10, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpressionGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(1);

            expect(exp.getChild(0).type).toBe(NodeType.Multiply);
            expect(exp.getChild(0).getChildCount()).toBe(2);
            expect(exp.getChild(0).getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getChild(0).getAttribute("value")).toBe(10);
            expect(exp.getChild(0).getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getChild(1).getAttribute("value")).toBe(2);
        });
        it("can correctly parse a group with two arguments", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 5, "{"),
                new Token(TokenType.Integer, 6, "10"),
                new Token(TokenType.Comma, 8, ","),
                new Token(TokenType.Integer, 9, "5"),
                new Token(TokenType.BraceClose, 10, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpressionGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(2);

            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);

            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(5);
        });
    });
});
