import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseDropModifier", () => {
        it("can correctly parse a drop modifier (d).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "d")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseDropModifier();
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute("type")).toBe("lowest");
        });
        it("can correctly parse a drop modifier (dh).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "dh")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseDropModifier();
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute("type")).toBe("highest");
        });
        it("can correctly parse a drop modifier (dl).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "dl")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseDropModifier();
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute("type")).toBe("lowest");
        });
        it("can correctly parse a drop modifier with simple number (dl3).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "dl"),
                new Token(TokenType.Integer, 2, "3")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseDropModifier();
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute("type")).toBe("lowest");
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Integer);
            expect(mod.getChild(0).getAttribute("value")).toBe(3);
        });
        it("can correctly parse a drop modifier with simple number (dl(5+3)).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "dl"),
                new Token(TokenType.ParenthesisOpen, 2, "("),
                new Token(TokenType.Integer, 3, "5"),
                new Token(TokenType.Plus, 4, "+"),
                new Token(TokenType.Integer, 5, "3"),
                new Token(TokenType.ParenthesisClose, 6, ")")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseDropModifier();
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute("type")).toBe("lowest");
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Add);
        });
    });
});
