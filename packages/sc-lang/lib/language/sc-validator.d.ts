import type { ValidationAcceptor } from "langium";
import type { FunctionDeclaration } from "./generated/ast.js";
import type { ScServices } from "./sc-module.js";
/**
 * Register custom validation checks.
 */
export declare function registerValidationChecks(services: ScServices): void;
/**
 * Implementation of custom validations.
 */
export declare class ScValidator {
    checkPersonStartsWithCapital(person: FunctionDeclaration, accept: ValidationAcceptor): void;
}
