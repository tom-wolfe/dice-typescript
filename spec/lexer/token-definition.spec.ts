import * as Lexer from "../../src/lexer";

describe("TokenDefinition", () => {
    describe("constructor", () => {
        it("does not throw.", function () {
            expect(() => {
                const def = new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(/g, 1);
            }).not.toThrow();
        });
        it("enforces a global RegExp.", function () {
            expect(() => {
                const def = new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(/, 1);
            }).toThrow(new Lexer.NonGlobalDefinitionError());
        });
        it("returns empty array on empty input.", function () {
            const def = new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(/g, 1);
            expect(def.matches("")).toEqual([]);
        });
        it("returns empty array on null input.", function () {
            const def = new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(/g, 1);
            expect(def.matches(null)).toEqual([]);
        });
        it("finds appropriate matches.", function () {
            const def = new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(/g, 1);
            const expression = "this(doesn't(do(anything)))";
            const matches = def.matches(expression);
            expect(matches.length).toBe(3);
            expect(matches[0]).toEqual(new Lexer.TokenMatch(4, Lexer.TokenType.ParenthesisOpen, "(", 1));
            expect(matches[1]).toEqual(new Lexer.TokenMatch(12, Lexer.TokenType.ParenthesisOpen, "(", 1));
            expect(matches[2]).toEqual(new Lexer.TokenMatch(15, Lexer.TokenType.ParenthesisOpen, "(", 1));
        });
        it("does not loop infinitely.", function () {
            const def = new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(\(\(/g, 1);
            const expression = "(((((((";
            const matches = def.matches(expression);
            expect(true).toBe(true);
        });
    });
});
