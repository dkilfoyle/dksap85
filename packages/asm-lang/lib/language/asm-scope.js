import { AstUtils, Cancellation, DefaultScopeComputation, DefaultScopeProvider, interruptAndCheck, MultiMap } from "langium";
import { isLabel } from "./generated/ast.js";
export class AsmScopeProvider extends DefaultScopeProvider {
    createScope(elements, outerScope) {
        return super.createScope(elements, outerScope, { caseInsensitive: true });
    }
}
export class AsmScopeComputation extends DefaultScopeComputation {
    constructor(services) {
        super(services);
    }
    async computeLocalScopes(document, cancelToken = Cancellation.CancellationToken.None) {
        const rootNode = document.parseResult.value;
        const scopes = new MultiMap();
        // Here we navigate the full AST - local scopes shall be available in the whole document
        for (const node of AstUtils.streamAllContents(rootNode)) {
            await interruptAndCheck(cancelToken);
            this.processNode(node, document, scopes);
        }
        return scopes;
    }
    /**
     * Process a single node during scopes computation. The default implementation makes the node visible
     * in the subtree of its container (if the node has a name). Override this method to change this,
     * e.g. by increasing the visibility to a higher level in the AST.
     */
    processNode(node, document, scopes) {
        // boost each label out of Line scope to Program scope
        const container = isLabel(node) ? node.$container.$container : node.$container;
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name) {
                scopes.add(container, this.descriptions.createDescription(node, name, document));
            }
        }
    }
}
