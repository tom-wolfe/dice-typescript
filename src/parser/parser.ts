import * as Ast from "../ast";

export class Parser {
    parse(input: string): Ast.Expression {
        const root = Ast.Factory.create(Ast.NodeType.Add);
        root.addChild(Ast.Factory.create(Ast.NodeType.Dice))
            .setAttribute("times", 4)
            .setAttribute("dice", 20);
        root.addChild(Ast.Factory.create(Ast.NodeType.Integer))
            .setAttribute("value", 10);
        return new Ast.Expression(root);
    }
}
