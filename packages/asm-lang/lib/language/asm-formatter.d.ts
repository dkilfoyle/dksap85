import { AstNode } from "langium";
import { AbstractFormatter } from "langium/lsp";
export declare class AsmFormatter extends AbstractFormatter {
    hasLabel: boolean;
    instrLength: number;
    protected format(node: AstNode): void;
    format1(node: AstNode): void;
    format2(node: AstNode): void;
}
