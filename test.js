const { Dice } = require("./dist");

const dice = new Dice(null, null, {renderExpressionDecorators: true});
console.log(dice.roll("2d20").renderedExpression);
console.log(dice.roll("4d4>=3").renderedExpression);
