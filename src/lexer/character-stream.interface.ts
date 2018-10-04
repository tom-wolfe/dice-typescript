
export interface CharacterStream {
  getCurrentCharacter(): string;
  getCurrentPosition(): number;
  getNextCharacter(): string;
  peekNextCharacter(): string;
}
