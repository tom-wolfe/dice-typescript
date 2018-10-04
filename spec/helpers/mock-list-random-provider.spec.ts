import { MockListRandomProvider } from './mock-list-random-provider.class';

describe('MockListRandomProvider', () => {
  describe('constructor', () => {
    it('should not throw', function () {
      expect(() => {
        const random = new MockListRandomProvider();
      }).not.toThrow();
    });
  });
  describe('numberBetween', () => {
    it('returns numbers in order.', function () {
      const random = new MockListRandomProvider();
      random.numbers.push(1, 2, 3, 4, 5);
      expect(random.numberBetween(-100, 100)).toEqual(1);
      expect(random.numberBetween(-100, 100)).toEqual(2);
      expect(random.numberBetween(-100, 100)).toEqual(3);
      expect(random.numberBetween(-100, 100)).toEqual(4);
      expect(random.numberBetween(-100, 100)).toEqual(5);
    });
    it('throws if too many numbers are requested.', function () {
      const random = new MockListRandomProvider();
      random.numbers.push(1, 2, 3);
      expect(random.numberBetween(-100, 100)).toEqual(1);
      expect(random.numberBetween(-100, 100)).toEqual(2);
      expect(random.numberBetween(-100, 100)).toEqual(3);
      expect(() => { random.numberBetween(-100, 100); }).toThrow();
    });
  });
});
