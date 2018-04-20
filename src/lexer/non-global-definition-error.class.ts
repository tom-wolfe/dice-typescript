export class NonGlobalDefinitionError extends Error {
    constructor() {
        super('TokenDefinition pattern RegExp must be global.');
    }
}
