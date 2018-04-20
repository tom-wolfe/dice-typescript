import { ExpressionNode } from './expression-node.class';
import { NodeType } from './node-type.enum';

export class Factory {
    static create(type: NodeType): ExpressionNode {
        return new ExpressionNode(type);
    }
}
