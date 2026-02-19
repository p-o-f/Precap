
export interface Settings {
  autoReload: boolean;
  showBlockedCount: boolean;
  strictBlocking: boolean;
  developerMode: boolean;
}

export const defaultSettings: Settings = {
  autoReload: true,
  showBlockedCount: true,
  strictBlocking: true,
  developerMode: false,
};

export const settingsStorage = storage.defineItem<Settings>("sync:settings", {
  defaultValue: defaultSettings,
});
