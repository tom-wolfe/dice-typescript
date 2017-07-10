import * as Ast from "../ast";
import { Lexer, TokenType } from "../lexer";
import { BasicParser } from "./basic-parser";

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

    parse(): Ast.ExpressionNode {
        return this.parseExpression();
    }

    parseExpression(): Ast.ExpressionNode {
        let root = this.parseSimpleExpression();
        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(BooleanOperatorMap[tokenType]);
            this.lexer.getNextToken();
            newRoot.addChild(root);
            newRoot.addChild(this.parseSimpleExpression());
            root = newRoot;
        }
        return root;
    }

    parseSimpleExpression(): Ast.ExpressionNode {
        let tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            this.lexer.getNextToken();
        }

        let root = this.parseTerm();

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

            newRoot.addChild(this.parseTerm());

            root = newRoot;
            tokenType = this.lexer.peekNextToken().type;
        }
        return root;
    }

    parseTerm(): Ast.ExpressionNode {
        let root: Ast.ExpressionNode = this.parseFactor();

        let tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(MultiOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(MultiOperatorMap[tokenType]);
            newRoot.addChild(root);

            // Consume the operator.
            this.lexer.getNextToken();
            newRoot.addChild(this.parseFactor());

            root = newRoot;
            tokenType = this.lexer.peekNextToken().type;
        }

        return root;
    }

    parseFactor(): Ast.ExpressionNode {
        let root: Ast.ExpressionNode;
        const token = this.lexer.peekNextToken();
        switch (token.type) {
            case TokenType.Identifier:
                root = this.parseFunctionCall();
                break;
            case TokenType.ParenthesisOpen:
                root = this.parseBracketedExpression();
                if (this.lexer.peekNextToken().type === TokenType.Identifier) {
                    root = this.parseDiceRoll(root);
                }
                break;
            case TokenType.BraceOpen:
                root = this.parseExpressionGroup();
                break;
            case TokenType.Integer:
                const number = this.parseInteger();
                if (this.lexer.peekNextToken().type !== TokenType.Identifier) {
                    root = number;
                } else {
                    root = this.parseDiceRoll(number);
                }
                break;
            default: this.errorToken(TokenType.Integer, token);
        }
        return root;
    }

    parseSimpleFactor(): Ast.ExpressionNode {
        const token = this.lexer.peekNextToken();
        switch (token.type) {
            case TokenType.Integer: return this.parseInteger();
            case TokenType.ParenthesisOpen: return this.parseBracketedExpression();
            default: this.errorToken(TokenType.Integer, token);
        }
    }

    parseFunctionCall(): Ast.ExpressionNode {
        const functionName = this.expectAndConsume(TokenType.Identifier);
        const root = Ast.Factory.create(Ast.NodeType.Function)
            .setAttribute("name", functionName.value);

        this.expectAndConsume(TokenType.ParenthesisOpen)

        // Parse function arguments.
        const token = this.lexer.peekNextToken();
        if (token.type !== TokenType.ParenthesisClose) {
            root.addChild(this.parseExpression());
            while (this.lexer.peekNextToken().type === TokenType.Comma) {
                this.lexer.getNextToken(); // Consume the comma.
                root.addChild(this.parseExpression());
            }
        }

        this.expectAndConsume(TokenType.ParenthesisClose);

        return root;
    }

    parseInteger(): Ast.ExpressionNode {
        const numberToken = this.lexer.getNextToken();
        return Ast.Factory.create(Ast.NodeType.Integer)
            .setAttribute("value", Number(numberToken.value));
    }

    parseBracketedExpression(): Ast.ExpressionNode {
        this.lexer.getNextToken(); // Consume the opening bracket.
        const root = this.parseExpression();
        this.expectAndConsume(TokenType.ParenthesisClose);
        return root;
    }

    parseExpressionGroup(): Ast.ExpressionNode {
        this.lexer.getNextToken(); // Consume the opening brace.

        const root = Ast.Factory.create(Ast.NodeType.Group);

        // Parse group elements.
        const token = this.lexer.peekNextToken();
        if (token.type !== TokenType.BraceClose) {
            root.addChild(this.parseExpression());
            while (this.lexer.peekNextToken().type === TokenType.Comma) {
                this.lexer.getNextToken(); // Consume the comma.
                root.addChild(this.parseExpression());
            }
        }

        this.expectAndConsume(TokenType.BraceClose);

        return root;
    }

    parseDiceRoll(rollTimes?: Ast.ExpressionNode): Ast.ExpressionNode {
        let root = this.parseSimpleDiceRoll(rollTimes);
        while (true) {
            const token = this.lexer.peekNextToken();
            if (Object.keys(BooleanOperatorMap).indexOf(token.type.toString()) > -1) {
                root = this.parseCompareModifier(root);
            } else if (token.type === TokenType.Identifier) {
                switch (token.value[0]) {
                    case "c": root = this.parseCriticalModifier(root); break;
                    case "d": root = this.parseDropModifier(root); break;
                    case "k": root = this.parseKeepModifier(root); break;
                    case "r": root = this.parseRerollModifier(root); break;
                    case "s": root = this.parseSortModifier(root); break;
                    default: this.errorToken(TokenType.Identifier, token);
                }
            } else if (token.type === TokenType.Exclamation) {
                root = this.parseExplodeModifier(root);
            } else {
                break;
            }
        }
        return root;
    }

    parseSimpleDiceRoll(rollTimes?: Ast.ExpressionNode): Ast.ExpressionNode {
        if (!rollTimes) { rollTimes = this.parseSimpleFactor(); }
        const token = this.expectAndConsume(TokenType.Identifier);

        const root = Ast.Factory.create(Ast.NodeType.Dice);
        root.addChild(rollTimes);

        switch (token.value) {
            case "d":
                const sidesToken = this.expectAndConsume(TokenType.Integer);
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

    parseExplodeModifier(lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Explode);
        root.setAttribute("compound", "no");
        root.setAttribute("penetrate", "no");

        if (lhs) { root.addChild(lhs); }

        this.lexer.getNextToken();

        let token = this.lexer.peekNextToken();
        if (token.type === TokenType.Exclamation) {
            root.setAttribute("compound", "yes");
            this.lexer.getNextToken(); // Consume second !.
        }

        token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            if (token.value === "p") {
                root.setAttribute("penetrate", "yes");
            }
            this.lexer.getNextToken(); // Consume p.
        }

        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            root.addChild(this.parseCompareModifier());
        }
        return root;
    }

    parseCriticalModifier(lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Critical);
        root.setAttribute("type", "success");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "c": root.setAttribute("type", "success"); break;
                case "cs": root.setAttribute("type", "success"); break;
                case "cf": root.setAttribute("type", "failure"); break;
                default: this.errorMessage(`Unknown critical type ${token.value}. Must be (c|cs|cf).`);
            }
        }

        this.lexer.getNextToken();

        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            root.addChild(this.parseCompareModifier());
        }
        return root;
    }

    parseKeepModifier(lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Keep);
        root.setAttribute("type", "highest");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "k": root.setAttribute("type", "highest"); break;
                case "kh": root.setAttribute("type", "highest"); break;
                case "kl": root.setAttribute("type", "lowest"); break;
                default: this.errorMessage(`Unknown keep type ${token.value}. Must be (k|kh|kl).`);
            }
        }

        this.lexer.getNextToken(); // Consume.

        const tokenType = this.lexer.peekNextToken().type;
        if (tokenType === TokenType.Integer || tokenType === TokenType.ParenthesisOpen) {
            root.addChild(this.parseSimpleFactor());
        }
        return root;
    }

    parseDropModifier(lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Drop);
        root.setAttribute("type", "lowest");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "d": root.setAttribute("type", "lowest"); break;
                case "dh": root.setAttribute("type", "highest"); break;
                case "dl": root.setAttribute("type", "lowest"); break;
                default: this.errorMessage(`Unknown drop type ${token.value}. Must be (d|dh|dl).`);
            }
        }

        this.lexer.getNextToken(); // Consume.

        const tokenType = this.lexer.peekNextToken().type;
        if (tokenType === TokenType.Integer || tokenType === TokenType.ParenthesisOpen) {
            root.addChild(this.parseSimpleFactor());
        }
        return root;
    }

    parseRerollModifier(lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Reroll);
        root.setAttribute("once", "no");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "r": root.setAttribute("once", "no"); break;
                case "ro": root.setAttribute("once", "yes"); break;
                default: this.errorMessage(`Unknown drop type ${token.value}. Must be (r|ro).`);
            }
        }
        this.lexer.getNextToken(); // Consume.

        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            root.addChild(this.parseCompareModifier());
        }
        return root;
    }

    parseSortModifier(lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const root = Ast.Factory.create(Ast.NodeType.Sort);
        root.setAttribute("direction", "ascending");
        if (lhs) { root.addChild(lhs); }

        const token = this.lexer.peekNextToken();
        if (token.type === TokenType.Identifier) {
            switch (token.value) {
                case "s": root.setAttribute("direction", "ascending"); break;
                case "sa": root.setAttribute("direction", "ascending"); break;
                case "sd": root.setAttribute("direction", "descending"); break;
                default: this.errorMessage(`Unknown sort type ${token.value}. Must be (s|sa|sd).`);
            }
        }
        this.lexer.getNextToken(); // Consume.

        return root;
    }

    parseCompareModifier(lhs?: Ast.ExpressionNode): Ast.ExpressionNode {
        const token = this.lexer.peekNextToken();
        let root: Ast.ExpressionNode;
        if (token.type === TokenType.Integer) {
            root = Ast.Factory.create(Ast.NodeType.Equal);
        } else if (Object.keys(BooleanOperatorMap).indexOf(token.type.toString()) > -1) {
            root = Ast.Factory.create(BooleanOperatorMap[token.type]);
            this.lexer.getNextToken();
        } else {
            this.errorToken(TokenType.Integer, token);
        }
        if (lhs) { root.addChild(lhs); }
        root.addChild(this.parseSimpleFactor());
        return root;
    }
}
