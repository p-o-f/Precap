export async function checkAiSystemHealth() {
  const results = {
    isVersionSupported: false,
    isPromptApiAvailable: false,
    isSummarizerAvailable: false,
    isHardwareCapable: false, // RAM/VRAM Check
    isModelDownloaded: false, // Is the AI actually ready to "think"?
  };

  try {
    // 1. Check Chrome Version (Requires 128+)
    const versionMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    const majorVersion = versionMatch ? parseInt(versionMatch[2], 10) : 0;
    results.isVersionSupported = majorVersion >= 128;
    if ("Summarizer" in self) {
      // The Summarizer API is supported.
      console.log("summarizer supported");
    } else {
      console.warn(
        "❌ Summarizer API is not supported. Did you enable 'Summarization API for Gemini Nano' in chrome://flags?",
      );
    }
    if (!self.ai) {
      console.warn(
        "❌ self.ai is undefined. Did you enable 'Prompt API for Gemini Nano' and 'Summarization API for Gemini Nano' in chrome://flags?",
      );
    }

    // 2. Check Prompt API (Language Model)
    // 2. Check Prompt API (Language Model)
    const lmAvailability = await self.ai?.languageModel?.availability();
    console.log("LM Availability:", lmAvailability);
    results.isPromptApiAvailable =
      lmAvailability === "available" ||
      lmAvailability === "downloadable" ||
      lmAvailability === "downloading";

    // 3. Check Summarizer API
    const sumAvailability = await self.ai?.summarizer?.availability();
    console.log("Summarizer Availability:", sumAvailability);
    results.isSummarizerAvailable =
      sumAvailability === "available" ||
      sumAvailability === "downloadable" ||
      sumAvailability === "downloading";

    // 4. Check Model Readiness (Is it actually downloaded?)
    // 'available' means it's on the disk. 'downloadable' means it's capable but needs fetch.
    results.isModelDownloaded =
      lmAvailability === "available" && sumAvailability === "available";

    // 5. Hardware/VRAM Check
    // In 2026, we use the Device Memory API and WebGPU check
    const hasEnoughRAM = (navigator as any).deviceMemory >= 8; // At least 8GB RAM recommended

    // Check for WebGPU support (which Gemini Nano relies on)
    const hasWebGPU = !!navigator.gpu;
    results.isHardwareCapable = hasEnoughRAM && hasWebGPU;
  } catch (error) {
    console.error("Guardrail check failed:", error);
  }

  // Returning as a boolean array as requested
  return [
    results.isVersionSupported,
    results.isPromptApiAvailable,
    results.isSummarizerAvailable,
    results.isHardwareCapable,
    results.isModelDownloaded,
  ];
}

/**
 * Guardrail: Checks if the device is in a low-power state.
 * Returns true if performance is likely to be throttled.
 */
export async function isPowerThrottled(): Promise<boolean> {
  // 1. Check navigator.scheduling (New in late 2025/2026)
  if (
    "scheduling" in navigator &&
    (navigator as any).scheduling.isLowPowerMode
  ) {
    return true;
  }

  // 2. Fallback to Battery Status API
  if ("getBattery" in navigator) {
    const battery = await (navigator as any).getBattery();

    // If not charging and below 20%, we should assume throttling
    const isLowBattery = !battery.charging && battery.level < 0.2;

    return isLowBattery;
  }

  return false;
}

/**
 * Guardrail: Checks if the text fits within the AI's context window.
 * Returns true if safe, false if too long.
 */
export async function checkContextWindow(text: string): Promise<boolean> {
  try {
    // 1. Create a lightweight session
    const session = await self.ai.summarizer.create();

    // 2. Use the built-in measureInputUsage method
    // Note: measureInputUsage returns a number directly, not an object.
    const count = await session.measureInputUsage(text);

    console.log(`Current Token Count: ${count}`);

    // Cleanup immediately
    session.destroy();

    // 4,000 is the safe limit for Nano; 8,000 for higher-end machines
    const MAX_TOKENS = 4000;
    return count <= MAX_TOKENS;
  } catch (error) {
    console.warn("Token counting failed, falling back to character estimate.");
    // Fallback: 1 token ≈ 4 characters
    return text.length / 4 <= 4000;
  }
}
