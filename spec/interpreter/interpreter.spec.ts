import * as Interpreter from "../../src/interpreter";

describe("Interpreter", () => {
    describe("constructor", () => {
        it("does not throw.", () => {
            expect(() => {
                const interpreter = new Interpreter.Interpreter();
            }).not.toThrow();
        });
    });
    describe("interpret", () => {
        it("returns null.", () => {
            const interpreter = new Interpreter.Interpreter();
            expect(() => interpreter.interpret(null)).toBeNull();
        });
    });
});
