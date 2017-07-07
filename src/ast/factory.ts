import { ExpressionNode } from "./expression-node";
import { NodeType } from "./node-type";

export class Factory {
    static create(type: NodeType): ExpressionNode {
        return new ExpressionNode(type);
    }
}
