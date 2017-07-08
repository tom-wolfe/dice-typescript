import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseTerm", () => {
        it("can correctly identify a multiplication", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "6"),
                new Token(TokenType.Asterisk, 1, "*"),
                new Token(TokenType.Integer, 2, "4"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Multiply);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(6);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(4);
        });
        it("can correctly identify a division", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "6"),
                new Token(TokenType.Slash, 1, "/"),
                new Token(TokenType.Integer, 2, "4"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Divide);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(6);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(4);
        });
        it("can correctly identify an exponent", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "6"),
                new Token(TokenType.DoubleAsterisk, 1, "**"),
                new Token(TokenType.Integer, 3, "4"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Exponent);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(6);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(4);
        });
        it("can correctly identify a modulo", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "6"),
                new Token(TokenType.Percent, 1, "%"),
                new Token(TokenType.Integer, 2, "4"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Modulo);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(6);
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(4);
        });
        it("can correctly parse multiple operators", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "4"),
                new Token(TokenType.Asterisk, 1, "*"),
                new Token(TokenType.Integer, 2, "3"),
                new Token(TokenType.Slash, 3, "/"),
                new Token(TokenType.Integer, 4, "1")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Divide);
            expect(exp.getChildCount()).toBe(2);

            const lhs = exp.getChild(0);
            expect(lhs.type).toBe(NodeType.Multiply);
            expect(lhs.getChildCount()).toBe(2);
            expect(lhs.getChild(0).type).toBe(NodeType.Integer);
            expect(lhs.getChild(0).getAttribute("value")).toBe(4);
            expect(lhs.getChild(1).type).toBe(NodeType.Integer);
            expect(lhs.getChild(1).getAttribute("value")).toBe(3);

            const rhs = exp.getChild(1);
            expect(rhs.type).toBe(NodeType.Integer);
            expect(rhs.getAttribute("value")).toBe(1);
        });
    });
});
