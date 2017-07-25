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
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 6, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 7, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 8, "6"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Exclamation, 9, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Exclamation, 10, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 11, ")"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 12));
        });
        it("returns correct tokens (complex)", () => {
            const lexer = new Lexer.DiceLexer(input); // floor(4d6!!+5d10kl2/2+4)
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, "floor"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, "("));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 6, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 7, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 8, "6"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Exclamation, 9, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Exclamation, 10, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 11, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 12, "5"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 13, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 14, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 16, "kl"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 18, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Slash, 19, "/"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 20, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 21, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 22, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 23, ")"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 24));
        });
        it("interprets remaining operators correctly", () => {
            const lexer = new Lexer.DiceLexer("2d10%8-2*3**1d4!>1<2<=2>=2d3!!=3+{4,5}");
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 0, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 1, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 2, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Percent, 4, "%"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 5, "8"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Minus, 6, "-"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 7, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 8, "*"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 9, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.DoubleAsterisk, 10, "**"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 12, "1"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 13, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 14, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Exclamation, 15, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Greater, 16, ">"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 17, "1"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Less, 18, "<"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 19, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.LessOrEqual, 20, "<="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 22, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.GreaterOrEqual, 23, ">="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 25, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 26, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 27, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Exclamation, 28, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Exclamation, 29, "!"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Equals, 30, "="));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 31, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 32, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceOpen, 33, "{"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 34, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Comma, 35, ","));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 36, "5"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceClose, 37, "}"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 38));
        });
        it("interprets group repeater correctly", () => {
            const lexer = new Lexer.DiceLexer("{2d10,...3}");
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceOpen, 0, "{"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 1, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 2, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 3, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Comma, 5, ","));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Ellipsis, 6, "..."));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 9, "3"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceClose, 10, "}"));
        });
        it("throws on unrecognized tokens", () => {
            const lexer = new Lexer.DiceLexer("test_face");
            lexer.getNextToken();
            expect(() => { lexer.getNextToken() }).toThrow();
        });
        it("throws on too short ellipsis", () => {
            const lexer = new Lexer.DiceLexer("..");
            expect(() => { lexer.getNextToken() }).toThrow();
        });
        it("skips over whitespace.", () => {
            const lexer = new Lexer.DiceLexer("2  d\t10 \t + \t\t 3");
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 0, "2"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 3, "d"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 5, "10"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 10, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 15, "3"));
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
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 6, "4"));
            lexer.getNextToken();
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Integer, 8, "6"));
        });
    });
});
