export async function checkSystemResources() {
  const results = {
    chromeVersion: 0,
    isVersionSupported: false,
    isHardwareCapable: false, // RAM/VRAM Check
  };

  try {
    // Check Chrome Version (Requires 128+)
    const versionMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    const majorVersion = versionMatch ? parseInt(versionMatch[2], 10) : 0;
    results.chromeVersion = majorVersion;
    console.log("Chrome Version:", majorVersion);
    results.isVersionSupported = majorVersion >= 128;

    // RAM and WebGPU Check
    const hasEnoughRAM = (navigator as any).deviceMemory >= 8; // 8 and not 16 (Summarizer API needs 16GB) because of clamping: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory
    // Check for WebGPU support (which Gemini Nano relies on) // TODO verify if gemini nano need this on?
    const hasWebGPU = !!navigator.gpu;
    results.isHardwareCapable = hasEnoughRAM && hasWebGPU;
  } catch (error) {
    console.error("Guardrail check failed:", error);
  }

  // Returning as a boolean array as requested
  return [
    results.chromeVersion,
    results.isVersionSupported,
    results.isHardwareCapable,
  ];
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
