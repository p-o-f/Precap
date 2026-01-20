import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Gemini Nano Test</h1>
      <div className="card">
        <button onClick={runAiExperiment}>Run AI Experiment</button>
        <p>Check the console (Right-Click &rarr; Inspect) for output.</p>
      </div>
    </>
  );
}

async function runAiExperiment() {
  console.log("🚀 Starting AI Experiment in Popup...");

  if (!window.ai) {
    console.error("❌ window.ai is undefined. Enable flags in chrome://flags.");
    return;
  }

  try {
    // Check Availability
    const lm = await window.ai.languageModel.availability();
    console.log("Language Model Availability:", lm);

    const sum = await window.ai.summarizer.availability();
    console.log("Summarizer Availability:", sum);

    if (lm === "unavailable" || sum === "unavailable") {
      console.warn("⚠️ AI Models are not available on this device/browser.");
      return;
    }

    // Generate Story
    console.log("📝 Generating Story...");
    const writer = await window.ai.languageModel.create({
      initialPrompts: [
        { role: "system", content: "You are a creative author." },
      ],
    });
    const story = await writer.prompt(
      "Write a very short story about a robot who loves coffee.",
    );
    console.log("STORY:", story);

    // Summarize
    console.log("✂️ Summarizing...");
    const summarizer = await window.ai.summarizer.create({
      type: "tldr",
      format: "plain-text",
      length: "short",
    });
    const summary = await summarizer.summarize(story);
    console.log("SUMMARY:", summary);

    writer.destroy();
    summarizer.destroy();
  } catch (err) {
    console.error("Experiment Failed:", err);
  }
}

export default App;
