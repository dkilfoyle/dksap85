/******************************************************************************
 * This file was generated by langium-cli 3.3.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import type { LangiumSharedCoreServices, LangiumCoreServices, LangiumGeneratedCoreServices, LangiumGeneratedSharedCoreServices, LanguageMetaData, Module } from 'langium';
import { SccAstReflection } from './ast.js';
import { SccGrammar } from './grammar.js';

export const SccLanguageMetaData = {
    languageId: 'scc',
    fileExtensions: ['.sc'],
    caseInsensitive: false,
    mode: 'development'
} as const satisfies LanguageMetaData;

export const SccGeneratedSharedModule: Module<LangiumSharedCoreServices, LangiumGeneratedSharedCoreServices> = {
    AstReflection: () => new SccAstReflection()
};

export const SccGeneratedModule: Module<LangiumCoreServices, LangiumGeneratedCoreServices> = {
    Grammar: () => SccGrammar(),
    LanguageMetaData: () => SccLanguageMetaData,
    parser: {}
};
