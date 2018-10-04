import { ParseResult } from './parse-result.class';

export interface Parser {
  parse(): ParseResult;
}
