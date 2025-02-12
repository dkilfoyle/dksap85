import { AbstractSignatureHelpProvider } from "langium/lsp";
import { AsmServices } from "./asm-module.js";
import { AstNode, LangiumDocument, MaybePromise, DocumentationProvider, CommentProvider } from "langium";
import { SignatureHelp, SignatureHelpParams, SignatureHelpOptions } from "vscode-languageserver";
export declare class AsmSignatureHelpProvider extends AbstractSignatureHelpProvider {
    documentationProvider: DocumentationProvider;
    commentProvider: CommentProvider;
    currentSignature: SignatureHelp | undefined;
    constructor(services: AsmServices);
    provideSignatureHelp(document: LangiumDocument, params: SignatureHelpParams): MaybePromise<SignatureHelp | undefined>;
    protected getSignatureFromElement(element: AstNode): MaybePromise<SignatureHelp | undefined>;
    get signatureHelpOptions(): SignatureHelpOptions;
}
