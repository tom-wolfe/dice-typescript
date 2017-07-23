import * as Ast from "../ast";
import { Lexer, TokenType } from "../lexer";
import { BasicParser } from "./basic-parser";
import { ParseResult } from "./parse-result";

const BooleanOperatorMap: { [token: string]: Ast.NodeType } = {};
BooleanOperatorMap[TokenType.Equals] = Ast.NodeType.Equal;
BooleanOperatorMap[TokenType.Greater] = Ast.NodeType.Greater;
BooleanOperatorMap[TokenType.Less] = Ast.NodeType.Less;
BooleanOperatorMap[TokenType.GreaterOrEqual] = Ast.NodeType.GreaterOrEqual;
BooleanOperatorMap[TokenType.LessOrEqual] = Ast.NodeType.LessOrEqual;

const AddOperatorMap: { [token: string]: Ast.NodeType } = {};
AddOperatorMap[TokenType.Plus] = Ast.NodeType.Add;
AddOperatorMap[TokenType.Minus] = Ast.NodeType.Subtract;

const MultiOperatorMap: { [token: string]: Ast.NodeType } = {};
MultiOperatorMap[TokenType.DoubleAsterisk] = Ast.NodeType.Exponent;
MultiOperatorMap[TokenType.Asterisk] = Ast.NodeType.Multiply;
MultiOperatorMap[TokenType.Slash] = Ast.NodeType.Divide;
MultiOperatorMap[TokenType.Percent] = Ast.NodeType.Modulo;

export class DiceParser extends BasicParser {
    constructor(input: Lexer | string) { super(input); }

    parse(): ParseResult {
        const result = new ParseResult();
        result.root = this.parseExpression(result);
        return result;
    }

    parseExpression(result: ParseResult): Ast.ExpressionNode {
        let root = this.parseSimpleExpression(result);
        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(BooleanOperatorMap[tokenType]);
            this.lexer.getNextToken();
            newRoot.addChild(root);
            newRoot.addChild(this.parseSimpleExpression(result));
            root = newRoot;
        }
        return root;
    }

    parseSimpleExpression(result: ParseResult): Ast.ExpressionNode {
        let tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            this.lexer.getNextToken();
        }

        let root = this.parseTerm(result);

        if (tokenType === TokenType.Minus) {
            const negateNode = Ast.Factory.create(Ast.NodeType.Negate);
            negateNode.addChild(root);
            root = negateNode;
        }

        tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(AddOperatorMap[tokenType]);
            newRoot.addChild(root);

            // Consume the operator.
            this.lexer.getNextToken();

            newRoot.addChild(this.parseTerm(result));

            root = newRoot;
            tokenType = this.lexer.peekNextToken().type;
        }
        return root;
    }

    parseTerm(result: ParseResult): Ast.ExpressionNode {
        let root: Ast.ExpressionNode = this.parseFactor(result);

        let tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(MultiOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(MultiOperatorMap[tokenType]);
            newRoot.addChild(root);

            // Consume the operator.
            this.lexer.getNextToken();
            newRoot.addChild(this.parseFactor(result));

            root = newRoot;
            tokenType = this.lexer.peekNextToken().type;
        }

        return root;
    }

    parseFactor(result: ParseResult): Ast.ExpressionNode {
        let root: Ast.ExpressionNode;
        const token = this.lexer.peekNextToken();
        switch (token.type) {
            case TokenType.Identifier:
                root = this.parseFunction(result);
                break;
            case TokenType.ParenthesisOpen:
                root = this.parseBracketedExpression(result);
                if (this.lexer.peekNextToken().type === TokenType.Identifier) {
                    root = this.parseDiceRoll(result, root);
                }
                break;
            case TokenType.BraceOpen:
                root = this.parseGroup(result);
                break;
            case TokenType.Integer:
                const number = this.parseInteger(result);
                if (this.lexer.peekNextToken().type !== TokenType.Identifier) {
                    root = number;
                } else {
                    root = this.parseDiceRoll(result, number);
                }
                break;
            default: this.errorToken(result, TokenType.Integer, token);
        }
        return root;
    }

    parseSimpleFactor(result: ParseResult): Ast.ExpressionNode {
        const token = this.lexer.peekNextToken();
        switch (token.type) {
            case TokenType.Integer: return this.parseInteger(result);
            case TokenType.ParenthesisOpen: return this.parseBracketedExpression(result);
            default: this.errorToken(result, TokenType.Integer, token);
        }
    }

    parseFunction(result: ParseResult): Ast.ExpressionNode {
        const functionName = this.expectAndConsume(result, TokenType.Identifier);
        const root = Ast.Factory.create(Ast.NodeType.Function)
            .setAttribute("name", functionName.value);

        this.expectAndConsume(result, TokenType.ParenthesisOpen)

        // Parse function arguments.
        const token = this.lexer.peekNextToken();
        if (token.type !== TokenType.ParenthesisClose) {
            root.addChild(this.parseExpression(result));
            while (this.lexer.peekNextToken().type === TokenType.Comma) {
                this.lexer.getNextToken(); // Consume the comma.
                root.addChild(this.parseExpression(result));
            }
        }

        this.expectAndConsume(result, TokenType.ParenthesisClose);

        return root;
    }

    parseInteger(result: ParseResult): Ast.ExpressionNode {
        const numberToken = this.lexer.getNextToken();
        return Ast.Factory.create(Ast.NodeType.Integer)
            .setAttribute("value", Number(numberToken.value));
    }

    parseBracketedExpression(result: ParseResult): Ast.ExpressionNode {
        this.lexer.getNextToken(); // Consume the opening bracket.
        const root = this.parseExpression(result);
        this.expectAndConsume(result, TokenType.ParenthesisClose);
        return root;
    }

    parseGroup(result: ParseResult): Ast.ExpressionNode {
        this.lexer.getNextToken(); // Consume the opening brace.

        const root = Ast.Factory.create(Ast.NodeType.Group);

        // Parse group elements.
        const token = this.lexer.peekNextToken();
        if (token.type !== TokenType.BraceClose) {
            const firstElement = this.parseExpression(result);
            root.addChild(firstElement);
            // TODO: Support ellipses for group repetition.
            while (this.lexer.peekNextToken().type === TokenType.Comma) {
                this.lexer.getNextToken(); // Consume the comma.
                root.addChild(this.parseExpression(result));
            }
        }

        this.expectAndConsume(result, TokenType.BraceClose);

        return root;
    }

    parseDice(result: ParseResult, rollTimes?: Ast.ExpressionNode): Ast.ExpressionNode {
        let root = this.parseDiceRoll(result, rollTimes);
        while (true) {
            const token = this.lexer.peekNextToken();
            if (Object.keys(BooleanOperatorMap).indexOf(token.type.toString()) > -1) {
                root = this.parseCompareModifier(result, root);
            } else if (token.type === TokenType.Identifier) {
                switch (token.value[0]) {
                    case "c": root = this.parseCritical(result, root); break;
                    case "d": root = this.parseDrop(result, root); break;
                    case "k": root = this.parseKeep(result, root); break;
                    case "r": root = this.parseReroll(result, root); break;
                    case "s": root = this.parseSort(result, root); break;
                    default:
                        this.errorToken(result, TokenType.Identifier, token);
                        return root;
                }
            } else if (token.type === TokenType.Exclamation) {
                root = this.parseExplode(result, root);
            } else { break; }
        }
        return root;
    }

    parseDiceRoll(result: ParseResult, rollTimes?: Ast.ExpressionNode): Ast.ExpressionNode {
        if (!rollTimes) { rollTimes = this.parseSimpleFactor(result); }
        const token = this.expectAndConsume(result, TokenType.Identifier);

        const root = Ast.Factory.create(Ast.NodeType.Dice);
        root.addChild(rollTimes);

        switch (token.value) {
            case "d":
                const sidesToken = this.expectAndConsume(result, TokenType.Integer);
                root.addChild(Ast.Factory.create(Ast.NodeType.DiceSides))
                    .setAttribute("value", Number(sidesToken.value));
                break;
            case "dF":
                root.addChild(Ast.Factory.create(Ast.NodeType.DiceSides))
                    .setAttribute("value", "fate");
                break;
        }

        return root;
    }

    parseExplode(result: ParseResult, lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Explode);
        root.setAttribute("compound", false);
        root.setAttribute("penetrate", false);

        if (lhs) { root.addChild(lhs); }

        this.lexer.getNextToken();

        let token = this.lexer.peekNextToken();
        if (token.type === TokenType.Exclamation) {
            root.setAttribute("compound", true);
            this.lexer.getNextToken(); // Consume second !.
        }

        token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            if (token.value === "p") {
                root.setAttribute("penetrate", true);
            }
            this.lexer.getNextToken(); // Consume p.
        }

        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            root.addChild(this.parseCompareModifier(result));
        }
        return root;
    }

    parseCritical(result: ParseResult, lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Critical);
        root.setAttribute("type", "success");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "c": root.setAttribute("type", "success"); break;
                case "cs": root.setAttribute("type", "success"); break;
                case "cf": root.setAttribute("type", "failure"); break;
                default: this.errorMessage(result, `Unknown critical type ${token.value}. Must be (c|cs|cf).`, token);
            }
        }

        this.lexer.getNextToken();

        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            root.addChild(this.parseCompareModifier(result));
        }
        return root;
    }

    parseKeep(result: ParseResult, lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Keep);
        root.setAttribute("type", "highest");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "k": root.setAttribute("type", "highest"); break;
                case "kh": root.setAttribute("type", "highest"); break;
                case "kl": root.setAttribute("type", "lowest"); break;
                default: this.errorMessage(result, `Unknown keep type ${token.value}. Must be (k|kh|kl).`, token);
            }
        }

        this.lexer.getNextToken(); // Consume.

        const tokenType = this.lexer.peekNextToken().type;
        if (tokenType === TokenType.Integer || tokenType === TokenType.ParenthesisOpen) {
            root.addChild(this.parseSimpleFactor(result));
        }
        return root;
    }

    parseDrop(result: ParseResult, lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Drop);
        root.setAttribute("type", "lowest");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "d": root.setAttribute("type", "lowest"); break;
                case "dh": root.setAttribute("type", "highest"); break;
                case "dl": root.setAttribute("type", "lowest"); break;
                default: this.errorMessage(result, `Unknown drop type ${token.value}. Must be (d|dh|dl).`, token);
            }
        }

        this.lexer.getNextToken(); // Consume.

        const tokenType = this.lexer.peekNextToken().type;
        if (tokenType === TokenType.Integer || tokenType === TokenType.ParenthesisOpen) {
            root.addChild(this.parseSimpleFactor(result));
        }
        return root;
    }

    parseReroll(result: ParseResult, lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Reroll);
        root.setAttribute("once", false);
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "r": root.setAttribute("once", false); break;
                case "ro": root.setAttribute("once", true); break;
                default: this.errorMessage(result, `Unknown drop type ${token.value}. Must be (r|ro).`, token);
            }
        }
        this.lexer.getNextToken(); // Consume.

        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            root.addChild(this.parseCompareModifier(result));
        }
        return root;
    }

    parseSort(result: ParseResult, lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Sort);
        root.setAttribute("direction", "ascending");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "s": root.setAttribute("direction", "ascending"); break;
                case "sa": root.setAttribute("direction", "ascending"); break;
                case "sd": root.setAttribute("direction", "descending"); break;
                default: this.errorMessage(result, `Unknown sort type ${token.value}. Must be (s|sa|sd).`, token);
            }
        }
        this.lexer.getNextToken(); // Consume.

        return root;
    }

    parseCompareModifier(result: ParseResult, lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const token = this.lexer.peekNextToken();
        let root: Ast.ExpressionNode;
        if (token.type === TokenType.Integer) {
            root = Ast.Factory.create(Ast.NodeType.Equal);
        } else if (Object.keys(BooleanOperatorMap).indexOf(token.type.toString()) > -1) {
            root = Ast.Factory.create(BooleanOperatorMap[token.type]);
            this.lexer.getNextToken();
        } else {
            this.errorToken(result, TokenType.Integer, token);
        }
        if (lhs) { root.addChild(lhs); }
        root.addChild(this.parseSimpleFactor(result));
        return root;
    }
}
