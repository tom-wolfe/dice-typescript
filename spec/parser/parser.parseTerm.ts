import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("Parser", () => {
    describe("parseTerm", () => {
        it("can correctly identify a multiplication", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, "6"),
                new Token(TokenType.MathOpMultiply, "*"),
                new Token(TokenType.NumberInteger, "4"),
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Multiply);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe("6");
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe("4");
        });
        it("can correctly identify a division", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, "6"),
                new Token(TokenType.MathOpDivide, "/"),
                new Token(TokenType.NumberInteger, "4"),
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Divide);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe("6");
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe("4");
        });
        it("can correctly identify an exponent", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, "6"),
                new Token(TokenType.MathOpExponent, "**"),
                new Token(TokenType.NumberInteger, "4"),
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Exponent);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe("6");
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe("4");
        });
        it("can correctly identify a modulo", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, "6"),
                new Token(TokenType.MathOpModulo, "%"),
                new Token(TokenType.NumberInteger, "4"),
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseTerm();
            expect(exp.type).toBe(NodeType.Modulo);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe("6");
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe("4");
        });
        // TODO: Check multi-operation "4 * 2 / 1".
    });
});
