import { ExtensionConfig, LanguageClientConfig } from "monaco-editor-wrapper";
import SccLanguageConfig from "./language-configuration.json?raw";
import SccTmSyntax from "./syntaxes/scc.tmLanguage.json?raw";

export const getSccLanguageClientConfig = (): LanguageClientConfig => {
  // vite does not extract the worker properly if it is URL is a variable
  const lsWorker = new Worker(new URL("./language/main-browser", import.meta.url), {
    type: "module",
    name: "Scc Language Server",
  });

  return {
    name: "scc",
    connection: {
      options: {
        $type: "WorkerDirect",
        worker: lsWorker,
      },
    },
    clientOptions: {
      documentSelector: ["scc"], // the language id, NOT extension
    },
  };
};

const getSccExtensionFiles = () => {
  const files = new Map<string, string | URL>();
  files.set(`/scc-configuration.json`, SccLanguageConfig);
  files.set(`/scc-grammar.json`, SccTmSyntax);
  return files;
};

export const getSccLanguageExtension = (): ExtensionConfig => {
  return {
    config: {
      name: "scc-language-extension",
      publisher: "DK",
      version: "1.0.0",
      engines: {
        vscode: "*",
      },
      contributes: {
        languages: [
          {
            id: "scc",
            extensions: [".sc", ".c"],
            aliases: ["scc", "Scc", "SCC"],
            configuration: `./scc-configuration.json`,
          },
        ],

        grammars: [
          {
            language: "scc",
            scopeName: "source.scc",
            path: `./scc-grammar.json`,
          },
        ],
      },
    },
    filesOrContents: getSccExtensionFiles(),
  };
};
