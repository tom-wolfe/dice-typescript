import { FunctionDefinitionList } from "./function-definition-list";


export const DefaultFunctionDefinitions = new FunctionDefinitionList();

DefaultFunctionDefinitions["floor"] = (interpreter, functionNode, errors) => {
    return Math.floor(interpreter.evaluate(functionNode.getChild(0), errors));
};

DefaultFunctionDefinitions["ceil"] = (interpreter, functionNode, errors) => {
    return Math.ceil(interpreter.evaluate(functionNode.getChild(0), errors));
};

DefaultFunctionDefinitions["abs"] = (interpreter, functionNode, errors) => {
    return Math.abs(interpreter.evaluate(functionNode.getChild(0), errors));
};

DefaultFunctionDefinitions["round"] = (interpreter, functionNode, errors) => {
    return Math.round(interpreter.evaluate(functionNode.getChild(0), errors));
};

DefaultFunctionDefinitions["sqrt"] = (interpreter, functionNode, errors) => {
    return Math.sqrt(interpreter.evaluate(functionNode.getChild(0), errors));
};
