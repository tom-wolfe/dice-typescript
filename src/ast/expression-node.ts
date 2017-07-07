import { Factory } from "./factory";
import { NodeAttributes } from "./node-attributes";
import { NodeType } from "./node-type";

export class ExpressionNode {
    readonly type: NodeType;
    private attributes;
    private parent: ExpressionNode;
    private children: ExpressionNode[];

    constructor(type: NodeType, parent: ExpressionNode = null) {
        this.type = type
        this.parent = parent
    }

    copy(): ExpressionNode {
        const copy = Factory.create(this.type);
        if (this.attributes) {
            Object.keys(this.attributes).forEach(attr => {
                copy.setAttribute(attr, this.attributes[attr]);
            });
        }
        if (this.children) {
            this.children.forEach(child => {
                copy.addChild(child.copy());
            })
        }
        return copy;
    }

    addChild(node: ExpressionNode): ExpressionNode {
        if (node) {
            if (!this.children) { this.children = []; }
            this.children.push(node);
            node.parent = this;
        }
        return node;
    }

    setAttribute(key: string, value: any) {
        if (!this.attributes) { this.attributes = new NodeAttributes(); }
        this.attributes[key] = value;
        return this;
    }

    toJSON(): any {
        const keys = Object.keys(this).filter(k => k !== "parent");
        const obj = {};
        keys.forEach(k => obj[k] = this[k]);
        return obj;
    }
}
