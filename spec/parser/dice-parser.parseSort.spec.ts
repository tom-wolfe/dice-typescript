import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result.class';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
    describe('parseSort', () => {
        it('can correctly parse a sort modifier (s).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 's')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseSort(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Sort);
            expect(mod.getAttribute('direction')).toBe('ascending');
        });
        it('can correctly parse a sort modifier (sa).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'sa')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseSort(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Sort);
            expect(mod.getAttribute('direction')).toBe('ascending');
        });
        it('can correctly parse a sort modifier (sd).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'sd')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseSort(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Sort);
            expect(mod.getAttribute('direction')).toBe('descending');
        });
        it('throws an error on unknown sort type (sx).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'sx')
            ]);
            const parser = new Parser.DiceParser(lexer);

            const result = new ParseResult();
            const mod = parser.parseSort(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
