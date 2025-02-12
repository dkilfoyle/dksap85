import { CstNode, DefaultValueConverter, GrammarAST, ValueType } from "langium";
export declare class AsmValueConverter extends DefaultValueConverter {
    runConverter(rule: GrammarAST.AbstractRule, input: string, cstNode: CstNode): ValueType;
}
