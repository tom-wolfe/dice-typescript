import { ParseResult } from "../../src/parser/parse-result";
import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseFactor", () => {
        it("can correctly identify a number factor", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, "10")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Number);
            expect(exp.getChildCount()).toBe(0);
            expect(exp.getAttribute("value")).toBe(10);
        });
        it("can correctly identify a function call", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "floor"),
                new Token(TokenType.ParenthesisOpen, 5, "("),
                new Token(TokenType.Number, 6, "10"),
                new Token(TokenType.ParenthesisClose, 8, ")")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Function);
            expect(exp.getChildCount()).toBe(1);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
        });
        it("can correctly identify a bracketed expression", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Number, 1, "6"),
                new Token(TokenType.Plus, 2, "+"),
                new Token(TokenType.Number, 3, "4"),
                new Token(TokenType.ParenthesisClose, 4, ")"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute("value")).toBe(6);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).getAttribute("value")).toBe(4);
        });
        it("can correctly identify a simple dice roll.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, "10"),
                new Token(TokenType.Identifier, 1, "d"),
                new Token(TokenType.Number, 2, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const dice = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Number);
            expect(dice.getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("can correctly identify a dice roll with a bracketed number", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.ParenthesisClose, 3, ")"),
                new Token(TokenType.Identifier, 4, "d"),
                new Token(TokenType.Number, 5, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const dice = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Number);
            expect(dice.getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("can correctly identify a dice roll with a bracketed expression", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Plus, 3, "+"),
                new Token(TokenType.Number, 4, "3"),
                new Token(TokenType.ParenthesisClose, 5, ")"),
                new Token(TokenType.Identifier, 6, "d"),
                new Token(TokenType.Number, 7, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const dice = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Add);
            expect(dice.getChild(0).getChildCount()).toBe(2);
            expect(dice.getChild(0).getChild(0).type).toBe(NodeType.Number);
            expect(dice.getChild(0).getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(0).getChild(1).type).toBe(NodeType.Number);
            expect(dice.getChild(0).getChild(1).getAttribute("value")).toBe(3);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("can correctly identify a group.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 5, "{"),
                new Token(TokenType.Number, 6, "10"),
                new Token(TokenType.Comma, 8, ","),
                new Token(TokenType.Number, 9, "5"),
                new Token(TokenType.BraceClose, 10, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(2);

            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);

            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).getAttribute("value")).toBe(5);
        });
        it("throws on unexpected token type.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Comma, 5, ","),
                new Token(TokenType.Number, 6, "10"),
            ]);
            const parser = new Parser.DiceParser(lexer);

            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
