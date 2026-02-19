import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";
import { browser } from "wxt/browser";
import { settingsStorage, defaultSettings, type Settings } from "@/utils/storage";

function App() {
  const [count, setCount] = useState(0);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load initial settings
    settingsStorage.getValue().then((val) => {
      setSettings(val ?? defaultSettings);
    });

    // Subscribe to changes (e.g. from other tabs)
    const unwatch = settingsStorage.watch((newVal) => {
      setSettings(newVal ?? defaultSettings);
    });

    return () => unwatch();
  }, []);

  const selectedCheckboxes = Object.entries(settings)
    .filter(([key, value]) => value) // only true values
    .map(([key]) => key)
    .join(", ");

  return (
    <>
      <h1>Gemini Nano Test</h1>
      <div className="card">
        <button onClick={runAiExperiment}>Run AI Experiment</button>
        <button onClick={openSettings}>Settings</button>
        <p>Check the console (Right-Click &rarr; Inspect) for output.</p>
        <hr />
        <p style={{ textAlign: "left", fontSize: "0.8em", marginTop: "1em" }}>
          <strong>SELECTED CHECKBOXES:</strong> <br />
          {selectedCheckboxes || "None"}
        </p>
      </div>
    </>
  );
}

function openSettings() {
  browser.tabs.create({ url: "/settings.html" });
}

async function runAiExperiment() {
  console.log("🚀 Starting AI Experiment in Popup...");
  const availability = await Summarizer.availability();
  if (availability === "unavailable") {
    // The Summarizer API isn't usable.
    return;
  } else {
    console.log("Available!!!!!!");
  }
  // Proceed to request batch or streaming summarization
  const summarizer = await Summarizer.create({
    monitor(m) {
      m.addEventListener("downloadprogress", (e) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });
  console.log("Availability:", availability);

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
