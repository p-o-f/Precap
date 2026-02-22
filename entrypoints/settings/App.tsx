import { useEffect, useState } from "react";
import { settingsStorage, defaultSettings, type Settings, type SummaryType, type SummaryLength } from "@/utils/storage";

function App() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    settingsStorage.getValue().then((val) => {
      setSettings(val ?? defaultSettings);
    });

    const unwatch = settingsStorage.watch((newVal) => {
      setSettings(newVal ?? defaultSettings);
    });

    return () => unwatch();
  }, []);

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await settingsStorage.setValue(newSettings);
  };

  return (
    <>
      <h2>Summary Settings</h2>
      <div className="dropdown-group">

        <div className="dropdown-item">
          <label htmlFor="summaryType" className="dropdown-label">
            Summary Type
          </label>
          <select
            id="summaryType"
            value={settings.summaryType}
            onChange={(e) => updateSetting("summaryType", e.target.value as SummaryType)}
          >
            <option value="tldr">TL;DR</option>
            <option value="teaser">Teaser</option>
            <option value="key-points">Key Points</option>
            <option value="headline">Headline</option>
          </select>
        </div>

        <div className="dropdown-item">
          <label htmlFor="summaryLength" className="dropdown-label">
            Summary Length
          </label>
          <select
            id="summaryLength"
            value={settings.summaryLength}
            onChange={(e) => updateSetting("summaryLength", e.target.value as SummaryLength)}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

      </div>

      <h2 style={{ marginTop: "2.5rem" }}>System Check</h2>
      <div className="dropdown-group">
        <div className="dropdown-item">
          <span className="dropdown-label">Chrome Version</span>
          <span>temp</span>
        </div>
      </div>
    </>
  );
}

export default App;
