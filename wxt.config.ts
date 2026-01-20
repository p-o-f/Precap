import { defineConfig } from "wxt";

const isDev = process.env.NODE_ENV === "development";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    // These args ensure Gemini Nano is active whenever WXT launches your browser
    chromiumArgs: [
      ...(isDev ? ["--disable-blink-features=AutomationControlled"] : []), // in dev mode, helps fix unsecure issue with Chromium login... see THIS https://github.com/wxt-dev/wxt/issues/1971 and https://github.com/wxt-dev/wxt/issues/1890 for more info
      "--enable-features=PromptApiForGeminiNano,OptimizationGuideOnDeviceModel", // enable Gemini Nano
      "--optimization-guide-on-device-model-bypass-perf-requirement", // bypass performance requirements for Gemini Nano
    ],
  },

  manifest: {
    name: "Precap",
    permissions: ["aiSummarizer" as any, "languageModel" as any, "storage"],
    host_permissions: ["https://www.youtube.com/*"],
    minimum_chrome_version: "128.0.0.0",
    action: {
      //default_popup: "entrypoints/popup/index.html",
    },
  },
});
