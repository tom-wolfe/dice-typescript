import * as Interpreter from "../../src/interpreter";

describe("Interpreter", () => {
    describe("constructor", () => {
        it("does not throw.", function () {
            expect(() => {
                const interpreter = new Interpreter.Interpreter();
            }).not.toThrow();
        });
    });
    describe("interpret", () => {
        // TODO: Write tests.
    });
});
