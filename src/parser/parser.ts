import * as Ast from "../ast";
import { Lexer } from "../lexer";
import { DiceLexer } from "../lexer/dice-lexer";
import { TokenType } from "../lexer/token-type";

const BooleanOperatorMap: { [token: string]: Ast.NodeType } = {};
BooleanOperatorMap[TokenType.BoolOpEq] = Ast.NodeType.Equal;
BooleanOperatorMap[TokenType.BoolOpGreater] = Ast.NodeType.Greater;
BooleanOperatorMap[TokenType.BoolOpLess] = Ast.NodeType.Less;
BooleanOperatorMap[TokenType.BoolOpGreaterOrEq] = Ast.NodeType.GreaterOrEqual;
BooleanOperatorMap[TokenType.BoolOpLessOrEq] = Ast.NodeType.LessOrEqual;

const AddOperatorMap: { [token: string]: Ast.NodeType } = {};
AddOperatorMap[TokenType.MathOpAdd] = Ast.NodeType.Add;
AddOperatorMap[TokenType.MathOpSubtract] = Ast.NodeType.Subtract;

const MultiOperatorMap: { [token: string]: Ast.NodeType } = {};
MultiOperatorMap[TokenType.MathOpExponent] = Ast.NodeType.Exponent;
MultiOperatorMap[TokenType.MathOpMultiply] = Ast.NodeType.Multiply;
MultiOperatorMap[TokenType.MathOpDivide] = Ast.NodeType.Divide;
MultiOperatorMap[TokenType.MathOpModulo] = Ast.NodeType.Modulo;

export class Parser {
    protected readonly lexer: Lexer;

    constructor(input: Lexer | string) {
        if (this.isLexer(input)) {
            this.lexer = input;
        } else if (typeof input === "string") {
            this.lexer = new DiceLexer(input);
        } else {
            throw new Error("Unrecognized input type. input must be of type 'Lexer | string'.")
        }
    }

    private isLexer(input: any): input is Lexer {
        return input.getNextToken;
    }

    parse(): Ast.Expression {
        const root: Ast.ExpressionNode = this.parseExpression();
        return new Ast.Expression(root);
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

        if (tokenType === TokenType.MathOpSubtract) {
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
        const tokenType = this.lexer.peekNextToken().type;
        switch (tokenType) {
            case TokenType.Identifier:
                root = this.parseFunctionCall();
                break;
            case TokenType.ParenthesisOpen:
                root = this.parseBracketedExpression();
                if (this.lexer.peekNextToken().type === TokenType.Identifier) {
                    root = this.parseDiceRoll(root);
                }
                break;
            case TokenType.NumberInteger:
                const number = this.parseInteger();
                if (this.lexer.peekNextToken().type !== TokenType.Identifier) {
                    root = number;
                } else {
                    root = this.parseDiceRoll(number);
                }
                break;
            default: throw new Error(`Unexpected token ${tokenType} of value ${this.lexer.peekNextToken().value}.`);
        }
        return root;
    }

    parseFunctionCall(): Ast.ExpressionNode {
        let root: Ast.ExpressionNode;
        let token = this.lexer.getNextToken();

        if (token.type !== TokenType.Identifier) {
            throw new Error("Expected function name.");
        }

        root = Ast.Factory.create(Ast.NodeType.Function)
            .setAttribute("name", token.value);

        token = this.lexer.getNextToken();
        if (token.type !== TokenType.ParenthesisOpen) {
            throw new Error(`Expected "(", found "${token.type}".`);
        }

        // Parse function arguments.
        token = this.lexer.peekNextToken();
        if (token.type !== TokenType.ParenthesisClose) {
            root.addChild(this.parseExpression());
            while (this.lexer.peekNextToken().type === TokenType.Comma) {
                this.lexer.getNextToken(); // Consume the comma.
                root.addChild(this.parseExpression());
            }
        }

        token = this.lexer.getNextToken();
        if (token.type !== TokenType.ParenthesisClose) {
            throw new Error("Missing closing parenthesis.");
        }

        return root;
    }

    parseInteger(): Ast.ExpressionNode {
        const numberToken = this.lexer.getNextToken();
        return Ast.Factory.create(Ast.NodeType.Integer)
            .setAttribute("value", numberToken.value);
    }

    parseBracketedExpression(): Ast.ExpressionNode {
        this.lexer.getNextToken(); // Consume the opening bracket.
        const root = this.parseExpression();
        if (this.lexer.peekNextToken().type !== TokenType.ParenthesisClose) {
            throw new Error("Missing closing brace.");
        }
        this.lexer.getNextToken(); // Consume the closing bracket.
        return root;
    }

    parseDiceRoll(rollTimes?: Ast.ExpressionNode): Ast.ExpressionNode {
        let root: Ast.ExpressionNode;

        root = this.parseSimpleDiceRoll(rollTimes);

        // TODO: Parse modifiers.

        return root;
    }

    parseSimpleDiceRoll(rollTimes?: Ast.ExpressionNode): Ast.ExpressionNode {
        let root: Ast.ExpressionNode;

        if (!rollTimes) {
            if (this.lexer.peekNextToken().type !== TokenType.NumberInteger) {
                throw new Error("Expected integer");
            }
            rollTimes = this.parseInteger();
        }

        const tokenValue = this.lexer.peekNextToken().value;
        if (tokenValue !== "d") {
            throw new Error(`Expected "d", got "${tokenValue}".`)
        }
        this.lexer.getNextToken(); // Consume the d.

        root = Ast.Factory.create(Ast.NodeType.Dice);
        root.addChild(rollTimes);

        const sidesToken = this.lexer.getNextToken();
        if (sidesToken.type !== TokenType.NumberInteger) {
            throw new Error("Missing dice value");
        }
        root.addChild(Ast.Factory.create(Ast.NodeType.Integer))
            .setAttribute("value", sidesToken.value);

        return root;
    }
}
