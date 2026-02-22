
export type SummaryType = "tldr" | "teaser" | "key-points" | "headline";
export type SummaryLength = "short" | "medium" | "long";

export interface Settings {
  summaryType: SummaryType;
  summaryLength: SummaryLength;
}

export const defaultSettings: Settings = {
  summaryType: "tldr",
  summaryLength: "medium",
};

export const settingsStorage = storage.defineItem<Settings>("sync:settings", {
  defaultValue: defaultSettings,
});
