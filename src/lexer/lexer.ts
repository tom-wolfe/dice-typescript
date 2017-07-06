import { TokenDefinition } from "./token-definition";
import { TokenType } from "./token-type";

const tokenDefinitions: TokenDefinition[] = [
    new TokenDefinition(TokenType.ParenthesisOpen, /\(/g, 1),
    new TokenDefinition(TokenType.ParenthesisClose, /\)/g, 1),
    new TokenDefinition(TokenType.UnOpPenetrate, /!!/g, 1),
    new TokenDefinition(TokenType.UnOpExplode, /!/g, 2),
    new TokenDefinition(TokenType.MathOpSubtract, /-/g, 1),
    new TokenDefinition(TokenType.MathOpAdd, /\+/g, 1),
    new TokenDefinition(TokenType.MathOpExponent, /\**/g, 1),
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

    constructor() { }

    tokenize(input: string) {
        // TODO: Implement.
    }
    private findMatches(input: string) {
        // TODO: Implement.
    }
}
