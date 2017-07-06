import { Token } from "./token";
import { TokenDefinition } from "./token-definition";
import { TokenMatch } from "./token-match";
import { TokenType } from "./token-type";

const TokenDefinitions: TokenDefinition[] = [
    new TokenDefinition(TokenType.ParenthesisOpen, /\(/g, 1),
    new TokenDefinition(TokenType.ParenthesisClose, /\)/g, 1),
    new TokenDefinition(TokenType.UnOpPenetrate, /!!/g, 1),
    new TokenDefinition(TokenType.UnOpExplode, /!/g, 2),
    new TokenDefinition(TokenType.MathOpSubtract, /-/g, 1),
    new TokenDefinition(TokenType.MathOpAdd, /\+/g, 1),
    new TokenDefinition(TokenType.MathOpExponent, /\*\*/g, 1),
    new TokenDefinition(TokenType.MathOpMultiply, /\*/g, 2),
    new TokenDefinition(TokenType.MathOpDivide, /\//g, 1),
    new TokenDefinition(TokenType.MathOpModulo, /%/g, 1),
    new TokenDefinition(TokenType.BoolOpGreaterOrEq, />=/g, 1),
    new TokenDefinition(TokenType.BoolOpLessOrEq, /<=/g, 1),
    new TokenDefinition(TokenType.BoolOpEq, /=/g, 2),
    new TokenDefinition(TokenType.BoolOpGreater, />/g, 2),
    new TokenDefinition(TokenType.BoolOpLess, /</g, 2),
    new TokenDefinition(TokenType.Identifier, /[a-zA-Z_]\w*/g, 1),
    new TokenDefinition(TokenType.NumberInteger, /[-+]?[1-9]\d*/g, 2),
    new TokenDefinition(TokenType.NumberNatural, /[1-9]\d*/g, 3)
];

export class Lexer {

    constructor(private tokenDefinitions: TokenDefinition[] = TokenDefinitions) { }

    tokenize(input: string): Token[] {
        const output: Token[] = [];
        const matches = this.findMatches(input);
        let lastMatch: TokenMatch = null;
        for (const match of matches) {
            const bestMatch = match[0];
            if (lastMatch && bestMatch.start < lastMatch.start) {
                return;
            }
            output.push(new Token(bestMatch.type, bestMatch.value));
            lastMatch = bestMatch;
        }
        output.push(new Token(TokenType.Terminator));
        return output;
    }

    findMatches(input: string): TokenMatch[][] {
        const indexes: number[] = []
        const matches: { [startIndex: number]: TokenMatch[] } = {};

        // Group by start index.
        this.tokenDefinitions.forEach(tokenDef => {
            tokenDef.matches(input).forEach(match => {
                if (indexes.indexOf(match.start) < 0) {
                    indexes.push(match.start);
                    matches[match.start] = [];
                }
                matches[match.start].push(match);
            })
        });

        // Sort each index group by precedence.
        const sortedMatches: TokenMatch[][] = [];
        indexes.sort().forEach(index => {
            sortedMatches.push(matches[index].sort((a, b) => {
                return b.precedence - a.precedence;
            }));
        });
        return sortedMatches;
    }
}
