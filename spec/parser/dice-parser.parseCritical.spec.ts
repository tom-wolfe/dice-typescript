import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
  describe('parseCritical', () => {
    it('can correctly parse a critical modifier (c).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'c')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new Parser.ParseResult();
      const mod = parser.parseCritical(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Critical);
      expect(mod.getAttribute('type')).toBe('success');
    });
    it('can correctly parse a critical modifier (cs).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'cs')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new Parser.ParseResult();
      const mod = parser.parseCritical(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Critical);
      expect(mod.getAttribute('type')).toBe('success');
    });
    it('can correctly parse a critical modifier (cf).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'cf')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new Parser.ParseResult();
      const mod = parser.parseCritical(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Critical);
      expect(mod.getAttribute('type')).toBe('failure');
    });
    it('can correctly parse a critical modifier with a compare point (cf<3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'cf'),
        new Token(TokenType.Less, 2, '<'),
        new Token(TokenType.Number, 3, '3')
      ]);
      const parser = new Parser.DiceParser(lexer);
      const result = new Parser.ParseResult();
      const mod = parser.parseCritical(result);
      expect(result.errors.length).toBe(0);
      expect(mod.type).toBe(NodeType.Critical);
      expect(mod.getAttribute('type')).toBe('failure');
      expect(mod.getChildCount()).toBe(1);
      expect(mod.getChild(0).type).toBe(NodeType.Less);
    });
    it('throws an error on an unrecognized critical type (cz<3).', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'cz'),
        new Token(TokenType.Less, 2, '<'),
        new Token(TokenType.Number, 3, '3')
      ]);
      const parser = new Parser.DiceParser(lexer);

      const result = new Parser.ParseResult();
      const mod = parser.parseCritical(result);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
