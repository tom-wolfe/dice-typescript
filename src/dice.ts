import { DefaultRandomProvider } from "./default-random-provider";
import { RandomProvider } from "./random-provider";

export class Dice {
    private random: RandomProvider;
    constructor(random: RandomProvider = new DefaultRandomProvider()) {
        this.random = random;
    }
    roll(expression: string): number {
        return this.random.numberBetween(1, 20);
    }
};
