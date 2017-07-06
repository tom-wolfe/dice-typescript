import { NonGlobalDefinitionError } from "./non-global-definition-error";
import { TokenMatch } from "./token-match";
import { TokenType } from "./token-type";

export class TokenDefinition {
    constructor(private type: TokenType, private pattern: RegExp, private precedence: number) {
        if (!pattern.global) {
            throw new NonGlobalDefinitionError();
        }
    }
    matches(input: string): TokenMatch[] {
        const matches: TokenMatch[] = [];
        let result: RegExpExecArray;
        while (result = this.pattern.exec(input)) {
            matches.push(new TokenMatch(result.index, this.type, result[0],));
        }
        return matches;
    }
}
