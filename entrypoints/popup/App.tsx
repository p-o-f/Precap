import { useState, useEffect } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";
import { browser } from "wxt/browser";
import { settingsStorage, defaultSettings, type Settings } from "@/utils/storage";
import { YoutubeTranscript } from "@danielxceron/youtube-transcript";

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



  return (
    <>
      <h1>Precap</h1>
      <div className="card">
        <button onClick={runAiExperiment}>Run AI Experiment</button>
        <button onClick={openSettings}>Settings</button>
        <p>Go to settings to change summary type and length, and check if your system configuration is supported.</p>
        <hr />
        <p style={{ textAlign: "left", fontSize: "0.8em", marginTop: "1em" }}>
          <strong>SELECTED OPTIONS:</strong> <br />
          {settings.summaryType}, {settings.summaryLength}
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
  YoutubeTranscript.fetchTranscript('I2v5lHNfCi8').then(console.log);
  // const availability = await Summarizer.availability();
  // if (availability === "unavailable") {
  //   // The Summarizer API isn't usable.
  //   return;
  // } else {
  //   console.log("Available!!!!!!");
  // }
  // // Proceed to request batch or streaming summarization
  // const summarizer = await Summarizer.create({
  //   monitor(m) {
  //     m.addEventListener("downloadprogress", (e) => {
  //       console.log(`Downloaded ${e.loaded * 100}%`);
  //     });
  //   },
  // });
  // console.log("Availability:", availability);


  //TODO look at this VVV
  if (!window.ai) {
    console.error("❌ window.ai is undefined. Enable flags in chrome://flags.");
    return;
  }

}

export default App;
