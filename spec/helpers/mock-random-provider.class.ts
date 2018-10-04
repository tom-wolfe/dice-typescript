import { RandomProvider } from '../../src/random';

export class MockRandomProvider implements RandomProvider {
  constructor(private number: number) { }

  numberBetween(min: number, max: number) {
    return this.number;
  }
}
