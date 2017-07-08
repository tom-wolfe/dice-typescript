import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("DiceParser", () => {
    describe("constructor", () => {
        it("does not throw.", () => {
            expect(() => {
                const parser = new Parser.DiceParser("");
            }).not.toThrow();
        });
        it("throws for invalid input.", () => {
            expect(() => {
                const parser = new Parser.DiceParser(6 as any);
            }).toThrow();
        });
    });
});
