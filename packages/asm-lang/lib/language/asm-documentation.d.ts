import { AstNode, DocumentationProvider } from "langium";
export declare class AsmDocumentationProvider implements DocumentationProvider {
    getDocumentation(node: AstNode): string;
}
