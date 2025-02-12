import { DefaultCompletionProvider } from "langium/lsp";
import { CompletionItemKind } from "vscode-languageserver";
import { GrammarAST } from "langium";
export class AsmCompletionProvider extends DefaultCompletionProvider {
    documents;
    constructor(services) {
        super(services);
        this.documents = services.shared.workspace.LangiumDocuments;
    }
    completionFor(context, next, acceptor) {
        if (GrammarAST.isKeyword(next.feature) && next.type == "Operation") {
            const doc = this.documentationProvider.getDocumentation({
                $type: "Instr",
                op: { opname: next.feature.value },
            });
            return acceptor(context, {
                kind: CompletionItemKind.Field,
                label: next.feature.value,
                insertText: next.feature.value,
                documentation: doc,
            });
        }
        else
            return super.completionFor(context, next, acceptor);
    }
}
