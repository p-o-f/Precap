export default defineContentScript({
  // Only run on YouTube video pages
  matches: ["*://*.youtube.com/watch*"],

  main(ctx) {
    console.log("Precap: YouTube Content Script Loaded");

    // 1. Listen for "Soft" URL changes (crucial for YouTube)
    ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
      if (newUrl.pathname === "/watch") {
        const videoId = new URLSearchParams(newUrl.search).get("v");
        console.log("Navigated to a new video:", videoId);
        initPrecap(videoId);
      }
    });

    // 2. Initial run for the first page load
    const initialVideoId = new URLSearchParams(window.location.search).get("v");
    if (initialVideoId) initPrecap(initialVideoId);
  },
});

async function initPrecap(videoId: string | null) {
  if (!videoId) return;

  // Here is where you'll call your Gemini Nano logic
  console.log(`Precap is ready to summarize video: ${videoId}`);

  // Next Step: We will scrape the transcript and pass it to window.ai.summarizer
}
