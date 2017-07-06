import * as Lexer from "../../src/lexer";

describe("Lexer", () => {
    describe("constructor", () => {
        it("should not throw", function () {
            expect(() => {
                const lexer = new Lexer.Lexer();
            }).not.toThrow();
        });
    });
     describe("tokenize", () => {
        // TODO: Start here.
    });
});
