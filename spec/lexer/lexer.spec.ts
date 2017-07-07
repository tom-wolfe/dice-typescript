import * as Lexer from "../../src/lexer";

describe("Lexer", () => {
    const input = "floor(4d6!!+5d10kl2/2+4)"
    describe("constructor", () => {
        it("does not throw.", function () {
            expect(() => {
                const lexer = new Lexer.Lexer(input);
            }).not.toThrow();
        });
        it("throws for invalid input.", function () {
            expect(() => {
                const lexer = new Lexer.Lexer(6 as any);
            }).toThrow();
        });
    });
    describe("getNextToken", () => {
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
            const lexer = new Lexer.Lexer("2d10 % 8 - 2 * 3 ** 1d4! > 1 < 2 <= 2 >= 2d3!! = 3 + {4, 5}");
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
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.UnOpExplode, "!"));
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
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.MathOpAdd, "+"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceOpen, "{"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "4"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Comma, ","));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "5"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.BraceClose, "}"));
            expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator));
        });
        it("throws on unrecognized tokens", () => {
            const lexer = new Lexer.Lexer("test_face");
            lexer.getNextToken();
            expect(() => { lexer.getNextToken() }).toThrow();
        });
    });
    describe("peekNextToken", () => {
        it("gives next token without cycling through.", () => {
            const lexer = new Lexer.Lexer(input);
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, "("));
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, "("));
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "4"));
            lexer.getNextToken();
            lexer.getNextToken();
            expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.NumberInteger, "6"));
        });
    });
});
