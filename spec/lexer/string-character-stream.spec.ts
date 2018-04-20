import * as Lexer from '../../src/lexer';

describe('StringCharacterStream', () => {
    const input = 'floor(4d6!!+5d10kl2/2+4)';
    describe('constructor', () => {
        it('does not throw.', function () {
            expect(() => {
                const stream = new Lexer.StringCharacterStream(input);
            }).not.toThrow();
        });
    });
    describe('currentCharacter', () => {
        it('starts as null', () => {
            const stream = new Lexer.StringCharacterStream('face');
            expect(stream.getCurrentCharacter()).toEqual(null);
        });
        it('returns the current character', () => {
            const stream = new Lexer.StringCharacterStream('face');
            stream.getNextCharacter();
            expect(stream.getCurrentCharacter()).toEqual('f');
            expect(stream.getCurrentCharacter()).toEqual('f');
            stream.getNextCharacter();
            stream.getNextCharacter();
            expect(stream.getCurrentCharacter()).toEqual('c');
        });
        it('returns null at the end.', () => {
            const stream = new Lexer.StringCharacterStream('face');
            stream.getNextCharacter();
            stream.getNextCharacter();
            stream.getNextCharacter();
            stream.getNextCharacter();
            stream.getNextCharacter();
            expect(stream.getCurrentCharacter()).toBeNull();
        });
    });
    describe('getNextCharacter', () => {
        it('progresses through the characters, finishing with null.', () => {
            const stream = new Lexer.StringCharacterStream(input);
            expect(stream.getNextCharacter()).toEqual('f');
            expect(stream.getNextCharacter()).toEqual('l');
            expect(stream.getNextCharacter()).toEqual('o');
            expect(stream.getNextCharacter()).toEqual('o');
            expect(stream.getNextCharacter()).toEqual('r');
            expect(stream.getNextCharacter()).toEqual('(');
            expect(stream.getNextCharacter()).toEqual('4');
            expect(stream.getNextCharacter()).toEqual('d');
            expect(stream.getNextCharacter()).toEqual('6');
            expect(stream.getNextCharacter()).toEqual('!');
            expect(stream.getNextCharacter()).toEqual('!');
            expect(stream.getNextCharacter()).toEqual('+');
            expect(stream.getNextCharacter()).toEqual('5');
            expect(stream.getNextCharacter()).toEqual('d');
            expect(stream.getNextCharacter()).toEqual('1');
            expect(stream.getNextCharacter()).toEqual('0');
            expect(stream.getNextCharacter()).toEqual('k');
            expect(stream.getNextCharacter()).toEqual('l');
            expect(stream.getNextCharacter()).toEqual('2');
            expect(stream.getNextCharacter()).toEqual('/');
            expect(stream.getNextCharacter()).toEqual('2');
            expect(stream.getNextCharacter()).toEqual('+');
            expect(stream.getNextCharacter()).toEqual('4');
            expect(stream.getNextCharacter()).toEqual(')');
            expect(stream.getNextCharacter()).toBeNull();
        });
        it('returns null when stream ends.', () => {
            const stream = new Lexer.StringCharacterStream('abc');
            stream.getNextCharacter();
            stream.getNextCharacter();
            stream.getNextCharacter();
            for (let x = 0; x < 10; x++) {
                expect(stream.getNextCharacter()).toBeNull();
            }
        });
    });
    describe('peekNextCharacter', () => {
        it('gives next character without cycling through.', () => {
            const stream = new Lexer.StringCharacterStream(input);
            stream.getNextCharacter();
            expect(stream.peekNextCharacter()).toEqual('l');
            expect(stream.peekNextCharacter()).toEqual('l');
            stream.getNextCharacter();
            expect(stream.peekNextCharacter()).toEqual('o');
            stream.getNextCharacter();
            stream.getNextCharacter();
            expect(stream.peekNextCharacter()).toEqual('r');
        });
    });
});
