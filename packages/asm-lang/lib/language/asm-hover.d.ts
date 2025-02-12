import { AstNode, DocumentationProvider, LangiumDocument, MaybePromise } from "langium";
import { Hover, HoverParams } from "vscode-languageclient";
import { AstNodeHoverProvider, LangiumServices } from "langium/lsp";
export declare class AsmHoverProvider extends AstNodeHoverProvider {
    documentationProvider: DocumentationProvider;
    constructor(services: LangiumServices);
    getHoverContent(document: LangiumDocument, params: HoverParams): MaybePromise<Hover | undefined>;
    protected getAstNodeHoverContent(node: AstNode): Hover | undefined;
}
