import * as Ast from '../../src/ast';

describe('ExpressionNode', () => {
  describe('copy', () => {
    const root = Ast.Factory.create(Ast.NodeType.Add);
    root.addChild(Ast.Factory.create(Ast.NodeType.Dice))
      .setAttribute('times', 4)
      .setAttribute('dice', 20);
    root.addChild(Ast.Factory.create(Ast.NodeType.Number))
      .setAttribute('value', 10);

    it('should be equal', () => {
      expect(root.copy()).toEqual(root);
    });
    it('should not be the same object', () => {
      expect(root.copy()).not.toBe(root);
    });
  });
  describe('getChild', () => {
    it('should throw if index is out of bounds.', () => {
      const root = Ast.Factory.create(Ast.NodeType.Number);
      expect(() => {
        root.getChild(100);
      }).toThrow();
    });
  });
  describe('insertChild', () => {
    it('should throw when adding a node as a child of itself.', () => {
      const root = Ast.Factory.create(Ast.NodeType.Number);
      expect(() => {
        root.insertChild(root, 0);
      }).toThrow();
    });
  });
});
