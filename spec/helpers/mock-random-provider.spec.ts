import { MockRandomProvider } from "./mock-random-provider";

describe("MockRandomProvider", () => {
    describe("constructor", () => {
        it("should not throw", function () {
            expect(() => {
                const random = new MockRandomProvider(4);
            }).not.toThrow();
        });
    });
    describe("numberBetween", () => {
        it("returns number passed into the constructor (hard-coded).", function () {
            const random = new MockRandomProvider(4);
            expect(random.numberBetween(-100, 100)).toEqual(4);
        });
        it("returns number passed into the constructor (random).", function () {
            const number = Math.random() * 100;
            const random = new MockRandomProvider(number);
            expect(random.numberBetween(-100, 100)).toEqual(number);
        });
    });
});
