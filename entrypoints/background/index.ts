import {
  checkAiSystemHealth,
  isPowerThrottled,
  checkContextWindow,
} from "../../utils/resourcecheck";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  runStoryExperiment();
});

async function runStoryExperiment() {
  console.log("🚀 Starting AI Experiment...");

  // --- STEP 0: Run Guardrails ---
  const [
    versionIsSupported,
    promptAPIAvailable,
    summarizerAPIAvailable,
    hardwareIsCapable,
    modelisDownloaded,
  ] = await checkAiSystemHealth();
  const throttled = await isPowerThrottled();

  if (
    !versionIsSupported ||
    !promptAPIAvailable ||
    !summarizerAPIAvailable ||
    !hardwareIsCapable ||
    !modelisDownloaded
  ) {
    console.error(
      "❌ Experiment Aborted: AI models not fully downloaded or supported.",
    );
    console.error(
      "Version Supported: " + versionIsSupported,
      "Prompt API Available: " + promptAPIAvailable,
      "Summarizer API Available: " + summarizerAPIAvailable,
      "Hardware Capable: " + hardwareIsCapable,
      "Model Downloaded: " + modelisDownloaded,
    );
    //return;
  }

  if (throttled) {
    console.warn("⚠️ Low power detected. Performance may be slow.");
  }

  try {
    // --- STEP 1: Generate 3-Paragraph Story ---
    console.log("📝 Phase 1: Generating Story...");
    const writer = await ai.languageModel.create({
      initialPrompts: [
        {
          role: "system",
          content: "You are a creative author specializing in sci-fi fables.",
        },
      ],
    });

    const storyPrompt =
      "Write a 3-paragraph story about a tortoise and a hare racing in a high-tech cyberpunk city.";
    const fullStory = await writer.prompt(storyPrompt);
    console.log(
      "%cFull Story Generated:",
      "color: #00ff00",
      `\n\n${fullStory}`,
    );

    // --- STEP 2: Context Guardrail check before Summarizing ---
    const isSafe = await checkContextWindow(fullStory);
    if (!isSafe)
      throw new Error(
        "Generated story is too long for the summarizer context.",
      );

    // --- STEP 3: Summarize into 1 Paragraph ---
    console.log("✂️ Phase 2: Summarizing...");
    const summarizer = await ai.summarizer.create({
      type: "tldr", // Best for 1-paragraph summaries
      format: "plain-text",
      length: "short",
    });

    const summary = await summarizer.summarize(fullStory);
    console.log("%cOne-Paragraph Summary:", "color: #00aaff", `\n\n${summary}`);

    // Clean up
    writer.destroy();
    summarizer.destroy();
  } catch (err) {
    console.error("💥 Experiment failed:", err);
  }
}
