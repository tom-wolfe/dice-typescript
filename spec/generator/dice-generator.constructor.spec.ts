import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
  describe('constructor', () => {
    it('does not throw.', () => {
      expect(() => {
        const generator = new Generator.DiceGenerator();
      }).not.toThrow();
    });
  });
});
