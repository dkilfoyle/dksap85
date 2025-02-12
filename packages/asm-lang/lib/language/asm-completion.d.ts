import { LangiumDocuments, MaybePromise } from "langium";
import { CompletionAcceptor, CompletionContext, DefaultCompletionProvider, LangiumServices, NextFeature } from "langium/lsp";
export declare class AsmCompletionProvider extends DefaultCompletionProvider {
    protected readonly documents: LangiumDocuments;
    constructor(services: LangiumServices);
    protected completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): MaybePromise<void>;
}
