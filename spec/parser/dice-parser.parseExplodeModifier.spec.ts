import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseExplodeModifier", () => {
        it("can correctly parse an explode modifier (!).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Exclamation, 0, "!")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseExplodeModifier();
            expect(mod.type).toBe(NodeType.Explode);
            expect(mod.getAttribute("compound")).toBe("no");
            expect(mod.getAttribute("penetrate")).toBe("no");
        });
        it("can correctly parse an explode modifier (!!).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Exclamation, 0, "!"),
                new Token(TokenType.Exclamation, 1, "!"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseExplodeModifier();
            expect(mod.type).toBe(NodeType.Explode);
            expect(mod.getAttribute("compound")).toBe("yes");
            expect(mod.getAttribute("penetrate")).toBe("no");
        });
        it("can correctly parse an explode modifier (!p).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Exclamation, 0, "!"),
                new Token(TokenType.Identifier, 1, "p"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseExplodeModifier();
            expect(mod.type).toBe(NodeType.Explode);
            expect(mod.getAttribute("compound")).toBe("no");
            expect(mod.getAttribute("penetrate")).toBe("yes");
        });
        it("can correctly parse an explode modifier (!p).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Exclamation, 0, "!"),
                new Token(TokenType.Exclamation, 1, "!"),
                new Token(TokenType.Identifier, 2, "p"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseExplodeModifier();
            expect(mod.type).toBe(NodeType.Explode);
            expect(mod.getAttribute("compound")).toBe("yes");
            expect(mod.getAttribute("penetrate")).toBe("yes");
        });
        it("can correctly parse an explode modifier with a compare point(!p<3).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Exclamation, 0, "!"),
                new Token(TokenType.Identifier, 1, "p"),
                new Token(TokenType.Less, 2, "<"),
                new Token(TokenType.Integer, 3, "3"),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseExplodeModifier();
            expect(mod.type).toBe(NodeType.Explode);
            expect(mod.getAttribute("compound")).toBe("no");
            expect(mod.getAttribute("penetrate")).toBe("yes");
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Less);
        });
    });
});