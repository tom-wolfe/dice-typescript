import * as Ast from '../../src/ast';
import * as Generator from '../../src/generator';

describe('DiceGenerator', () => {
  describe('generate method', () => {
    it('exists for each node type.', () => {
      const generator = new Generator.DiceGenerator();
      Object.keys(Ast.NodeType).forEach(nodeType => {
        const methodName = 'generate' + nodeType;
        expect(generator[methodName]).toBeDefined(`Generate method ${methodName} does not exist.`);
      });
    });
  });
});
