import { YoutubeTranscript } from "youtube-transcript";

export default defineBackground(async () => {
  console.log("Hello background!", { id: browser.runtime.id });
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

  const dummyText =
    "PwC is restricting where entry-level consultants can begin their careers. The Big Four firms are facing mounting pressure to retrain workers as consulting projects increasingly focus on implementing AI tools rather than traditional research.";
  const summary = await summarizer.summarize(dummyText, {
    context:
      "This is a short text example to test this API. Make sure your response is 1 sentence at maximum.",
  });

  console.log("trying yolo to cloud sumamry toytoubeu");
  const dummyText2 = "https://www.youtube.com/watch?v=httnhdpu_W4";
  const summary2 = await summarizer.summarize(dummyText2, {
    context: "What is the title of this video and a short summary?",
  });
  console.log(summary2);
  console.log("completed!!!");
});
