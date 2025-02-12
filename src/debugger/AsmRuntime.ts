import { AsmDocumentChange } from "../lsp/asm/language/main-browser";
import { AsmDebugSession } from "./AsmDebugSession";
import { BreakpointEvent, OutputEvent, StoppedEvent, TerminatedEvent } from "./dap/events";
import { emulator } from "../sim/Computer";
import { EmulatorWebviewPanel } from "../components/EmulatorWebviewPanel";
import { MemoryWebviewPanel } from "../components/MemoryWebviewPanel";
import { printOutputChannel } from "./debugger";

interface IAsmBreakpoint {
  id: number;
  line: number;
  verified: boolean;
}

interface IStackFrame {
  index: number;
  name: string;
  file: string;
  line: number;
}

type IStepMode = "stepInto" | "stepOut" | "stepOver" | "continue";
type IStepResult = IStepMode | "stop";

export const compiledDocs: Record<string, AsmDocumentChange> = {};

export class AsmRuntime {
  // RUNTIME is zero based positions
  private _breakPoints = new Map<string, IAsmBreakpoint[]>();
  private _breakpointId = 1;
  public asmSource?: AsmDocumentChange;
  private _debugger?: AsmDebugSession;
  public frames: IStackFrame[] = [];
  public animateRunning = false;
  public runUntilReturnFrom = "";

  constructor(public logLevel = 1) {
    console.log("AsmRuntime constructed");
  }

  log(msg: string) {
    if (this.logLevel == 1) console.log(`RUNTIME: ${msg}`);
  }

  setDebugSession(dap: AsmDebugSession) {
    this._debugger = dap;
  }

  setSource(program: string) {
    // const fn = `file://${program.replace("\\", "/").replace("\\", "/")}`;
    this.asmSource = compiledDocs[program];
    if (!this.asmSource) {
      console.log(compiledDocs);
      throw Error(`No compiled result for ${program}`);
    }
  }

  getMemory(memoryReference: string) {
    if (memoryReference == "sp") {
      return Array.from(emulator.mem.ram.slice(emulator.regs.sp, emulator.regs.sp + 100));
    }
    return [];
  }

  bdos(c: number, de: number) {
    if (c == 9) {
      // print from de until $
      const dollarAddr = emulator.mem.ram.slice(de).findIndex((x) => String.fromCharCode(x) == "$");
      const str = String.fromCharCode(...emulator.mem.ram.slice(de, de + dollarAddr));
      str.split("\r\n").forEach((line) => printOutputChannel(line));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  start(program: string, _stopOnEntry: boolean) {
    if (!this._debugger) throw Error("No debug session set");
    if (!this.asmSource) throw Error("No source");
    this.runUntilReturnFrom = "";

    MemoryWebviewPanel.sendLabels(this.asmSource.identifierMap);

    this.frames = [
      {
        index: 0,
        file: this.asmSource.uri,
        line: 0,
        name: "__main__",
      },
    ];

    this.log(`Asm runtime start uri=${this.asmSource.uri}`);
    emulator.reset(Array.from(this.asmSource.machineCode));
    emulator.ctrl.bdos = this.bdos;

    this.setCurrentLine();
    this.verifyBreakpoints(program);
    this.stop("entry", `Runtime started: machine code ${this.asmSource.machineCode.length} bytes`);
  }

  updateUI() {
    // if (emulator.states.length == 1) debugger;
    EmulatorWebviewPanel.sendComputerState(emulator.states);
    MemoryWebviewPanel.sendMemory(Array.from(emulator.mem.ram));
    MemoryWebviewPanel.sendPointers({
      sp: emulator.regs.sp,
      sb: emulator.regs.stackBase || 0,
      pc: emulator.regs.pc,
      hl: emulator.regs.hl,
    });
  }

  stop(type: "step" | "hlt" | "breakpoint" | "entry", output: string): IStepResult {
    switch (type) {
      case "entry":
        this._debugger!.sendEvent(new StoppedEvent("entry", AsmDebugSession.THREAD_ID));
        break;
      case "step":
        this._debugger!.sendEvent(new StoppedEvent("step", AsmDebugSession.THREAD_ID));
        break;
      case "hlt":
        this._debugger!.sendEvent(new TerminatedEvent());
        break;
      case "breakpoint":
        this._debugger!.sendEvent(new StoppedEvent("breakpoint", AsmDebugSession.THREAD_ID));
        break;
    }
    this._debugger!.sendEvent(new OutputEvent(`${output}\n`));

    this.updateUI();

    return "stop";
  }

  step(mode: IStepMode): IStepResult {
    this.log(`${mode} line ${this.frames[0].line + 1}, PC=${emulator.regs.pc}, Instr=${emulator.mem.ram.at(emulator.regs.pc)}`);
    emulator.step();

    if (this.animateRunning) {
      // await this.updateUI();
    }

    switch (emulator.ir.out) {
      case 0xcd:
      case 0xf4:
      case 0xfc:
      case 0xc4:
      case 0xcc:
      case 0xe4:
      case 0xec:
      case 0xd4:
      case 0xdc:
        if (!emulator.ctrl.skipCall) {
          // call or conditional call
          const label = Object.entries(this.asmSource!.identifierMap).find(([, addr]) => addr == emulator.regs.pc);
          const name = label ? label[0] : "unknown";
          this.frames.unshift({
            name,
            file: this.asmSource!.uri,
            line: 0,
            index: this.frames.length - 1,
          });
          this.setCurrentLine();
          if (mode != "stepInto") {
            if (mode != "continue" && this.runUntilReturnFrom == "") this.runUntilReturnFrom = this.frames[0].name;
            return "continue";
          }
        } else this.setCurrentLine();
        break;
      case 0xc9: //ret{}
        {
          const name = this.frames.shift()!.name;
          this.setCurrentLine();
          if (mode != "stepInto" && this.runUntilReturnFrom == name) {
            this.runUntilReturnFrom = "";
            return this.stop("step", `Stepped out of ${name} at PC = ${emulator.regs.pc - 1}`);
          }
        }
        break;
      case 0x76: // hlt
        this.setCurrentLine();
        return this.stop("hlt", `HLT at PC = ${emulator.regs.pc - 1}`);
      default:
        this.setCurrentLine();
    }

    if (this.isBreakpoint()) {
      return this.stop("breakpoint", `Hit breakpoint at PC=${emulator.regs.pc}`);
    }

    if (mode == "continue") return "continue";
    else {
      return this.stop("step", `Step: new PC = ${emulator.regs.pc}, cycles = ${emulator.states.length / 2}`);
    }
  }

  isBreakpoint() {
    if (!this.asmSource) throw Error("isBreakpoint no source");
    const curLine = this.frames[0].line;
    const bps = this._breakPoints.get(this.asmSource.uri.replace("file:///", "\\").replace("/", "\\"));
    return bps?.find((bp) => bp.line == curLine);
  }

  setCurrentLine() {
    const pc = emulator.regs.pc;
    const line = Object.entries(this.asmSource!.lineAddressMap).find(([, address]) => address == pc);
    if (line) this.frames[0].line = parseInt(line[0]);
  }

  run(mode: IStepMode) {
    let stepResult: IStepResult = mode;
    let steps = 0;
    do {
      stepResult = this.step(stepResult);
      steps++;
    } while (stepResult == "continue");
    if (steps > 1) this._debugger!.sendEvent(new OutputEvent(`Asm runtime: Run ${steps} steps, result ${stepResult}\n`));
  }

  public setBreakPoint(path: string, line: number): IAsmBreakpoint {
    const bp = <IAsmBreakpoint>{ verified: false, line, id: this._breakpointId++ };
    let bps = this._breakPoints.get(path);
    if (!bps) {
      bps = new Array<IAsmBreakpoint>();
      this._breakPoints.set(path, bps);
    }
    bps.push(bp);

    this.verifyBreakpoints(path);

    return bp;
  }

  verifyBreakpoints(path: string) {
    const bps = this._breakPoints.get(path);
    if (bps) {
      bps.forEach((bp) => {
        if (!this.asmSource) throw Error("VerityBreakpoints no source");
        if (this.asmSource.lineAddressMap[bp.line]) {
          // only instruction lines appear in lineAddressMap
          bp.verified = true;
          this._debugger?.sendEvent(new BreakpointEvent("changed", { verified: bp.verified, id: bp.id }));
        }
      });
    }
  }

  public clearBreakPoint(path: string, line: number): IAsmBreakpoint | undefined {
    const bps = this._breakPoints.get(path);
    if (bps) {
      const index = bps.findIndex((bp) => bp.line === line);
      if (index >= 0) {
        const bp = bps[index];
        bps.splice(index, 1);
        return bp;
      }
    }
    return undefined;
  }

  public clearBreakpoints(path: string): void {
    this._breakPoints.delete(path);
  }

  public stack() {
    return this.frames;
  }
}

export const asmRuntime = new AsmRuntime();
