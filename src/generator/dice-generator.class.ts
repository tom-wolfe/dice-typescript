import * as Ast from '../ast';
import { Generator } from './generator.interface';
import { Options } from '../options.interface';

export class DiceGenerator implements Generator<string> {
  constructor(
    protected options: Options = {},
  ) { }

  generate(expression: Ast.ExpressionNode): string {
    switch (expression.type) {
      case Ast.NodeType.Number: return this.generateNumber(expression);
      case Ast.NodeType.Add: return this.generateAdd(expression);
      case Ast.NodeType.Subtract: return this.generateSubtract(expression);
      case Ast.NodeType.Multiply: return this.generateMultiply(expression);
      case Ast.NodeType.Divide: return this.generateDivide(expression);
      case Ast.NodeType.Modulo: return this.generateModulo(expression);
      case Ast.NodeType.Exponent: return this.generateExponent(expression);
      case Ast.NodeType.Negate: return this.generateNegate(expression);
      case Ast.NodeType.Dice: return this.generateDice(expression);
      case Ast.NodeType.DiceSides: return this.generateDiceSides(expression);
      case Ast.NodeType.DiceRoll: return this.generateDiceRoll(expression);
      case Ast.NodeType.Function: return this.generateFunction(expression);
      case Ast.NodeType.Group: return this.generateGroup(expression);
      case Ast.NodeType.Repeat: return this.generateRepeat(expression);
      case Ast.NodeType.Equal: return this.generateEqual(expression);
      case Ast.NodeType.Greater: return this.generateGreater(expression);
      case Ast.NodeType.GreaterOrEqual: return this.generateGreaterOrEqual(expression);
      case Ast.NodeType.Less: return this.generateLess(expression);
      case Ast.NodeType.LessOrEqual: return this.generateLessOrEqual(expression);
      case Ast.NodeType.Explode: return this.generateExplode(expression);
      case Ast.NodeType.Keep: return this.generateKeep(expression);
      case Ast.NodeType.Drop: return this.generateDrop(expression);
      case Ast.NodeType.Critical: return this.generateCritical(expression);
      case Ast.NodeType.Reroll: return this.generateReroll(expression);
      case Ast.NodeType.Sort: return this.generateSort(expression);
      default: throw new Error('Unrecognized node type.');
    }
  }

  generateNumber(expression: Ast.ExpressionNode): string {
    return expression.getAttribute('value').toString();
  }

  generateAdd(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 2);
    return this.generate(expression.getChild(0)) + ' + ' + this.generate(expression.getChild(1));
  }

  generateSubtract(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 2);
    return this.generate(expression.getChild(0)) + ' - ' + this.generate(expression.getChild(1));
  }

  generateMultiply(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 2);
    return this.generate(expression.getChild(0)) + ' * ' + this.generate(expression.getChild(1));
  }

  generateDivide(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 2);
    return this.generate(expression.getChild(0)) + ' / ' + this.generate(expression.getChild(1));
  }

  generateModulo(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 2);
    return this.generate(expression.getChild(0)) + ' % ' + this.generate(expression.getChild(1));
  }

  generateExponent(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 2);
    return this.generate(expression.getChild(0)) + ' ^ ' + this.generate(expression.getChild(1));
  }

  generateNegate(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 1);
    return '-' + this.generate(expression.getChild(0));
  }

  generateDice(expression: Ast.ExpressionNode): string {
    if (expression.getChildCount() === 0 || expression.getChild(0).type === Ast.NodeType.DiceRoll) {
      return '[' + this.generateCommaList(expression) + ']';
    } else {
      this.expectChildCount(expression, 2);
      return this.generateWithParens(expression.getChild(0)) + 'd' + this.generateWithParens(expression.getChild(1));
    }
  }

  generateDiceSides(expression: Ast.ExpressionNode): string {
    const val = expression.getAttribute('value').toString();
    return val === 'fate' ? 'F' : val;
  }

  generateDiceRoll(expression: Ast.ExpressionNode): string {
    let exp = expression.getAttribute('value').toString();
    if (this.options.renderExpressionDecorators) {
      if (expression.getAttribute('reroll')) { exp = this.applyDecorator(exp, 'reroll', '↻'); }
      if (expression.getAttribute('explode')) { exp = this.applyDecorator(exp, 'explode', '!'); }
      if (expression.getAttribute('drop')) { exp = this.applyDecorator(exp, 'drop', '↓'); }
      if (expression.getAttribute('critical')) { exp = this.applyDecorator(exp, 'critical', '*'); }
      if (expression.getAttribute('success')) { exp = this.applyDecorator(exp, 'success', '✓'); }
    }
    return exp;
  }

  generateFunction(expression: Ast.ExpressionNode): string {
    return expression.getAttribute('name') + '(' + this.generateCommaList(expression) + ')';
  }

  generateGroup(expression: Ast.ExpressionNode): string {
    return '{' + this.generateCommaList(expression) + '}';
  }

  generateRepeat(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 2);
    return this.generate(expression.getChild(0)) + '...' + this.generate(expression.getChild(1));
  }

  generateEqual(expression: Ast.ExpressionNode): string {
    return this.generateEqualityExpression(expression, '=');
  }

  generateGreater(expression: Ast.ExpressionNode): string {
    return this.generateEqualityExpression(expression, '>');
  }

  generateGreaterOrEqual(expression: Ast.ExpressionNode): string {
    return this.generateEqualityExpression(expression, '>=');
  }

  generateLess(expression: Ast.ExpressionNode): string {
    return this.generateEqualityExpression(expression, '<');
  }

  generateLessOrEqual(expression: Ast.ExpressionNode): string {
    return this.generateEqualityExpression(expression, '<=');
  }

  generateExplode(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 1);
    let exp = '!';
    if (expression.getAttribute('compound')) { exp += '!'; }
    if (expression.getAttribute('penetrate')) { exp += 'p'; }
    if (expression.getChildCount() > 1) { exp += this.generate(expression.getChild(1)); }
    return this.generate(expression.getChild(0)) + exp;
  }

  generateKeep(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 1);
    let exp = 'k';
    if (expression.getAttribute('type') === 'highest') { exp += 'h'; }
    if (expression.getAttribute('type') === 'lowest') { exp += 'l'; }

    if (expression.getChildCount() > 1) { exp += this.generate(expression.getChild(1)); }
    return this.generate(expression.getChild(0)) + exp;
  }

  generateDrop(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 1);
    let exp = 'd';
    if (expression.getAttribute('type') === 'highest') { exp += 'h'; }
    if (expression.getAttribute('type') === 'lowest') { exp += 'l'; }

    if (expression.getChildCount() > 1) { exp += this.generate(expression.getChild(1)); }
    return this.generate(expression.getChild(0)) + exp;
  }

  generateCritical(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 1);
    let critical = 'c';
    if (expression.getAttribute('type') === 'success') { critical += 's'; }
    if (expression.getAttribute('type') === 'failure') { critical += 'f'; }
    if (expression.getChildCount() > 1) { critical += this.generate(expression.getChild(1)); }
    return this.generate(expression.getChild(0)) + critical;
  }

  generateReroll(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 1);
    let reroll = 'r';
    if (expression.getAttribute('once')) { reroll += 'o'; }
    if (expression.getChildCount() > 1) { reroll += this.generate(expression.getChild(1)); }
    return this.generate(expression.getChild(0)) + reroll;
  }

  generateSort(expression: Ast.ExpressionNode): string {
    this.expectChildCount(expression, 1);
    let sort = 's';
    if (expression.getAttribute('direction') === 'ascending') { sort += 'a'; }
    if (expression.getAttribute('direction') === 'descending') { sort += 'd'; }
    return this.generate(expression.getChild(0)) + sort;
  }

  private generateEqualityExpression(expression: Ast.ExpressionNode, operator: string): string {
    this.expectChildCount(expression, 1);
    if (expression.getChildCount() === 1) {
      return operator + this.generate(expression.getChild(0));
    } else {
      return this.generate(expression.getChild(0)) + ' ' + operator + ' ' + this.generate(expression.getChild(1));
    }
  }

  private generateCommaList(expression: Ast.ExpressionNode): string {
    let buffer = '';
    for (let x = 0; x < expression.getChildCount(); x++) {
      if (x > 0) { buffer += ', '; }
      buffer += this.generate(expression.getChild(x));
    }
    return buffer;
  }

  private generateWithParens(expression: Ast.ExpressionNode): string {
    if (expression.getChildCount() === 0) {
      return this.generate(expression);
    } else {
      return '(' + this.generate(expression) + ')';
    }
  }

  private expectChildCount(expression: Ast.ExpressionNode, count: number) {
    const findCount = expression.getChildCount();
    if (findCount < count) {
      throw new Error(`Expected ${expression.type} node to have ${count} children, but found ${findCount}.`);
    }
  }

  private applyDecorator (exp, type, defaultDecorator) {
    const decorator = (this.options.decorators && this.options.decorators[type]) || defaultDecorator;
    let decoratorLeft = '';
    let decoratorRight = decorator;
    if (decorator instanceof Array) {
      decoratorLeft = decorator.length >= 1 ? decorator[0] : '';
      decoratorRight = decorator.length >= 2 ? decorator[1] : '';
    }
    return `${decoratorLeft}${exp}${decoratorRight}`;
  }
}
