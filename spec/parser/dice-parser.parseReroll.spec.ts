import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result.class';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
  describe('parseReroll', () => {
    it('can correctly parse a reroll modifier (r).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'r')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const mod = parser.parseReroll(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Reroll);
      expect(mod.getAttribute('once')).toBe(false);
    });
    it('can correctly parse a drop modifier (ro).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'ro')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const mod = parser.parseReroll(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Reroll);
      expect(mod.getAttribute('once')).toBe(true);
    });
    it('can correctly parse a drop modifier (ro<3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'ro'),
        new Token(TokenType.Less, 2, '<'),
        new Token(TokenType.Number, 3, '3')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new ParseResult();
      const mod = parser.parseReroll(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Reroll);
      expect(mod.getAttribute('once')).toBe(true);
      expect(mod.getChildCount()).toBe(1);
      expect(mod.getChild(0).type).toBe(NodeType.Less);
    });
    it('throws an error on unknown drop type (dx<3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'dx'),
        new Token(TokenType.Less, 2, '<'),
        new Token(TokenType.Number, 3, '3')
      ]);
      const parser = new Parser.DiceParser(lexer);

      const result = new ParseResult();
      const mod = parser.parseReroll(result);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
