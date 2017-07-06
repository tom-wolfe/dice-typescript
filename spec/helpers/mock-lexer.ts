import { Lexer } from "../../src/lexer";

export class MockLexer extends Lexer {
    constructor(input: string) { super(input); }

    public getNextCharacter(): string {
        return super.getNextCharacter();
    }

    public peekNextCharacter(): string {
        return super.peekNextCharacter();
    }

    public get currentCharacterPub(): string {
        return this.currentCharacter;
    }
}
