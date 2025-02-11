/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from "vscode";
import { LogLevel } from "@codingame/monaco-vscode-api";
import { RegisteredFileSystemProvider, registerFileSystemOverlay, RegisteredMemoryFile } from "@codingame/monaco-vscode-files-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import getLifecycleServiceOverride from "@codingame/monaco-vscode-lifecycle-service-override";
import getLocalizationServiceOverride from "@codingame/monaco-vscode-localization-service-override";
import getBannerServiceOverride from "@codingame/monaco-vscode-view-banner-service-override";
import getStatusBarServiceOverride from "@codingame/monaco-vscode-view-status-bar-service-override";
import getTitleBarServiceOverride from "@codingame/monaco-vscode-view-title-bar-service-override";
import getExplorerServiceOverride from "@codingame/monaco-vscode-explorer-service-override";
import getRemoteAgentServiceOverride from "@codingame/monaco-vscode-remote-agent-service-override";
import getEnvironmentServiceOverride from "@codingame/monaco-vscode-environment-service-override";
import getSecretStorageServiceOverride from "@codingame/monaco-vscode-secret-storage-service-override";
import getStorageServiceOverride from "@codingame/monaco-vscode-storage-service-override";
import getSearchServiceOverride from "@codingame/monaco-vscode-search-service-override";
import getWorkbenchServiceOverride from "@codingame/monaco-vscode-workbench-service-override";
import getOutputServiceOverride from "@codingame/monaco-vscode-output-service-override";
import getPreferencesServiceOverride from "@codingame/monaco-vscode-preferences-service-override";
import getMarkersServiceOverride from "@codingame/monaco-vscode-markers-service-override";
import getOutlineServiceOverride from "@codingame/monaco-vscode-outline-service-override";
import getDebugServiceOverride from "@codingame/monaco-vscode-debug-service-override";
// requried for syntax hihlighting
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";

// this is required syntax highlighting
// import "@codingame/monaco-vscode-typescript-basics-default-extension";
// import "@codingame/monaco-vscode-typescript-language-features-default-extension";
// import "@codingame/monaco-vscode-search-result-default-extension";

import { createDefaultLocaleConfiguration } from "monaco-languageclient/vscode/services";
import { configureMonacoWorkers, createDefaultWorkspaceFile } from "./utils.js";
// import helloTsCode from "../../resources/appPlayground/hello.ts?raw";
// import testerTsCode from "../../resources/appPlayground/tester.ts?raw";
import type { MonacoEditorLanguageClientWrapper, WrapperConfig } from "monaco-editor-wrapper";
import { RegisterLocalProcessExtensionResult } from "@codingame/monaco-vscode-api/extensions";
import { getSccLanguageClientConfig, getSccLanguageExtension } from "./lsp/scc/scc-setup.js";
import { getAsmLanguageClientConfig, getAsmLanguageExtension } from "./lsp/asm/asm-setup.js";

export const HOME_DIR = "";
export const WORKSPACE_PATH = `${HOME_DIR}/dk8085`;

export type ConfigResult = {
  wrapperConfig: WrapperConfig;
  workspaceFile: vscode.Uri;
};

export const configure = (htmlContainer?: HTMLElement): ConfigResult => {
  const workspaceFile = vscode.Uri.file("/workspace/.vscode/workspace.code-workspace");

  const wrapperConfig: WrapperConfig = {
    $type: "extended",
    id: "AAP",
    logLevel: LogLevel.Debug,
    htmlContainer,
    vscodeApiConfig: {
      serviceOverrides: {
        ...getConfigurationServiceOverride(),
        ...getKeybindingsServiceOverride(),
        ...getLifecycleServiceOverride(),
        ...getLocalizationServiceOverride(createDefaultLocaleConfiguration()),
        ...getBannerServiceOverride(),
        ...getStatusBarServiceOverride(),
        ...getTitleBarServiceOverride(),
        ...getExplorerServiceOverride(),
        ...getRemoteAgentServiceOverride(),
        ...getEnvironmentServiceOverride(),
        ...getSecretStorageServiceOverride(),
        ...getStorageServiceOverride(),
        ...getSearchServiceOverride(),
        ...getWorkbenchServiceOverride(),
        ...getOutlineServiceOverride(),
        ...getMarkersServiceOverride(),
        ...getPreferencesServiceOverride(),
        ...getDebugServiceOverride(),
        ...getOutputServiceOverride(),
        ...getLanguagesServiceOverride(),
        ...getTextMateServiceOverride(),
        ...getThemeServiceOverride(),
      },
      enableExtHostWorker: true,
      viewsConfig: {
        viewServiceType: "WorkspaceService",
      },
      workspaceConfig: {
        enableWorkspaceTrust: true,
        windowIndicator: {
          label: "mlc-app-playground",
          tooltip: "",
          command: "",
        },
        workspaceProvider: {
          trusted: true,
          async open() {
            window.open(window.location.href);
            return true;
          },
          workspace: {
            workspaceUri: workspaceFile,
          },
        },
        configurationDefaults: {
          "window.title": "mlc-app-playground${separator}${dirty}${activeEditorShort}",
        },
        productConfiguration: {
          nameShort: "mlc-app-playground",
          nameLong: "mlc-app-playground",
        },
      },
      userConfiguration: {
        json: JSON.stringify({
          "workbench.colorTheme": "Default Dark Modern",
          "editor.wordBasedSuggestions": "off",
          "typescript.tsserver.web.projectWideIntellisense.enabled": true,
          "typescript.tsserver.web.projectWideIntellisense.suppressSemanticErrors": false,
          "editor.guides.bracketPairsHorizontal": true,
          "oct.serverUrl": "https://api.open-collab.tools/",
          "editor.experimental.asyncTokenization": false,
        }),
      },
    },
    languageClientConfigs: {
      scc: getSccLanguageClientConfig(),
      asm: getAsmLanguageClientConfig(),
    },
    extensions: [getSccLanguageExtension(), getAsmLanguageExtension()],
    editorAppConfig: {
      monacoWorkerFactory: configureMonacoWorkers,
    },
  };

  // const helloTsUri = vscode.Uri.file("/workspace/hello.sc");
  // const testerTsUri = vscode.Uri.file("/workspace/tester.asm");
  // const fileSystemProvider = new RegisteredFileSystemProvider(false);
  // fileSystemProvider.registerFile(new RegisteredMemoryFile(helloTsUri, "main() {int i; i=5}"));
  // fileSystemProvider.registerFile(new RegisteredMemoryFile(testerTsUri, "; bla"));
  // fileSystemProvider.registerFile(createDefaultWorkspaceFile(workspaceFile, "/workspace"));
  // registerFileSystemOverlay(1, fileSystemProvider);

  const fileSystemProvider = new RegisteredFileSystemProvider(false);
  // const workspaceFileUri = vscode.Uri.file(`${WORKSPACE_PATH}/.vscode/workspace.code-workspace`);
  fileSystemProvider.registerFile(createDefaultWorkspaceFile(workspaceFile, "/dk8085"));

  const examplesAsm = import.meta.glob("./examples/*.asm", { eager: true, as: "raw" });
  Object.entries(examplesAsm).forEach(([key, value]) => {
    fileSystemProvider.registerFile(new RegisteredMemoryFile(vscode.Uri.file(`dk8085/${key.replace("./examples/", "")}`), value));
  });

  const examplesC = import.meta.glob("./examples/*.c", { eager: true, as: "raw" });
  Object.entries(examplesC).forEach(([key, value]) => {
    fileSystemProvider.registerFile(new RegisteredMemoryFile(vscode.Uri.file(`dk8085/${key.replace("./examples/", "")}`), value));
  });

  registerFileSystemOverlay(1, fileSystemProvider);

  return {
    wrapperConfig,
    workspaceFile,
  };
};

export const configurePostStart = async (wrapper: MonacoEditorLanguageClientWrapper, configResult: ConfigResult) => {
  const result = wrapper.getExtensionRegisterResult("scc-language-extension") as RegisterLocalProcessExtensionResult;
  result.setAsDefaultApi();

  // WA: Force show explorer and not search
  // await vscode.commands.executeCommand('workbench.view.explorer');

  // await Promise.all([
  //   await vscode.workspace.openTextDocument(configResult.helloTsUri),
  //   await vscode.workspace.openTextDocument(configResult.testerTsUri),
  // ]);

  // await Promise.all([await vscode.window.showTextDocument(configResult.helloTsUri)]);

  console.log("Application Playground started");
};
