/******************************************************************************
 * This file was generated by langium-cli 3.3.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/
import { AbstractAstReflection } from 'langium';
export const ScTerminals = {
    WS: /\s+/,
    ID: /[_a-zA-Z][\w_]*/,
    NUMBER: /[0-9]+(\.[0-9]+)?/,
    STRING: /"[^"]*"/,
    ML_COMMENT: /\/\*[\s\S]*?\*\//,
    SL_COMMENT: /\/\/[^\n\r]*/,
};
export const Definition = 'Definition';
export function isDefinition(item) {
    return reflection.isInstance(item, Definition);
}
export const Expression = 'Expression';
export function isExpression(item) {
    return reflection.isInstance(item, Expression);
}
export const NamedElement = 'NamedElement';
export function isNamedElement(item) {
    return reflection.isInstance(item, NamedElement);
}
export const Statement = 'Statement';
export function isStatement(item) {
    return reflection.isInstance(item, Statement);
}
export const AssignmentStatement = 'AssignmentStatement';
export function isAssignmentStatement(item) {
    return reflection.isInstance(item, AssignmentStatement);
}
export const BinaryExpression = 'BinaryExpression';
export function isBinaryExpression(item) {
    return reflection.isInstance(item, BinaryExpression);
}
export const Block = 'Block';
export function isBlock(item) {
    return reflection.isInstance(item, Block);
}
export const CharExpression = 'CharExpression';
export function isCharExpression(item) {
    return reflection.isInstance(item, CharExpression);
}
export const ForStatement = 'ForStatement';
export function isForStatement(item) {
    return reflection.isInstance(item, ForStatement);
}
export const FunctionDeclaration = 'FunctionDeclaration';
export function isFunctionDeclaration(item) {
    return reflection.isInstance(item, FunctionDeclaration);
}
export const IfStatement = 'IfStatement';
export function isIfStatement(item) {
    return reflection.isInstance(item, IfStatement);
}
export const MemberCall = 'MemberCall';
export function isMemberCall(item) {
    return reflection.isInstance(item, MemberCall);
}
export const NumberExpression = 'NumberExpression';
export function isNumberExpression(item) {
    return reflection.isInstance(item, NumberExpression);
}
export const Parameter = 'Parameter';
export function isParameter(item) {
    return reflection.isInstance(item, Parameter);
}
export const Program = 'Program';
export function isProgram(item) {
    return reflection.isInstance(item, Program);
}
export const ReturnStatement = 'ReturnStatement';
export function isReturnStatement(item) {
    return reflection.isInstance(item, ReturnStatement);
}
export const TypeReference = 'TypeReference';
export function isTypeReference(item) {
    return reflection.isInstance(item, TypeReference);
}
export const UnaryExpression = 'UnaryExpression';
export function isUnaryExpression(item) {
    return reflection.isInstance(item, UnaryExpression);
}
export const VariableDeclaration = 'VariableDeclaration';
export function isVariableDeclaration(item) {
    return reflection.isInstance(item, VariableDeclaration);
}
export const WhileStatement = 'WhileStatement';
export function isWhileStatement(item) {
    return reflection.isInstance(item, WhileStatement);
}
export class ScAstReflection extends AbstractAstReflection {
    getAllTypes() {
        return [AssignmentStatement, BinaryExpression, Block, CharExpression, Definition, Expression, ForStatement, FunctionDeclaration, IfStatement, MemberCall, NamedElement, NumberExpression, Parameter, Program, ReturnStatement, Statement, TypeReference, UnaryExpression, VariableDeclaration, WhileStatement];
    }
    computeIsSubtype(subtype, supertype) {
        switch (subtype) {
            case AssignmentStatement:
            case Expression:
            case ForStatement:
            case IfStatement:
            case ReturnStatement:
            case WhileStatement: {
                return this.isSubtype(Statement, supertype);
            }
            case BinaryExpression:
            case CharExpression:
            case MemberCall:
            case NumberExpression:
            case UnaryExpression: {
                return this.isSubtype(Expression, supertype);
            }
            case FunctionDeclaration: {
                return this.isSubtype(Definition, supertype) || this.isSubtype(NamedElement, supertype);
            }
            case NamedElement: {
                return this.isSubtype(Definition, supertype) || this.isSubtype(Statement, supertype);
            }
            case Parameter:
            case VariableDeclaration: {
                return this.isSubtype(NamedElement, supertype);
            }
            default: {
                return false;
            }
        }
    }
    getReferenceType(refInfo) {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'AssignmentStatement:varRef': {
                return VariableDeclaration;
            }
            case 'MemberCall:element': {
                return NamedElement;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }
    getTypeMetaData(type) {
        switch (type) {
            case AssignmentStatement: {
                return {
                    name: AssignmentStatement,
                    properties: [
                        { name: 'value' },
                        { name: 'varRef' }
                    ]
                };
            }
            case BinaryExpression: {
                return {
                    name: BinaryExpression,
                    properties: [
                        { name: 'left' },
                        { name: 'operator' },
                        { name: 'right' }
                    ]
                };
            }
            case Block: {
                return {
                    name: Block,
                    properties: [
                        { name: 'statements', defaultValue: [] }
                    ]
                };
            }
            case CharExpression: {
                return {
                    name: CharExpression,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case ForStatement: {
                return {
                    name: ForStatement,
                    properties: [
                        { name: 'block' },
                        { name: 'condition' },
                        { name: 'counter' },
                        { name: 'execution' }
                    ]
                };
            }
            case FunctionDeclaration: {
                return {
                    name: FunctionDeclaration,
                    properties: [
                        { name: 'body' },
                        { name: 'name' },
                        { name: 'parameters', defaultValue: [] },
                        { name: 'returnType', defaultValue: false }
                    ]
                };
            }
            case IfStatement: {
                return {
                    name: IfStatement,
                    properties: [
                        { name: 'block' },
                        { name: 'condition' },
                        { name: 'elseBlock' }
                    ]
                };
            }
            case MemberCall: {
                return {
                    name: MemberCall,
                    properties: [
                        { name: 'arguments', defaultValue: [] },
                        { name: 'element' },
                        { name: 'explicitOperationCall', defaultValue: false }
                    ]
                };
            }
            case NumberExpression: {
                return {
                    name: NumberExpression,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case Parameter: {
                return {
                    name: Parameter,
                    properties: [
                        { name: 'name' },
                        { name: 'type' }
                    ]
                };
            }
            case Program: {
                return {
                    name: Program,
                    properties: [
                        { name: 'definitions', defaultValue: [] }
                    ]
                };
            }
            case ReturnStatement: {
                return {
                    name: ReturnStatement,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case TypeReference: {
                return {
                    name: TypeReference,
                    properties: [
                        { name: 'primitive' }
                    ]
                };
            }
            case UnaryExpression: {
                return {
                    name: UnaryExpression,
                    properties: [
                        { name: 'operator' },
                        { name: 'value' }
                    ]
                };
            }
            case VariableDeclaration: {
                return {
                    name: VariableDeclaration,
                    properties: [
                        { name: 'assignment', defaultValue: false },
                        { name: 'name' },
                        { name: 'type' },
                        { name: 'value' }
                    ]
                };
            }
            case WhileStatement: {
                return {
                    name: WhileStatement,
                    properties: [
                        { name: 'block' },
                        { name: 'condition' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    properties: []
                };
            }
        }
    }
}
export const reflection = new ScAstReflection();
