import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { ParseResult } from "../../src/parser/parse-result";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseGroup", () => {
        it("can correctly parse a group with no elements.", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.BraceClose, 1, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(0);
        });
        it("can correctly parse a group with one simple argument", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.BraceClose, 3, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(1);

            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);
        });
        it("can correctly parse a group with one complex argument", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Asterisk, 3, "*"),
                new Token(TokenType.Number, 4, "2"),
                new Token(TokenType.BraceClose, 5, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(1);

            expect(exp.getChild(0).type).toBe(NodeType.Multiply);
            expect(exp.getChild(0).getChildCount()).toBe(2);
            expect(exp.getChild(0).getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getChild(0).getAttribute("value")).toBe(10);
            expect(exp.getChild(0).getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getChild(1).getAttribute("value")).toBe(2);
        });
        it("can correctly parse a group with two arguments", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Comma, 3, ","),
                new Token(TokenType.Number, 4, "5"),
                new Token(TokenType.BraceClose, 5, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Group);
            expect(exp.getChildCount()).toBe(2);

            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute("value")).toBe(10);

            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).getAttribute("value")).toBe(5);
        });
        it("can correctly parse a group with a keep modifier", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Comma, 3, ","),
                new Token(TokenType.Number, 4, "5"),
                new Token(TokenType.BraceClose, 5, "}"),
                new Token(TokenType.Identifier, 6, "kh")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Keep);
            expect(exp.getChildCount()).toBe(1);

            expect(exp.getChild(0).type).toBe(NodeType.Group);
        });
        it("can correctly parse a group with a drop modifier", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Comma, 3, ","),
                new Token(TokenType.Number, 4, "5"),
                new Token(TokenType.BraceClose, 5, "}"),
                new Token(TokenType.Identifier, 6, "dl")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Drop);
            expect(exp.getChildCount()).toBe(1);

            expect(exp.getChild(0).type).toBe(NodeType.Group);
        });
        it("can correctly parse a group with a sort modifier", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Comma, 3, ","),
                new Token(TokenType.Number, 4, "5"),
                new Token(TokenType.BraceClose, 5, "}"),
                new Token(TokenType.Identifier, 6, "sa")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Sort);
            expect(exp.getChildCount()).toBe(1);

            expect(exp.getChild(0).type).toBe(NodeType.Group);
        });
        it("can correctly parse a group with a boolean condition {10, 5}>5", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Comma, 3, ","),
                new Token(TokenType.Number, 4, "5"),
                new Token(TokenType.BraceClose, 5, "}"),
                new Token(TokenType.Greater, 6, ">"),
                new Token(TokenType.Number, 7, "5")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);

            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Greater);
            expect(exp.getChildCount()).toBe(2);

            expect(exp.getChild(0).type).toBe(NodeType.Group);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
        });
        it("can correctly parse a group with a repeating argument", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "2"),
                new Token(TokenType.Identifier, 2, "d"),
                new Token(TokenType.Number, 3, "20"),
                new Token(TokenType.Ellipsis, 5, "..."),
                new Token(TokenType.Number, 8, "10"),
                new Token(TokenType.BraceClose, 10, "}")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(0, `Unexpected errors occurred: ${result.errors.map(e => e.message).join(", ")}.`);
            expect(exp.type).toBe(NodeType.Group, "A group node was not returned.");
            expect(exp.getChildCount()).toBe(1, "Group does not have a single child.");

            expect(exp.getChild(0).type).toBe(NodeType.Repeat, "Group node child is not of type repeat.");
            expect(exp.getChild(0).getChildCount()).toBe(2, "Repeat node does not have two operands.");
            expect(exp.getChild(0).getChild(0).type).toBe(NodeType.Dice, "Repeat node LHS is not of type Dice.");
            expect(exp.getChild(0).getChild(1).type).toBe(NodeType.Number, "Repeat node RHS is not of type Number");
            expect(exp.getChild(0).getChild(1).getAttribute("value")).toBe(10);
        });
        it("throws on group with bad modifier", () => {
            const lexer = new MockLexer([
                new Token(TokenType.BraceOpen, 0, "{"),
                new Token(TokenType.Number, 1, "10"),
                new Token(TokenType.Comma, 3, ","),
                new Token(TokenType.Number, 4, "5"),
                new Token(TokenType.BraceClose, 5, "}"),
                new Token(TokenType.Identifier, 6, "ro")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseGroup(result);
            expect(result.errors.length).toBe(1);
        });
    });
});
