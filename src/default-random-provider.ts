import { RandomProvider } from "./random-provider";

export class DefaultRandomProvider implements RandomProvider {
    constructor() { }

    numberBetween(min: number, max: number) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
