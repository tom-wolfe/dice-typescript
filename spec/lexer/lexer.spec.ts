import * as Lexer from "../../src/lexer";
import { MockLexer } from "../helpers/mock-lexer";

describe("Lexer", () => {
    const input = "floor(4d6!!+5d10kl2/2+4)"
    describe("constructor", () => {
        it("does not throw.", function () {
            expect(() => {
                const lexer = new Lexer.Lexer(input);
            }).not.toThrow();
        });
    });
    describe("currentCharacter", () => {
        it("starts as null", () => {
            const lexer = new MockLexer("face");
            expect(lexer.currentCharacterPub).toEqual(null);
        });
        it("returns the current character", () => {
            const lexer = new MockLexer("face");
            lexer.getNextCharacter();
            expect(lexer.currentCharacterPub).toEqual("f");
            expect(lexer.currentCharacterPub).toEqual("f");
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            expect(lexer.currentCharacterPub).toEqual("c");
        });
        it("returns null at the end.", () => {
            const lexer = new MockLexer("face");
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            expect(lexer.currentCharacterPub).toBeNull();
        });
    });
    describe("getNextCharacter", () => {
        it("progresses through the characters, finishing with null.", () => {
            const lexer = new MockLexer(input);
            expect(lexer.getNextCharacter()).toEqual("f");
            expect(lexer.getNextCharacter()).toEqual("l");
            expect(lexer.getNextCharacter()).toEqual("o");
            expect(lexer.getNextCharacter()).toEqual("o");
            expect(lexer.getNextCharacter()).toEqual("r");
            expect(lexer.getNextCharacter()).toEqual("(");
            expect(lexer.getNextCharacter()).toEqual("4");
            expect(lexer.getNextCharacter()).toEqual("d");
            expect(lexer.getNextCharacter()).toEqual("6");
            expect(lexer.getNextCharacter()).toEqual("!");
            expect(lexer.getNextCharacter()).toEqual("!");
            expect(lexer.getNextCharacter()).toEqual("+");
            expect(lexer.getNextCharacter()).toEqual("5");
            expect(lexer.getNextCharacter()).toEqual("d");
            expect(lexer.getNextCharacter()).toEqual("1");
            expect(lexer.getNextCharacter()).toEqual("0");
            expect(lexer.getNextCharacter()).toEqual("k");
            expect(lexer.getNextCharacter()).toEqual("l");
            expect(lexer.getNextCharacter()).toEqual("2");
            expect(lexer.getNextCharacter()).toEqual("/");
            expect(lexer.getNextCharacter()).toEqual("2");
            expect(lexer.getNextCharacter()).toEqual("+");
            expect(lexer.getNextCharacter()).toEqual("4");
            expect(lexer.getNextCharacter()).toEqual(")");
            expect(lexer.getNextCharacter()).toBeNull();
        });
        it("returns null when stream ends.", () => {
            const lexer = new MockLexer("abc");
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            for (let x = 0; x < 10; x++) {
                expect(lexer.getNextCharacter()).toBeNull();
            }
        });
    });
    describe("peekNextCharacter", () => {
        it("gives next character without cycling through.", () => {
            const lexer = new MockLexer(input);
            lexer.getNextCharacter();
            expect(lexer.peekNextCharacter()).toEqual("l");
            expect(lexer.peekNextCharacter()).toEqual("l");
            lexer.getNextCharacter();
            expect(lexer.peekNextCharacter()).toEqual("o");
            lexer.getNextCharacter();
            lexer.getNextCharacter();
            expect(lexer.peekNextCharacter()).toEqual("r");
        });
    });
    describe("tokenize", () => {
        it("last token is a terminator", () => {
            const lexer = new Lexer.Lexer("");
            const token = lexer.getNextToken();
            expect(token).toEqual(new Lexer.Token(Lexer.TokenType.Terminator));
        });
        it("returns correct tokens (simple)", () => {
            const inputSimple = "floor(4d6!!)";
            const lexer = new Lexer.Lexer(inputSimple);
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "floor"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, "("));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "6"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpPenetrate, "!!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, ")"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator));
        });
        it("returns correct tokens (complex)", () => {
            const lexer = new Lexer.Lexer(input);
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "floor"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, "("));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "6"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpPenetrate, "!!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpAdd, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "5"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "kl"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpDivide, "/"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpAdd, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, ")"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator));
        });
        it("interprets remaining operators correctly", () => {
            const lexer = new Lexer.Lexer("2d10 % 8 - 2 * 3 ** 1d4 > 1 < 2 <= 2 >= 2d3!! = 3");
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpModulo, "%"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "8"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpSubtract, "-"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpMultiply, "*"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpExponent, "**"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "1"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpGreater, ">"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "1"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpLess, "<"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpLessOrEq, "<="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpGreaterOrEq, ">="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpPenetrate, "!!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpEq, "="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator));
        });
        it("throws on unrecognized tokens", () => {
            const lexer = new Lexer.Lexer("test_face");
            lexer.getNextToken();
            expect(() => { lexer.getNextToken() }).toThrow();
        });
    });
});
