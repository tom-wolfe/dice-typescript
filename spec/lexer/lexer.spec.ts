import * as Lexer from "../../src/lexer";

describe("Lexer", () => {
    describe("constructor", () => {
        it("does not throw.", function () {
            expect(() => {
                const lexer = new Lexer.Lexer();
            }).not.toThrow();
        });
    });
    describe("findMatches", () => {
        const input = "(((((((";
        const TokenDefinitions: Lexer.TokenDefinition[] = [
            new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(/g, 1),
            new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(\(/g, 2),
            new Lexer.TokenDefinition(Lexer.TokenType.ParenthesisOpen, /\(\(\(/g, 3)
        ];
        it("groups results correctly by start index.", () => {
            const lexer = new Lexer.Lexer();
            const matches = lexer.findMatches(input);
            const searchedIndexes: number[] = [];
            matches.forEach(match => {
                const startIndex = match[0].start
                match.forEach(e => {
                    // All elements should have the same start index.
                    expect(e.start).toEqual(startIndex);
                    // The start index should not have been one we've seen before.
                    expect(searchedIndexes).not.toContain(e.start);
                });
                searchedIndexes.push(startIndex);
            });
        });
        it("sorts correctly by start index.", () => {
            const lexer = new Lexer.Lexer();
            const matches = lexer.findMatches(input);
            let curIndex: number;
            matches.forEach(match => {
                const newIndex = match[0].start;
                // No check required for the first element.
                if (curIndex) {
                    // Indexes must increment in value.
                    expect(newIndex).toBeGreaterThan(curIndex);
                }
                curIndex = newIndex;
            });
        });
        it("sorts correctly by precedence.", () => {
            const lexer = new Lexer.Lexer();
            const matches = lexer.findMatches(input);
            matches.forEach(match => {
                let curPrecedence = 0;
                match.forEach(e => {
                    // Elements should be sorted by precedence.
                    expect(e.precedence).toBeGreaterThanOrEqual(curPrecedence);
                    curPrecedence = e.precedence;
                });
            });
        });
    });
    describe("tokenize", () => {
        
    });
});
