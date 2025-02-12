import { AbstractSignatureHelpProvider } from "langium/lsp";
import { CstUtils } from "langium";
import { SignatureInformation, ParameterInformation } from "vscode-languageserver";
import { isInstruction } from "./generated/ast.js";
import { operationInfo } from "./opcodes.js";
export class AsmSignatureHelpProvider extends AbstractSignatureHelpProvider {
    documentationProvider;
    commentProvider;
    currentSignature;
    constructor(services) {
        super();
        this.documentationProvider = services.documentation.DocumentationProvider;
        this.commentProvider = services.documentation.CommentProvider;
    }
    provideSignatureHelp(document, params) {
        const cst = document.parseResult.value.$cstNode;
        if (cst) {
            const curOffset = document.textDocument.offsetAt(params.position);
            const nodeBefore = CstUtils.findLeafNodeBeforeOffset(cst, curOffset)?.astNode;
            const containterNode = nodeBefore?.$container;
            if (params.context?.triggerCharacter == "\n") {
                this.currentSignature = undefined;
                return undefined;
            }
            else if (this.currentSignature != undefined && isInstruction(containterNode)) {
                const paramNum = containterNode.$cstNode.text.includes(",") ? 1 : 0;
                this.currentSignature.activeParameter = paramNum;
                return this.currentSignature;
            }
            else if (isInstruction(containterNode)) {
                const sig = this.getSignatureFromElement(containterNode);
                return sig;
            }
            else
                return this.currentSignature;
        }
        // const nodeAt = CstUtils.findDeclarationNodeAtOffset(cst, curOffset)?.astNode;
        return undefined;
    }
    getSignatureFromElement(element) {
        if (isInstruction(element)) {
            const { arg1, arg2, help } = operationInfo[element.op.opname.toUpperCase()];
            const args = [arg1, arg2].filter((x) => x != "");
            let title = element.op.opname + " ";
            const params = args.map((arg, i) => {
                const start = title.length;
                title += arg;
                const end = title.length;
                if (i < args.length - 1)
                    title += ", ";
                return ParameterInformation.create([start, end]);
            });
            const sig = SignatureInformation.create(title, help, ...params);
            const siginfo = { signatures: [sig], activeParameter: 0, activeSignature: 0 };
            this.currentSignature = siginfo;
            return siginfo;
        }
        return undefined;
    }
    get signatureHelpOptions() {
        return {
            triggerCharacters: [" "],
            retriggerCharacters: [",", "\n"],
        };
    }
}
