import * as Parser from "../../src/parser";

describe("Parser", () => {
    describe("constructor", () => {
        it("does not throw.", function () {
            expect(() => {
                const lexer = new Parser.Parser();
            }).not.toThrow();
        });
    });
    describe("parse", () => {
        // TODO: Write tests.
    });
});
