import { FunctionDefinitionList } from "./function-definition-list";


export const DefaultFunctionDefinitions = new FunctionDefinitionList();

DefaultFunctionDefinitions["floor"] = (interpreter, functionNode) => {
    return Math.floor(interpreter.evaluate(functionNode.getChild(0)));
};

DefaultFunctionDefinitions["ceil"] = (interpreter, functionNode) => {
    return Math.ceil(interpreter.evaluate(functionNode.getChild(0)));
};

DefaultFunctionDefinitions["abs"] = (interpreter, functionNode) => {
    return Math.abs(interpreter.evaluate(functionNode.getChild(0)));
};

DefaultFunctionDefinitions["round"] = (interpreter, functionNode) => {
    return Math.round(interpreter.evaluate(functionNode.getChild(0)));
};

DefaultFunctionDefinitions["sqrt"] = (interpreter, functionNode) => {
    return Math.sqrt(interpreter.evaluate(functionNode.getChild(0)));
};
