import ScLanguageConfig from "./language-configuration.json" with { type: "json" };
import ScTmSyntax from "./sc.tmLanguage.json" with { type: "json" };
export const getScLanguageClientConfig = () => {
    // vite does not extract the worker properly if it is URL is a variable
    const lsWorker = new Worker(new URL("../language/main-browser", import.meta.url), {
        type: "module",
        name: "Sc Language Server",
    });
    return {
        name: "Sc",
        connection: {
            options: {
                $type: "WorkerDirect",
                worker: lsWorker,
            },
        },
        clientOptions: {
            documentSelector: ["sc"], // the language id, NOT extension
        },
    };
};
const getScExtensionFiles = () => {
    const files = new Map();
    files.set(`/sc-configuration.json`, JSON.stringify(ScLanguageConfig));
    files.set(`/sc-grammar.json`, JSON.stringify(ScTmSyntax));
    return files;
};
export const getScLanguageExtension = () => {
    return {
        config: {
            name: "sc-language-extension",
            publisher: "DK",
            version: "1.0.0",
            engines: {
                vscode: "*",
            },
            contributes: {
                languages: [
                    {
                        id: "sc",
                        extensions: [".sc", ".c"],
                        aliases: ["Sc"],
                        configuration: `./sc-configuration.json`,
                    },
                ],
                grammars: [
                    {
                        language: "sc",
                        scopeName: "source.sc",
                        path: `./sc-grammar.json`,
                    },
                ],
            },
        },
        filesOrContents: getScExtensionFiles(),
    };
};
