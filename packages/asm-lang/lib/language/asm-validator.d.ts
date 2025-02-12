import type { ValidationAcceptor } from "langium";
import { Instr, Label } from "./generated/ast.js";
import type { AsmServices } from "./asm-module.js";
/**
 * Register custom validation checks.
 */
export declare function registerValidationChecks(services: AsmServices): void;
/**
 * Implementation of custom validations.
 */
export declare class AsmValidator {
    checkInstrArgumentsInRange(instr: Instr, accept: ValidationAcceptor): void;
    checkLabelSize(label: Label, accept: ValidationAcceptor): void;
}
