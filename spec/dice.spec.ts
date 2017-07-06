import { Dice } from "../src";

describe("Dice", () => {
    describe("constructor", () => {
        it("should not throw", function () {
            expect(() => {
                const d = new Dice();
            }).not.toThrow();
        });
    });
});
