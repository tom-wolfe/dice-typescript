import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result.class';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
    describe('parseDrop', () => {
        it('can correctly parse a drop modifier (d).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'd')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseDrop(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute('type')).toBe('lowest');
        });
        it('can correctly parse a drop modifier (dh).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'dh')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseDrop(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute('type')).toBe('highest');
        });
        it('can correctly parse a drop modifier (dl).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'dl')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseDrop(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute('type')).toBe('lowest');
        });
        it('can correctly parse a drop modifier with simple number (dl3).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'dl'),
                new Token(TokenType.Number, 2, '3')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseDrop(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute('type')).toBe('lowest');
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Number);
            expect(mod.getChild(0).getAttribute('value')).toBe(3);
        });
        it('can correctly parse a drop modifier with simple number (dl(5+3)).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'dl'),
                new Token(TokenType.ParenthesisOpen, 2, '('),
                new Token(TokenType.Number, 3, '5'),
                new Token(TokenType.Plus, 4, '+'),
                new Token(TokenType.Number, 5, '3'),
                new Token(TokenType.ParenthesisClose, 6, ')')
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const mod = parser.parseDrop(result);
            expect(result.errors.length).toBe(0);
            expect(mod.type).toBe(NodeType.Drop);
            expect(mod.getAttribute('type')).toBe('lowest');
            expect(mod.getChildCount()).toBe(1);
            expect(mod.getChild(0).type).toBe(NodeType.Add);
        });
        it('throws an error on unknown keep type (dg3).', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'dg'),
                new Token(TokenType.Number, 2, '3')
            ]);
            const parser = new Parser.DiceParser(lexer);

            const result = new ParseResult();
            const mod = parser.parseDrop(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
