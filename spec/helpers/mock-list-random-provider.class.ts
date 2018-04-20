import { RandomProvider } from '../../src/random';

export class MockListRandomProvider implements RandomProvider {
    private index = -1;

    public readonly numbers: number[];

    constructor(numbers?: number[]) {
        this.numbers = numbers || [];
    }

    numberBetween(min: number, max: number) {
        this.index++;
        if (this.index >= this.numbers.length) {
            throw new Error('Requested too many random numbers!');
        }
        return this.numbers[this.index];
    }
}
