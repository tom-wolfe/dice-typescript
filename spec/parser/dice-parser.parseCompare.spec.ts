import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
  describe('parseCompareModifier', () => {
    it('can correctly parse a compare modifier (>3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Greater, 0, '>'),
        new Token(TokenType.Number, 1, '3'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new Parser.ParseResult();
      const mod = parser.parseCompareModifier(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Greater);
      expect(mod.getChildCount()).toBe(1);
      expect(mod.getChild(0).getAttribute('value')).toBe(3);
    });
    it('can correctly parse a compare modifier (3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '3'),
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new Parser.ParseResult();
      const mod = parser.parseCompareModifier(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Equal);
      expect(mod.getChildCount()).toBe(1);
    });
    it('throws an error on unexpected token (sx).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'sx')
      ]);
      const parser = new Parser.DiceParser(lexer);
      expect(() => {
        const result = new Parser.ParseResult();
        const mod = parser.parseCompareModifier(result);
        expect(result.errors.length).toBeGreaterThanOrEqual(1);
      }).toThrow();
    });
  });
});
