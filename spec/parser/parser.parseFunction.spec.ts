import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("Parser", () => {
    describe("parseFunction", () => {
        it("can correctly parse a function with no arguments", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "floor"),
                new Token(TokenType.ParenthesisOpen, 5, "("),
                new Token(TokenType.ParenthesisClose, 6, ")")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseFunctionCall();
            expect(exp.type).toBe(NodeType.Function);
            expect(exp.getChildCount()).toBe(0);
            expect(exp.getAttribute("name")).toBe("floor");
        });
        it("can correctly parse a function with one simple argument", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "floor"),
                new Token(TokenType.ParenthesisOpen, 5, "("),
                new Token(TokenType.NumberInteger, 6, "10"),
                new Token(TokenType.ParenthesisClose, 8, ")")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseFunctionCall();
            expect(exp.type).toBe(NodeType.Function);
            expect(exp.getChildCount()).toBe(1);
            expect(exp.getAttribute("name")).toBe("floor");

            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
        });
        it("can correctly parse a function with one complex argument", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "floor"),
                new Token(TokenType.ParenthesisOpen, 5, "("),
                new Token(TokenType.NumberInteger, 6, "10"),
                new Token(TokenType.MathOpMultiply, 8, "*"),
                new Token(TokenType.NumberInteger, 9, "2"),
                new Token(TokenType.ParenthesisClose, 10, ")")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseFunctionCall();
            expect(exp.type).toBe(NodeType.Function);
            expect(exp.getChildCount()).toBe(1);
            expect(exp.getAttribute("name")).toBe("floor");

            expect(exp.getChild(0).type).toBe(NodeType.Multiply);
            expect(exp.getChild(0).getChildCount()).toBe(2);
            expect(exp.getChild(0).getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getChild(0).getAttribute("value")).toBe(10);
            expect(exp.getChild(0).getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getChild(1).getAttribute("value")).toBe(2);
        });
        it("can correctly parse a function with two multiple arguments", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "floor"),
                new Token(TokenType.ParenthesisOpen, 5, "("),
                new Token(TokenType.NumberInteger, 6, "10"),
                new Token(TokenType.Comma, 8, ","),
                new Token(TokenType.NumberInteger, 9, "5"),
                new Token(TokenType.ParenthesisClose, 10, ")")
            ]);
            const parser = new Parser.Parser(lexer);
            const exp = parser.parseFunctionCall();
            expect(exp.type).toBe(NodeType.Function);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getAttribute("name")).toBe("floor");

            expect(exp.getChild(0).type).toBe(NodeType.Integer);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);

            expect(exp.getChild(1).type).toBe(NodeType.Integer);
            expect(exp.getChild(1).getAttribute("value")).toBe(5);
        });
    });
});
