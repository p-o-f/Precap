import { useEffect, useState } from "react";
import { settingsStorage, defaultSettings, type Settings } from "@/utils/storage";

function App() {
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

  const updateSetting = async (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings); // Optimistic update
    await settingsStorage.setValue(newSettings);
  };

  return (
    <>
      <h2>Behavior</h2>
      <div className="checkbox-group">
        
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="autoReload"
            checked={settings.autoReload}
            onChange={(e) => updateSetting("autoReload", e.target.checked)}
          />
          <div className="checkbox-content">
            <label htmlFor="autoReload" className="checkbox-label">
              Automatically reload page when changing filtering mode
            </label>
          </div>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            id="showBlockedCount"
            checked={settings.showBlockedCount}
            onChange={(e) => updateSetting("showBlockedCount", e.target.checked)}
          />
          <div className="checkbox-content">
            <label htmlFor="showBlockedCount" className="checkbox-label">
              Show the number of blocked requests on the toolbar icon
            </label>
          </div>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            id="strictBlocking"
            checked={settings.strictBlocking}
            onChange={(e) => updateSetting("strictBlocking", e.target.checked)}
          />
          <div className="checkbox-content">
            <label htmlFor="strictBlocking" className="checkbox-label">
              Enable strict blocking
            </label>
            <div className="checkbox-description">
              Navigation to potentially undesirable sites will be blocked, and you will be offered the option to proceed.
            </div>
          </div>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            id="developerMode"
            checked={settings.developerMode}
            onChange={(e) => updateSetting("developerMode", e.target.checked)}
          />
          <div className="checkbox-content">
            <label htmlFor="developerMode" className="checkbox-label">
              Developer mode
            </label>
            <div className="checkbox-description">
              Enables access to features suitable for technical users.
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
