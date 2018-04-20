import { DiceResult } from './interpreter';
import { DiceInterpreter } from './interpreter/dice-interpreter.class';
import { FunctionDefinitionList } from './interpreter/function-definition-list.class';
import { CharacterStream, Lexer } from './lexer';
import { DiceLexer } from './lexer/dice-lexer.class';
import { Parser } from './parser';
import { DiceParser } from './parser/dice-parser.class';
import { RandomProvider } from './random';

export class Dice {
    constructor(protected functions?: FunctionDefinitionList, protected randomProvider?: RandomProvider) { }

    roll(input: string | CharacterStream): DiceResult {
        const lexer = this.createLexer(input);
        const parser = this.createParser(lexer);
        const interpreter = this.createInterpreter();
        const res = parser.parse();
        return interpreter.interpret(res.root);
    }

    protected createLexer(input: string | CharacterStream): Lexer {
        return new DiceLexer(input);
    }

    protected createParser(lexer: Lexer): Parser {
        return new DiceParser(lexer);
    }

    protected createInterpreter(): DiceInterpreter {
        return new DiceInterpreter(this.functions, this.randomProvider);
    }
}
