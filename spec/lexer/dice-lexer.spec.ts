import * as Lexer from "../../src/lexer";
import { StringCharacterStream } from "../../src/lexer/string-character-stream";

describe("DiceLexer", () => {
    const input = "floor(4d6!!+5d10kl2/2+4)"
    describe("constructor", () => {
        it("does not throw for string input.", function () {
            expect(() => {
                const lexer = new Lexer.DiceLexer(input);
            }).not.toThrow();
        });
        it("does not throw for stream input.", function () {
            expect(() => {
                const lexer = new Lexer.DiceLexer(new StringCharacterStream(input));
            }).not.toThrow();
        });
        it("throws for invalid input.", function () {
            expect(() => {
                const lexer = new Lexer.DiceLexer(6 as any);
            }).toThrow();
        });
    });
    describe("getNextToken", () => {
        it("last token is a terminator", () => {
            const lexer = new Lexer.DiceLexer("");
            const token = lexer.getNextToken();
            expect(token).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 0));
        });
        it("returns correct tokens (simple)", () => {
            const inputSimple = "floor(4d6!!)";
            const lexer = new Lexer.DiceLexer(inputSimple);
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, "floor"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, "("));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 6, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 7, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 8, "6"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpPenetrate, 9, "!!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 11, ")"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 12));
        });
        it("returns correct tokens (complex)", () => {
            const lexer = new Lexer.DiceLexer(input); // floor(4d6!!+5d10kl2/2+4)
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, "floor"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, "("));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 6, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 7, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 8, "6"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpPenetrate, 9, "!!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpAdd, 11, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 12, "5"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 13, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 14, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 16, "kl"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 18, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpDivide, 19, "/"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 20, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpAdd, 21, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 22, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 23, ")"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 24));
        });
        it("interprets remaining operators correctly", () => {
            const lexer = new Lexer.DiceLexer("2d10%8-2*3**1d4!>1<2<=2>=2d3!!=3+{4,5}");
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 0, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 1, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 2, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpModulo, 4, "%"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 5, "8"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpSubtract, 6, "-"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 7, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpMultiply, 8, "*"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 9, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpExponent, 10, "**"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 12, "1"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 13, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 14, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpExplode, 15, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpGreater, 16, ">"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 17, "1"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpLess, 18, "<"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 19, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpLessOrEq, 20, "<="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 22, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpGreaterOrEq, 23, ">="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 25, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 26, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 27, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpPenetrate, 28, "!!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BoolOpEq, 30, "="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 31, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpAdd, 32, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceOpen, 33, "{"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 34, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Comma, 35, ","));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 36, "5"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceClose, 37, "}"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 38));
        });
        it("throws on unrecognized tokens", () => {
            const lexer = new Lexer.DiceLexer("test_face");
            lexer.getNextToken();
            expect(() => { lexer.getNextToken() }).toThrow();
        });
        it("skips over whitespace.", () => {
            const lexer = new Lexer.DiceLexer("2  d\t10 \t + \t\t 3");
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 0, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 3, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 5, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpAdd, 10, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 15, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 16));
        });
    });
    describe("peekNextToken", () => {
        it("gives next token without cycling through.", () => {
            const lexer = new Lexer.DiceLexer(input);
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, "("));
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, "("));
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 6, "4"));
            lexer.getNextToken();
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, 8, "6"));
        });
    });
});
