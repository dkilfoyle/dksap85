export interface IInstruction {
    instr: string;
    code: number;
    arg1: string;
    arg2: string;
    bytes: number;
    flags: string;
    stages: number;
    help: string;
}
export declare const opcodes: Record<string, IInstruction>;
export declare const instructionInfo: Record<string, IInstruction>;
export declare const operationInfo: Record<string, {
    arg1: string;
    arg2: string;
    bytes: number;
    help: string;
}>;
