import { LangiumDocument } from "langium";
import { FoldingRangeProvider } from "langium/lsp";
import { FoldingRange } from "vscode-languageserver";
export type FoldingRangeAcceptor = (foldingRange: FoldingRange) => void;
export declare class AsmFoldProvider implements FoldingRangeProvider {
    constructor();
    getFoldingRanges(document: LangiumDocument): FoldingRange[];
    protected collectFolding(document: LangiumDocument, acceptor: FoldingRangeAcceptor): void;
}
