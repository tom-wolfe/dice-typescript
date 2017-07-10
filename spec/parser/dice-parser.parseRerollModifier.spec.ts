import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseRerollModifier", () => {
        it("can correctly parse a reroll modifier (r).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "r")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseRerollModifier();
            expect(mod.type).toBe(NodeType.Reroll);
            expect(mod.getAttribute("once")).toBe("no");
        });
        it("can correctly parse a drop modifier (ro).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "ro")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseRerollModifier();
            expect(mod.type).toBe(NodeType.Reroll);
            expect(mod.getAttribute("once")).toBe("yes");
        });
        it("can correctly parse a drop modifier (ro<3).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "ro"),
                new Token(TokenType.Less, 2, "<"),
                new Token(TokenType.Integer, 3, "3")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseRerollModifier();
            expect(mod.type).toBe(NodeType.Reroll);
            expect(mod.getAttribute("once")).toBe("yes");
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Less);
        });
    });
});
