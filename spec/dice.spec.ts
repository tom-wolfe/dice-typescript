import { Dice } from '../src';
import { MockListRandomProvider } from './helpers';

describe('Dice', () => {
  describe('constructor', () => {
    it('should not throw', function () {
      expect(() => {
        const dice = new Dice();
      }).not.toThrow();
    });
  });
  describe('roll', () => {
    it('returns a number from random', function () {
      const dice = new Dice();
      const result = dice.roll('1d20').total;
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(20);
    });
    it('succeeds on a complex expression', function () {
      const dice = new Dice();
      expect(() => dice.roll('floor((2d4)d20 / 3) + 6')).not.toThrow();
    });
    it('correctly handles operator precedence regardless of order (10 * 5 + 2) and (2 + 10 * 5)', () => {
      const dice = new Dice();

      const mult1st = dice.roll('10 * 5 + 2');
      const mult2nd = dice.roll('2 + 10 * 5');

      expect(mult1st.total).toBe(52);
      expect(mult2nd.total).toBe(52);
    });
    it('correctly factors brackets in operator precedence (10 * (5 + 2))', () => {
      const dice = new Dice();
      const exp = dice.roll('10 * (5 + 2)');
      expect(exp.total).toBe(70);
    });
    it('correctly handles keep lowest (2d10kl)', () => {
      const mock = new MockListRandomProvider([5, 4]);
      const dice = new Dice(null, mock);
      const exp = dice.roll('2d10kl');
      expect(exp.total).toBe(4);
    });
  });
});
