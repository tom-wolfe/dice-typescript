import * as Ast from "../../src/ast";
import * as Interpreter from "../../src/interpreter";
import { MockRandomProvider } from "../helpers/mock-random-provider";

describe("DiceInterpreter", () => {
    describe("evaluate", () => {
        it("evaluates a complex dice roll with modifiers (4d6!kh2sa).", () => {
            // TODO: Implement this test.
        });
        it("evaluates a complex dice roll with modifiers (4d6!sakh2).", () => {
            // TODO: Implement this test. This can't work because "sakh" will be lexed into one identifier, but it represents two modifiers.
        });
    });
});
