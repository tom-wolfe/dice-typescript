import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("parseSortModifier", () => {
        it("can correctly parse a sort modifier (s).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "s")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseSortModifier();
            expect(mod.type).toBe(NodeType.Sort);
            expect(mod.getAttribute("direction")).toBe("ascending");
        });
        it("can correctly parse a sort modifier (sa).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "sa")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseSortModifier();
            expect(mod.type).toBe(NodeType.Sort);
            expect(mod.getAttribute("direction")).toBe("ascending");
        });
        it("can correctly parse a sort modifier (sd).", () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, "sd")
            ]);
            const parser = new Parser.DiceParser(lexer);
            const mod = parser.parseSortModifier();
            expect(mod.type).toBe(NodeType.Sort);
            expect(mod.getAttribute("direction")).toBe("descending");
        });
    });
});
