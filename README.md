# Precap (temporary readme)

### _Get the hook before the click._

**Precap** is an AI-native Chrome extension that transforms how you browse YouTube. Inspired by the editorial experience of platforms like Netflix, Precap provides instant, high-quality video summaries via a hover-interface—allowing you to understand a video's core "premise" before committing your time.

Built on a **Local-First** architecture, Precap performs all AI inference directly on your machine using **Gemini Nano**. No data leaves your device, no API keys are required, and it costs $0.00 to run.

---

## ✨ Key Features

- **Hover-to-Summary:** Simply hover over any YouTube thumbnail to generate a concise "Precap" of the video.
- **Privacy-by-Design:** Your viewing habits and transcripts stay in your RAM. Zero cloud processing.
- **AI-Native Architecture:** Leverages the built-in Chrome `window.ai` API.
- **Zero Latency:** No network round-trips to external LLM providers.
- **Infinite Scale:** No API quotas or monthly subscriptions.

---

## 🏗️ Technical Architecture

Precap is designed to solve the challenges of running Large Language Models (LLMs) in a browser environment.

### 1. The Intelligence Layer (Gemini Nano)

Precap uses the **Gemini Nano** model integrated into Chromium. By utilizing **WebGPU acceleration**, it achieves high-speed inference on standard laptop hardware (16GB RAM+) without requiring a dedicated high-end GPU.

### 2. Map-Reduce Summarization

To overcome the context-window limitations of on-device models, Precap implements a **recursive Map-Reduce pattern**:

1. **Scrape:** Extracts transcripts via the YouTube InnerTube API directly in the browser.
2. **Map:** Chunks the transcript into 5-minute logical segments.
3. **Reduce:** Summarizes each chunk individually and performs a final synthesis pass to create a cohesive summary.

### 3. Hardware-Awareness & Initialization

Precap includes a built-in monitor that checks system resources before initializing the ~2GB model. This prevents "system thrashing" on low-spec devices and offers a graceful fallback to traditional keyword extraction.

---

## 🛠️ Setup & Requirements

Because Precap uses cutting-edge browser APIs, a specific environment is required:

### System Requirements

- **Browser:** Google Chrome or Microsoft Edge (Version 128+)
- **RAM:** 16GB Minimum (Required for model hydration)
- **OS:** Windows, macOS, or Linux

### Enabling Built-in AI

1. Open `chrome://flags`
2. Enable **Prompt API for Gemini Nano**
3. Enable **Enables optimization guide on device model** (Set to `Enabled BypassPerfRequirement`)
4. Relaunch Chrome and visit `chrome://components`. Check for updates on **Optimization Guide On Device Model**.

---

## 🛡️ Responsible AI Disclosure

- **Data Sovereignty:** Precap does not collect, store, or share user data. All transcript processing is volatile and cleared upon session destruction.
- **Resource Stewardship:** By performing hardware-checks before model initialization, Precap ensures it remains a "good citizen" of the user's operating system.
- **Energy Efficiency:** Localized inference reduces the carbon footprint associated with repeated high-bandwidth API requests to data centers.

---

## 🤝 Contributing

We welcome contributions to the Map-Reduce logic and UI/UX improvements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
