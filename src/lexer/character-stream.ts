
export interface CharacterStream {
    getCurrentCharacter(): string;
    getNextCharacter(): string;
    peekNextCharacter(): string;
}
