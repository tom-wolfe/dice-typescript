import { NodeType } from '../../src/ast/node-type.enum';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result.class';
import { MockLexer } from '../helpers';

describe('DiceParser', () => {
    describe('parseExpression', () => {
        it('can correctly identify a boolean operator', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '10'),
                new Token(TokenType.Greater, 2, '>'),
                new Token(TokenType.Number, 3, '5'),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Greater);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute('value')).toBe(10);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).getAttribute('value')).toBe(5);
        });
        it('correctly handles operator precedence (10 * 5 + 2)', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '10'),
                new Token(TokenType.Asterisk, 2, '*'),
                new Token(TokenType.Number, 3, '5'),
                new Token(TokenType.Plus, 4, '+'),
                new Token(TokenType.Number, 5, '2'),
            ]);
            const parser = new Parser.DiceParser(lexer);
            const result = new ParseResult();
            const exp = parser.parseExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Multiply);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).getAttribute('value')).toBe(2);
        });
    });
});
