import type { ValidationAcceptor, ValidationChecks } from "langium";
import type { SccAstType, FunctionDeclaration } from "./generated/ast.js";
import type { SccServices } from "./scc-module.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SccServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.SccValidator;
  const checks: ValidationChecks<SccAstType> = {
    FunctionDeclaration: validator.checkPersonStartsWithCapital,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SccValidator {
  checkPersonStartsWithCapital(person: FunctionDeclaration, accept: ValidationAcceptor): void {
    if (person.name) {
      const firstChar = person.name.substring(0, 1);
      if (firstChar.toUpperCase() !== firstChar) {
        accept("warning", "Person name should start with a capital.", { node: person, property: "name" });
      }
    }
  }
}
