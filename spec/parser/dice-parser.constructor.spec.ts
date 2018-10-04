import * as Parser from '../../src/parser';

describe('DiceParser', () => {
  describe('constructor', () => {
    it('does not throw.', () => {
      expect(() => {
        const parser = new Parser.DiceParser('');
      }).not.toThrow();
    });
    it('throws for invalid input.', () => {
      expect(() => {
        const parser = new Parser.DiceParser(6 as any);
      }).toThrow();
    });
  });
});
