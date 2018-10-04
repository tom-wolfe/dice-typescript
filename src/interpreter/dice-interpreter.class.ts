import * as Ast from '../ast';
import { DiceGenerator } from '../generator';
import { DefaultRandomProvider, RandomProvider } from '../random';
import { DefaultFunctionDefinitions } from './default-function-definitions';
import { DiceResult } from './dice-result.class';
import { InterpreterError } from './error-message.class';
import { FunctionDefinitionList } from './function-definition-list.class';
import { Interpreter } from './interpreter.interface';

interface SortedDiceRolls {
  rolls: Ast.ExpressionNode[];
  total: number;
}

export class DiceInterpreter implements Interpreter<DiceResult> {
  protected functions: FunctionDefinitionList;
  protected random: RandomProvider;
  protected generator: DiceGenerator;

  constructor(functions?: FunctionDefinitionList, random?: RandomProvider, generator?: DiceGenerator) {
    this.functions = DefaultFunctionDefinitions;
    (<any>Object).assign(this.functions, functions);
    this.random = random || new DefaultRandomProvider();
    this.generator = generator || new DiceGenerator();
  }

  interpret(expression: Ast.ExpressionNode): DiceResult {
    const exp = expression.copy();
    const errors: InterpreterError[] = [];
    const total = this.evaluate(exp, errors);
    const successes = this.countSuccesses(exp, errors);
    const fails = this.countFailures(exp, errors);
    const renderedExpression = this.generator.generate(exp);
    return new DiceResult(exp, renderedExpression, total, successes, fails, errors);
  }

  evaluate(expression: Ast.ExpressionNode, errors: InterpreterError[]): any {
    if (!expression) { errors.push(new InterpreterError('Unexpected null node reference found.', expression)); return 0; }
    if (expression.type === Ast.NodeType.DiceRoll) {
      return this.evaluateDiceRoll(expression, errors);
    } else if (expression.type === Ast.NodeType.Number) {
      return this.evaluateNumber(expression, errors);
    } else if (expression.type === Ast.NodeType.DiceSides) {
      return this.evaluateDiceSides(expression, errors);
    } else if (!expression.getAttribute('value')) {
      let value: any = 0;
      switch (expression.type) {
        case Ast.NodeType.Add: value = this.evaluateAdd(expression, errors); break;
        case Ast.NodeType.Subtract: value = this.evaluateSubtract(expression, errors); break;
        case Ast.NodeType.Multiply: value = this.evaluateMultiply(expression, errors); break;
        case Ast.NodeType.Divide: value = this.evaluateDivide(expression, errors); break;
        case Ast.NodeType.Modulo: value = this.evaluateModulo(expression, errors); break;
        case Ast.NodeType.Negate: value = this.evaluateNegate(expression, errors); break;
        case Ast.NodeType.Exponent: value = this.evaluateExponent(expression, errors); break;
        case Ast.NodeType.Dice: value = this.evaluateDice(expression, errors); break;
        case Ast.NodeType.Function: value = this.evaluateFunction(expression, errors); break;
        case Ast.NodeType.Group: value = this.evaluateGroup(expression, errors); break;
        case Ast.NodeType.Repeat: value = this.evaluateRepeat(expression, errors); break;
        case Ast.NodeType.Explode: value = this.evaluateExplode(expression, errors); break;
        case Ast.NodeType.Keep: value = this.evaluateKeep(expression, errors); break;
        case Ast.NodeType.Drop: value = this.evaluateDrop(expression, errors); break;
        case Ast.NodeType.Critical: value = this.evaluateCritical(expression, errors); break;
        case Ast.NodeType.Reroll: value = this.evaluateReroll(expression, errors); break;
        case Ast.NodeType.Sort: value = this.evaluateSort(expression, errors); break;
        case Ast.NodeType.Equal: value = this.evaluateEqual(expression, errors); break;
        case Ast.NodeType.Greater: value = this.evaluateGreater(expression, errors); break;
        case Ast.NodeType.GreaterOrEqual: value = this.evaluateGreaterOrEqual(expression, errors); break;
        case Ast.NodeType.Less: value = this.evaluateLess(expression, errors); break;
        case Ast.NodeType.LessOrEqual: value = this.evaluateLessOrEqual(expression, errors); break;
        default:
          errors.push(new InterpreterError(`Unrecognized node type '${expression.type}'.`, expression));
          return 0;
      }
      expression.setAttribute('value', value);
    }
    return expression.getAttribute('value');
  }

  evaluateAdd(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    return this.evaluate(expression.getChild(0), errors) + this.evaluate(expression.getChild(1), errors);
  }

  evaluateSubtract(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    return this.evaluate(expression.getChild(0), errors) - this.evaluate(expression.getChild(1), errors);
  }

  evaluateMultiply(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    return this.evaluate(expression.getChild(0), errors) * this.evaluate(expression.getChild(1), errors);
  }

  evaluateDivide(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    return this.evaluate(expression.getChild(0), errors) / this.evaluate(expression.getChild(1), errors);
  }

  evaluateModulo(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    return this.evaluate(expression.getChild(0), errors) % this.evaluate(expression.getChild(1), errors);
  }

  evaluateExponent(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    return Math.pow(this.evaluate(expression.getChild(0), errors), this.evaluate(expression.getChild(1), errors));
  }

  evaluateNegate(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 1, errors)) { return 0; }
    return -this.evaluate(expression.getChild(0), errors);
  }

  evaluateNumber(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return expression.getAttribute('value');
  }

  evaluateDiceSides(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return expression.getAttribute('value');
  }

  evaluateDiceRoll(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (expression.getAttribute('drop') !== true) {
      return expression.getAttribute('value');
    }
    return 0;
  }

  evaluateDice(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    const num = Math.round(this.evaluate(expression.getChild(0), errors));
    const sides = expression.getChild(1);
    expression.setAttribute('sides', this.evaluate(sides, errors));

    expression.clearChildren();

    let total = 0;
    for (let x = 0; x < num; x++) {
      const diceRoll = this.createDiceRoll(sides, errors);
      expression.addChild(diceRoll);
      total += this.evaluate(diceRoll, errors);
    }
    return total;
  }

  evaluateFunction(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    const fName = expression.getAttribute('name');
    if (Object.keys(this.functions).indexOf(fName) === -1) {
      errors.push(new InterpreterError(`Unknown function: ${fName}`, expression));
      return 0;
    }
    const result = this.functions[fName](this, expression, errors);
    return result;
  }

  evaluateGroup(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    let total = 0;
    expression.forEachChild(child => {
      total += this.evaluate(child, errors);
    });
    return total;
  }

  evaluateRepeat(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    const lhs = expression.getChild(0);
    const times = this.evaluate(expression.getChild(1), errors);

    const parent = expression.getParent();
    parent.removeChild(expression);

    let total = 0;
    for (let x = 0; x < times; x++) {
      const copy = lhs.copy();
      parent.addChild(copy);
      total += this.evaluate(copy, errors);
    }
    return total;
  }

  evaluateExplode(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 1, errors)) { return 0; }
    const dice = this.findDiceOrGroupNode(expression, errors);
    if (!dice) { return 0; }
    let condition: Ast.ExpressionNode;
    const penetrate = expression.getAttribute('penetrate');
    if (expression.getChildCount() > 1) {
      condition = expression.getChild(1);
    }

    this.evaluate(dice, errors);

    const newRolls: Ast.ExpressionNode[] = [];

    let total = 0;
    const sides = dice.getAttribute('sides');
    dice.forEachChild(die => {
      if (!die.getAttribute('drop')) {
        let dieValue = this.evaluate(die, errors);
        total += dieValue;
        while (condition && this.evaluateComparison(dieValue, condition, errors) || dieValue === sides) {
          die = this.createDiceRoll(sides, errors);
          dieValue = this.evaluate(die, errors);
          if (penetrate) { dieValue -= 1; }
          total += dieValue;
          newRolls.push(die);
        }
      }
    });

    newRolls.forEach(newRoll => dice.addChild(newRoll));
    return total;
  }

  evaluateKeep(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 1, errors)) { return 0; }
    const dice = this.findDiceOrGroupNode(expression, errors);
    if (!dice) { return 0; }
    const countTotal = (expression.getChildCount() > 1) ? this.evaluate(expression.getChild(1), errors) : 1;
    const type = expression.getAttribute('type');
    this.evaluate(dice, errors);

    const rolls = this.getSortedDiceRolls(dice, (type === 'lowest') ? 'ascending' : 'descending', errors).rolls;

    let count = 0;
    let total = 0;
    rolls.forEach(roll => {
      if (count < countTotal) {
        roll.setAttribute('drop', false);
        total += roll.getAttribute('value');
      } else {
        roll.setAttribute('drop', true);
      }
      count++;
    });
    return total;
  }

  evaluateDrop(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 1, errors)) { return 0; }
    const dice = this.findDiceOrGroupNode(expression, errors);
    if (!dice) { return 0; }
    const countTotal = (expression.getChildCount() > 1) ? this.evaluate(expression.getChild(1), errors) : 1;
    const type = expression.getAttribute('type');
    this.evaluate(dice, errors);

    const rolls = this.getSortedDiceRolls(dice, (type === 'lowest') ? 'ascending' : 'descending', errors).rolls;
    let count = 0;
    let total = 0;
    rolls.forEach(roll => {
      if (count < countTotal) {
        roll.setAttribute('drop', true);
      } else {
        roll.setAttribute('drop', false);
        total += roll.getAttribute('value');
      }
      count++;
    });
    return total;
  }

  evaluateCritical(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 1, errors)) { return 0; }
    const dice = this.findDiceOrGroupNode(expression, errors);
    if (!dice) { return 0; }
    const type = expression.getAttribute('type');

    let condition: Ast.ExpressionNode;
    if (expression.getChildCount() > 1) {
      condition = expression.getChild(1);
    } else {
      condition = Ast.Factory.create(Ast.NodeType.Equal);
      if (type === 'success') {
        this.expectChildCount(dice, 2, errors);
        condition.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', dice.getAttribute('sides')));
      } else {
        condition.addChild(Ast.Factory.create(Ast.NodeType.Number).setAttribute('value', 1));
      }
    }

    this.evaluate(dice, errors);

    let total = 0;
    dice.forEachChild((die) => {
      const dieValue = this.evaluate(die, errors);
      if (this.evaluateComparison(dieValue, condition, errors)) {
        die.setAttribute('critical', type);
        total += dieValue;
      }
    });

    return total;
  }

  evaluateReroll(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 1, errors)) { return 0; }
    const dice = this.findDiceOrGroupNode(expression, errors);
    if (!dice) { return 0; }
    let condition: Ast.ExpressionNode;
    const once = expression.getAttribute('once');

    if (expression.getChildCount() > 1) {
      condition = expression.getChild(1);
    }

    this.evaluate(dice, errors);

    let total = 0;
    const sides = dice.getAttribute('sides');
    dice.forEachChild(die => {
      if (!die.getAttribute('drop')) {
        let dieValue = this.evaluate(die, errors);
        while (condition && this.evaluateComparison(dieValue, condition, errors) || dieValue === 1) {
          dieValue = this.createDiceRollValue(sides, errors);
          if (once) { break; }
        }
        die.setAttribute('value', dieValue);
        total += dieValue;
      }
    });

    return total;
  }

  evaluateSort(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 1, errors)) { return 0; }
    const dice = this.findDiceOrGroupNode(expression, errors);
    if (!dice) { return 0; }
    const rolls = this.getSortedDiceRolls(dice, expression.getAttribute('direction'), errors);
    dice.clearChildren();
    rolls.rolls.forEach(roll => dice.addChild(roll));
    return rolls.total;
  }

  evaluateEqual(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return this.evaluateSuccess(expression, (l, r) => (l === r), errors);
  }

  evaluateGreater(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return this.evaluateSuccess(expression, (l, r) => (l > r), errors);
  }

  evaluateGreaterOrEqual(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return this.evaluateSuccess(expression, (l, r) => (l >= r), errors);
  }

  evaluateLess(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return this.evaluateSuccess(expression, (l, r) => (l < r), errors);
  }

  evaluateLessOrEqual(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return this.evaluateSuccess(expression, (l, r) => (l <= r), errors);
  }

  countSuccesses(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return this.countSuccessOrFailure(expression, die => die.getAttribute('success'), errors);
  }

  countFailures(expression: Ast.ExpressionNode, errors: InterpreterError[]): number {
    return this.countSuccessOrFailure(expression, die => !die.getAttribute('success'), errors);
  }

  private countSuccessOrFailure(expression: Ast.ExpressionNode,
    condition: (die: Ast.ExpressionNode) => boolean, errors: InterpreterError[]): number {
    let total = 0;
    if (expression.type === Ast.NodeType.Dice || expression.type === Ast.NodeType.Group) {
      expression.forEachChild(die => {
        if (!die.getAttribute('drop') && condition(die)) { total++; }
      });
    } else {
      expression.forEachChild(die => {
        total += this.countSuccessOrFailure(die, condition, errors);
      });
    }
    return total;
  }

  private expectChildCount(expression: Ast.ExpressionNode, count: number, errors: InterpreterError[]): boolean {
    const findCount = expression.getChildCount();
    if (findCount < count) {
      const err = new InterpreterError(`Expected ${expression.type} node to have ${count} children, but found ${findCount}.`, expression);
      errors.push(err);
      return false;
    }
    return true;
  }

  private evaluateComparison(lhs: number, expression: Ast.ExpressionNode, errors: InterpreterError[]): boolean {
    if (!this.expectChildCount(expression, 1, errors)) { return false; }
    switch (expression.type) {
      case Ast.NodeType.Equal: return lhs === this.evaluate(expression.getChild(0), errors);
      case Ast.NodeType.Greater: return lhs > this.evaluate(expression.getChild(0), errors);
      case Ast.NodeType.GreaterOrEqual: return lhs >= this.evaluate(expression.getChild(0), errors);
      case Ast.NodeType.Less: return lhs < this.evaluate(expression.getChild(0), errors);
      case Ast.NodeType.LessOrEqual: return lhs <= this.evaluate(expression.getChild(0), errors);
      default:
        errors.push(new InterpreterError(`Unrecognized comparison operator '${expression.type}'.`, expression));
        return false;
    }
  }

  evaluateSuccess(expression: Ast.ExpressionNode, compare: (lhs: number, rhs: number) => boolean, errors: InterpreterError[]): number {
    if (!this.expectChildCount(expression, 2, errors)) { return 0; }
    const rhv = this.evaluate(expression.getChild(1), errors);

    let total = 0;
    const diceOrGroup = this.findDiceOrGroupNode(expression, errors);
    if (!diceOrGroup) { return 0; }
    diceOrGroup.forEachChild(die => {
      if (!die.getAttribute('drop')) {
        const val = this.evaluate(die, errors);
        const res = compare(this.evaluate(die, errors), rhv);
        die.setAttribute('success', res);
        if (res) { total += val; }
      }
    });

    return total;
  }

  private findDiceOrGroupNode(expression: Ast.ExpressionNode, errors: InterpreterError[]): Ast.ExpressionNode {
    if (expression.type === Ast.NodeType.Dice || expression.type === Ast.NodeType.Group) {
      return expression;
    }
    if (expression.getChildCount() < 1) {
      errors.push(new InterpreterError('Missing dice/group node.', expression));
      return null;
    }
    const child = expression.getChild(0);
    this.evaluate(child, errors);
    return this.findDiceOrGroupNode(child, errors);
  }

  private getSortedDiceRolls(dice: Ast.ExpressionNode, direction: string, errors: InterpreterError[]): SortedDiceRolls {
    const output: SortedDiceRolls = { rolls: [], total: 0 };

    dice.forEachChild(die => {
      output.rolls.push(die);
      output.total += this.evaluate(die, errors);
    });

    let sortOrder;
    if (direction === 'descending') {
      sortOrder = (a, b) => b.getAttribute('value') - a.getAttribute('value');
    } else if (direction === 'ascending') {
      sortOrder = (a, b) => a.getAttribute('value') - b.getAttribute('value');
    } else {
      errors.push(new InterpreterError(`Unknown sort direction: ${direction}. Expected 'ascending' or 'descending'.`, dice));
    }

    output.rolls = output.rolls.sort(sortOrder);
    return output;
  }

  private createDiceRoll(sides: Ast.ExpressionNode | number, errors: InterpreterError[]): Ast.ExpressionNode {
    const sidesValue = sides instanceof Ast.ExpressionNode
      ? sides.getAttribute('value')
      : sides;
    const diceRoll = this.createDiceRollValue(sides, errors);
    return Ast.Factory.create(Ast.NodeType.DiceRoll)
      .setAttribute('value', diceRoll)
      .setAttribute('drop', false);
  }

  private createDiceRollValue(sides: Ast.ExpressionNode | number, errors: InterpreterError[]): number {
    let minValue = 1, maxValue = 0;

    const sidesValue = sides instanceof Ast.ExpressionNode
      ? sides.getAttribute('value')
      : sides;

    if (sidesValue === 'fate') {
      minValue = -1; maxValue = 1;
    } else {
      maxValue = Math.round(sides instanceof Ast.ExpressionNode ? this.evaluate(sides, errors) : sides);
    }
    return this.random.numberBetween(minValue, maxValue);
  }
}
