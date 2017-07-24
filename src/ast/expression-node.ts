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
        return this.insertChild(node);
    }

    insertChild(node: ExpressionNode, index?: number, ): ExpressionNode {
        if (node) {
            if (node === this) { throw new Error("Cannot add a node as a child of itself."); }
            if (!this.children) { this.children = []; }
            this.children.splice(index || this.children.length, 0, node);
            node.parent = this;
        }
        return node;
    }

    clearChildren(): void {
        this.children = undefined;
    }

    getChild(index: number): ExpressionNode {
        if (!this.children || this.children.length <= index) {
            throw new Error(`Child node at index ${index} does not exist.`);
        }
        return this.children[index];
    }

    getChildCount(): number {
        return this.children ? this.children.length : 0;
    }

    forEachChild(fn: (child: ExpressionNode, index?: number) => boolean | void) {
        for (let rollIndex = 0; rollIndex < this.getChildCount(); rollIndex++) {
            const res = fn(this.getChild(rollIndex), rollIndex);
            if (!res && res !== undefined) { break; }
        }
    }

    getAttribute(key: string) {
        return this.attributes ? this.attributes[key] : undefined;
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
