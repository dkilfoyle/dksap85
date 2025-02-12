import { AstNode } from "langium";
export declare const assember: (root: AstNode) => {
    bytes: Uint8Array<ArrayBuffer>;
    identifierMap: Record<string, number>;
    lineAddressMap: Record<number, number>;
};
