import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("Parser", () => {
    describe("parseSimpleExpression", () => {
        it("can correctly parse a simple addition", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, "10"),
                new Token(TokenType.MathOpAdd, "+"),
                new Token(TokenType.NumberInteger, "6")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseSimpleExpression();
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe("10");
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe("6");
        });
        it("can correctly parse a simple subtraction", () => {
            const lexer = new MockLexer([
                new Token(TokenType.NumberInteger, "10"),
                new Token(TokenType.MathOpSubtract, "-"),
                new Token(TokenType.NumberInteger, "6")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseSimpleExpression();
            expect(exp.type).toBe(NodeType.Subtract);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe("10");
            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe("6");
        });
        it("can correctly parse a simple negation", () => {
            const lexer = new MockLexer([
                new Token(TokenType.MathOpSubtract, "-"),
                new Token(TokenType.NumberInteger, "4")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseSimpleExpression();
            expect(exp.type).toBe(NodeType.Negate);
            expect(exp.getChildCount()).toBe(1);
            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe("4");
        });
        // TODO: Check multi-operation "4+3-1".
    });
});
