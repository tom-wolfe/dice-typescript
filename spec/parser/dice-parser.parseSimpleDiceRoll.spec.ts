import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { ParseResult } from "../../src/parser/parse-result";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseSimpleDiceRoll", () => {
        it("can correctly parse a simple dice roll with pre-parsed number.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "10"),
                new Token(TokenType.Identifier, 2, "d"),
                new Token(TokenType.Integer, 3, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const num = parser.parseInteger(result);
            expect(result.errors.length).toBe(0);
            const dice = parser.parseSimpleDiceRoll(result, num);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Integer);
            expect(dice.getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("can correctly parse a simple dice roll.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "10"),
                new Token(TokenType.Identifier, 2, "d"),
                new Token(TokenType.Integer, 3, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const dice = parser.parseSimpleDiceRoll(result);
            expect(result.errors.length).toBe(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Integer);
            expect(dice.getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("can correctly parse a simple fate dice roll", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "10"),
                new Token(TokenType.Identifier, 2, "dF")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const dice = parser.parseSimpleDiceRoll(result);
            expect(result.errors.length).toBe(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Integer);
            expect(dice.getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe("fate");
        });
        it("can correctly parse a dice roll with a bracketed number", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Integer, 1, "10"),
                new Token(TokenType.ParenthesisClose, 3, ")"),
                new Token(TokenType.Identifier, 4, "d"),
                new Token(TokenType.Integer, 5, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const dice = parser.parseSimpleDiceRoll(result);
            expect(result.errors.length).toBe(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Integer);
            expect(dice.getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("can correctly parse a dice roll with a bracketed expression", () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, "("),
                new Token(TokenType.Integer, 1, "10"),
                new Token(TokenType.Plus, 3, "+"),
                new Token(TokenType.Integer, 4, "3"),
                new Token(TokenType.ParenthesisClose, 5, ")"),
                new Token(TokenType.Identifier, 6, "d"),
                new Token(TokenType.Integer, 7, "6")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const dice = parser.parseSimpleDiceRoll(result);
            expect(result.errors.length).toBe(0);
            expect(dice.type).toBe(NodeType.Dice);
            expect(dice.getChildCount()).toBe(2);
            expect(dice.getChild(0).type).toBe(NodeType.Add);
            expect(dice.getChild(0).getChildCount()).toBe(2);
            expect(dice.getChild(0).getChild(0).type).toBe(NodeType.Integer);
            expect(dice.getChild(0).getChild(0).getAttribute("value")).toBe(10);
            expect(dice.getChild(0).getChild(1).type).toBe(NodeType.Integer);
            expect(dice.getChild(0).getChild(1).getAttribute("value")).toBe(3);
            expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
            expect(dice.getChild(1).getAttribute("value")).toBe(6);
        });
        it("throws on missing roll times", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "d"),
                new Token(TokenType.Integer, 1, "10")
            ]);
            const parser = new Parser.DiceParser(lexer);

            const result = new ParseResult();
            const dice = parser.parseSimpleDiceRoll(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
        it("throws on missing dice value", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Integer, 0, "6"),
                new Token(TokenType.Identifier, 1, "d")
            ]);
            const parser = new Parser.DiceParser(lexer);

            const result = new ParseResult();
            const dice = parser.parseSimpleDiceRoll(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
