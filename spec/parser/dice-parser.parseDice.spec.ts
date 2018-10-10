import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result.class';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
  describe('parseDice', () => {
    it('can correctly parse a simple dice roll without roll times.', () => {
      const lexer = new MockLexer([
          new Token(TokenType.Identifier, 0, 'd'),
          new Token(TokenType.Number, 1, '6')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const dice = parser.parseDice(result);
      expect(result.errors.length).toBe(0);

      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);
      expect(dice.getChild(0).type).toBe(NodeType.Number);
      expect(dice.getChild(0).getAttribute('value')).toBe(1);
      expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
      expect(dice.getChild(1).getAttribute('value')).toBe(6);
    });
    it('can correctly parse a simple fate dice roll without roll times.', () => {
      const lexer = new MockLexer([
          new Token(TokenType.Identifier, 0, 'dF'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const dice = parser.parseDice(result);
      expect(result.errors.length).toBe(0);

      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);
      expect(dice.getChild(0).type).toBe(NodeType.Number);
      expect(dice.getChild(0).getAttribute('value')).toBe(1);
      expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
      expect(dice.getChild(1).getAttribute('value')).toBe('fate');
    });
    it('can correctly parse a simple dice roll with pre-parsed number.', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.Identifier, 2, 'd'),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const num = parser.parseNumber(result);
      const dice = parser.parseDice(result, num);
      expect(result.errors.length).toBe(0);

      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);
      expect(dice.getChild(0).type).toBe(NodeType.Number);
      expect(dice.getChild(0).getAttribute('value')).toBe(10);
      expect(dice.getChild(1).type).toBe(NodeType.DiceSides);
      expect(dice.getChild(1).getAttribute('value')).toBe(6);
    });
    it('can correctly parse a simple dice roll with modifier (10d6dl3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.Identifier, 2, 'd'),
        new Token(TokenType.Number, 3, '6'),
        new Token(TokenType.Identifier, 4, 'dl'),
        new Token(TokenType.Number, 5, '3'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const dice = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(dice.type).toBe(NodeType.Drop);
      expect(dice.getAttribute('type')).toBe('lowest');
      expect(dice.getChildCount()).toBe(2);
      expect(dice.getChild(0).type).toBe(NodeType.Dice);
      expect(dice.getChild(1).type).toBe(NodeType.Number);
    });
    it('can correctly parse a dice roll with a explode modifier (4d6!p>3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Exclamation, 3, '!'),
        new Token(TokenType.Identifier, 4, 'p'),
        new Token(TokenType.Greater, 5, '>'),
        new Token(TokenType.Number, 6, '3'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const exp = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(exp.type).toBe(NodeType.Explode);
      expect(exp.getAttribute('compound')).toBe(false);
      expect(exp.getAttribute('penetrate')).toBe(true);
      expect(exp.getChildCount()).toBe(2);

      const dice = exp.getChild(0);
      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);

      const greater = exp.getChild(1);
      expect(greater.type).toBe(NodeType.Greater);
      expect(greater.getChildCount()).toBe(1);
    });
    it('can correctly parse a dice roll with a critical modifier (4d6cs).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Identifier, 3, 'cs')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const exp = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(exp.type).toBe(NodeType.Critical);
      expect(exp.getAttribute('type')).toBe('success');
      expect(exp.getChildCount()).toBe(1);

      const dice = exp.getChild(0);
      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);
    });
    it('can correctly parse a dice roll with a simple keep modifier (4d6kl).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Identifier, 3, 'kl')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const exp = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(exp.type).toBe(NodeType.Keep);
      expect(exp.getAttribute('type')).toBe('lowest');
      expect(exp.getChildCount()).toBe(2);

      const dice = exp.getChild(0);
      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);

      const low = exp.getChild(1);
      expect(low.type).toBe(NodeType.Number);
      expect(low.getAttribute('value')).toBe(1);
    });
    it('can correctly parse a dice roll with a numbered keep modifier (4d6kl3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Identifier, 3, 'kl'),
        new Token(TokenType.Number, 5, '3')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const exp = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(exp.type).toBe(NodeType.Keep);
      expect(exp.getAttribute('type')).toBe('lowest');
      expect(exp.getChildCount()).toBe(2);

      const dice = exp.getChild(0);
      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);

      const low = exp.getChild(1);
      expect(low.type).toBe(NodeType.Number);
      expect(low.getAttribute('value')).toBe(3);
    });
    it('can correctly parse a dice roll with a reroll modifier (4d6ro>3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Identifier, 3, 'ro'),
        new Token(TokenType.Greater, 5, '>'),
        new Token(TokenType.Number, 6, '3')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const exp = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(exp.type).toBe(NodeType.Reroll);
      expect(exp.getAttribute('once')).toBe(true);
      expect(exp.getChildCount()).toBe(2);

      const dice = exp.getChild(0);
      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);

      const greater = exp.getChild(1);
      expect(greater.type).toBe(NodeType.Greater);
      expect(greater.getChildCount()).toBe(1);
    });
    it('can correctly parse a dice roll with a sort modifier (4d6sa).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Identifier, 3, 'sa'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const exp = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(exp.type).toBe(NodeType.Sort);
      expect(exp.getAttribute('direction')).toBe('ascending');
      expect(exp.getChildCount()).toBe(1);

      const dice = exp.getChild(0);
      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);
    });
    it('can correctly parse a compare modifier (4d6>3.', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Greater, 3, '>'),
        new Token(TokenType.Number, 4, '3'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const exp = parser.parseDice(result);
      expect(result.errors.length).toBe(0);
      expect(exp.type).toBe(NodeType.Greater);
      expect(exp.getChildCount()).toBe(2);

      const dice = exp.getChild(0);
      expect(dice.type).toBe(NodeType.Dice);
      expect(dice.getChildCount()).toBe(2);

      const num = exp.getChild(1);
      expect(num.type).toBe(NodeType.Number);
      expect(num.getAttribute('value')).toBe(3);
    });
    it('throws exception on unrecognized modifier (4d6x).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Identifier, 1, 'd'),
        new Token(TokenType.Number, 2, '6'),
        new Token(TokenType.Identifier, 3, 'x'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const mod = parser.parseDice(result);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
