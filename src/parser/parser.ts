import { ParseResult } from "./parse-result";

export interface Parser {
    parse(): ParseResult;
}
