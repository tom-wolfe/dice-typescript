import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result.class';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
    describe('parseKeep', () => {
        it('can correctly parse a keep modifier (k).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'k')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseKeep(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Keep);
            expect(mod.getAttribute('type')).toBe('highest');
        });
        it('can correctly parse a keep modifier (kh).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'kh')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseKeep(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Keep);
            expect(mod.getAttribute('type')).toBe('highest');
        });
        it('can correctly parse a keep modifier (kl).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'kl')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseKeep(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Keep);
            expect(mod.getAttribute('type')).toBe('lowest');
        });
        it('can correctly parse a keep modifier with simple number (kl3).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'kl'),
                new Token(TokenType.Number, 2, '3')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseKeep(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Keep);
            expect(mod.getAttribute('type')).toBe('lowest');
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Number);
            expect(mod.getChild(0).getAttribute('value')).toBe(3);
        });
        it('can correctly parse a keep modifier with simple number (kl(5+3)).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'kl'),
                new Token(TokenType.ParenthesisOpen, 2, '('),
                new Token(TokenType.Number, 3, '5'),
                new Token(TokenType.Plus, 4, '+'),
                new Token(TokenType.Number, 5, '3'),
                new Token(TokenType.ParenthesisClose, 6, ')')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseKeep(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Keep);
            expect(mod.getAttribute('type')).toBe('lowest');
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Add);
        });
        it('throws an error on unknown keep type (kg3).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'kg'),
                new Token(TokenType.Number, 2, '3')
            ]);
            const parser = new Parser.DiceParser(lexer);

            const result = new ParseResult();
            const mod = parser.parseKeep(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
