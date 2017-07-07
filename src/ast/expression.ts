import { ExpressionNode } from "./expression-node";

export class Expression {
    readonly root: ExpressionNode;

    constructor(root: ExpressionNode) {
        this.root = root;
    }
}
