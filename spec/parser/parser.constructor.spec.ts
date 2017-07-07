import { NodeType } from "../../src/ast/node-type";
import { Token, TokenType } from "../../src/lexer";
import * as Parser from "../../src/parser";
import { MockLexer } from "../helpers/mock-lexer";

describe("Parser", () => {
    describe("constructor", () => {
        it("does not throw.", () => {
            expect(() => {
                const parser = new Parser.Parser("");
            }).not.toThrow();
        });
        it("throws for invalid input.", () => {
            expect(() => {
                const parser = new Parser.Parser(6 as any);
            }).toThrow();
        });
    });
});
