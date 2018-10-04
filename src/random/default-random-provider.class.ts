import * as Random from 'random-js';

import { RandomProvider } from './random-provider.class';

export class DefaultRandomProvider implements RandomProvider {

  private random: Random;

  constructor() {
    this.random = new Random(Random.engines.mt19937().autoSeed());
  }

  numberBetween(min: number, max: number) {
    return this.random.integer(min, max);
  }
}
