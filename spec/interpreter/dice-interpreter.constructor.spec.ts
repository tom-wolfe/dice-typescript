import * as Interpreter from "../../src/interpreter";

describe("DiceInterpreter", () => {
    describe("constructor", () => {
        it("does not throw.", () => {
            expect(() => {
                const interpreter = new Interpreter.DiceInterpreter();
            }).not.toThrow();
        });
    });
});
