import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result.class';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
    describe('constructor', () => {
        it('does not throw.', () => {
            expect(() => {
                const parser = new Parser.DiceParser('');
            }).not.toThrow();
        });
    });
    describe('parseNumber', () => {
        it('can correctly parse an integer', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '12')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const node = parser.parseNumber(result);
            expect(result.errors.length).toBe(0);
            expect(node.type).toBe(NodeType.Number);
            expect(node.getAttribute('value')).toBe(12);
        });
        it('can correctly parse a real number', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '12.56')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const node = parser.parseNumber(result);
            expect(result.errors.length).toBe(0);
            expect(node.type).toBe(NodeType.Number);
            expect(node.getAttribute('value')).toBe(12.56);
        });
    });
});
