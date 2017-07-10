import { RandomProvider } from "../../src";
import { Token } from "../../src/lexer";
import { TokenType } from "../../src/lexer/token-type";

export class MockListRandomProvider implements RandomProvider {
    private index = -1;

    public readonly numbers: number[]

    constructor(numbers?: number[]) {
        this.numbers = numbers || [];
    }

    numberBetween(min: number, max: number) {
        return this.numbers[++this.index];
    }
}
