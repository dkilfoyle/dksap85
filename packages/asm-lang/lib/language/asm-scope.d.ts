import type { AstNode, AstNodeDescription, LangiumDocument, PrecomputedScopes, Scope } from "langium";
import { Cancellation, DefaultScopeComputation, DefaultScopeProvider } from "langium";
import { AsmServices } from "./asm-module.js";
export declare class AsmScopeProvider extends DefaultScopeProvider {
    createScope(elements: Iterable<AstNodeDescription>, outerScope?: Scope): Scope;
}
export declare class AsmScopeComputation extends DefaultScopeComputation {
    constructor(services: AsmServices);
    computeLocalScopes(document: LangiumDocument, cancelToken?: Cancellation.CancellationToken): Promise<PrecomputedScopes>;
    /**
     * Process a single node during scopes computation. The default implementation makes the node visible
     * in the subtree of its container (if the node has a name). Override this method to change this,
     * e.g. by increasing the visibility to a higher level in the AST.
     */
    protected processNode(node: AstNode, document: LangiumDocument, scopes: PrecomputedScopes): void;
}
