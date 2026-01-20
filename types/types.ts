/// <reference types="@types/dom-chromium-ai" />
/// <reference types="@webgpu/types" />

// 1. Extend the Window interface for Content Scripts/Popups
interface Window {
  // The @types package exports the classes globally (e.g. LanguageModel, Summarizer),
  // but we need to define the 'window.ai' entry point that exposes them.
  ai: AI;
}

interface WorkerGlobalScope {
  ai: AI;
}

var ai: AI;

interface AI {
  languageModel: typeof LanguageModel;
  summarizer: typeof Summarizer;
  writer: typeof Writer;
  rewriter: typeof Rewriter;
  translator: typeof Translator;
  languageDetector: typeof LanguageDetector;
}

// 2. Extend the Navigator interface for WebGPU checks
interface Navigator {
  gpu: GPU; // This comes from @webgpu/types
}

// 3. Helper Type for your Guardrail results
type AiSystemHealth = {
  isVersionSupported: boolean;
  isPromptApiAvailable: boolean;
  isSummarizerAvailable: boolean;
  isHardwareCapable: boolean;
  isModelDownloaded: boolean;
};

//npm install @webgpu/types
//npm install @types/dom-chromium-ai
