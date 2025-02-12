export type AsmDocumentChange = {
    uri: string;
    content: string;
    machineCode: Uint8Array;
    identifierMap: Record<string, number>;
    lineAddressMap: Record<number, number>;
};
