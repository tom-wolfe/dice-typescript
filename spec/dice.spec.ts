import { Dice } from "../src";
import { MockRandomProvider } from "./helpers/mock-random-provider";

describe("Dice", () => {
    describe("constructor", () => {
        it("should not throw", function () {
            expect(() => {
                const dice = new Dice();
            }).not.toThrow();
        });
    });
    describe("roll", () => {
        it("returns a number", function () {
            const dice = new Dice();
            expect(dice.roll("1d20")).toEqual(jasmine.any(Number));
        });
        it("returns a number from random", function () {
            const provider = new MockRandomProvider(57);
            const dice = new Dice(provider);
            expect(dice.roll("1d20")).toEqual(57);
        });
        // it("returns a number in the right range", function () {
        //     const dice = new Dice();
        //     const result = dice.roll("5d20");
        //     expect(result).toBeGreaterThanOrEqual(5);
        //     expect(result).toBeLessThanOrEqual(100);
        // });
    });
});
