import { checkSystemResources } from "@/utils/resourcecheck";
import { KeepAliveService } from "@/utils/keepalive";
import { settingsStorage } from "@/utils/storage";
import { fetchTranscript } from 'youtube-transcript-plus';

export default defineBackground(async () => {
  console.log("Hello background!", { id: browser.runtime.id });
  KeepAliveService.start();
  console.log(checkSystemResources());


  const availability = await Summarizer.availability();
  if (availability === "unavailable") {
    // The Summarizer API isn't usable.
    return;
  } else {
    console.log("Available!!!!!!");
  }

  // Log current settings
  const currentSettings = await settingsStorage.getValue();
  console.log("📋 Current Settings:", currentSettings);

  // Watch for future setting changes
  settingsStorage.watch((newSettings) => {
    console.log("📋 Settings changed:", newSettings);
  });

  // // Proceed to request batch or streaming summarization
  // const summarizer = await Summarizer.create({
  //   monitor(m) {
  //     m.addEventListener("downloadprogress", (e) => {
  //       console.log(`Downloaded ${e.loaded * 100}%`);
  //     });
  //   },
  // });

  // console.log("Availability:", availability);
  // console.log("trying yolo to cloud sumamry toytoubeu");
  // const dummyText2 = "https://www.youtube.com/watch?v=httnhdpu_W4";
  // const summary2 = await summarizer.summarize(dummyText2, {
  //   context: "What is the title of this video and a short summary?",
  // });
  // console.log(summary2);
  console.log("completed!!!");
  // console.log("trying yolo to cloud sumamry toytoubeu");
  // const dummyText2 = "https://youtu.be/httnhdpu_W4";
  // console.log(await summarizeUrl(dummyText2, "key-points", "medium", "give me the title of the video"));
  // console.log("completed!!!");
  transcribe();
fetchTranscript('httnhdpu_W4').then(console.log).catch(console.error);


});

// todo https://developer.chrome.com/docs/ai/scale-summarization and chrome://on-device-internals/ <-- just reference this for docs l8r

const summarizeUrl = async (url: string, type: "tldr" | "teaser" | "key-points" | "headline", length: "short" | "medium" | "long", ctx?: string) => {
  const summarizer = await Summarizer.create({
  sharedContext: "This is a YouTube video",
  type: type,     // "tldr" | "teaser" | etc.
  length: length, // "short" | "medium" | "long"
  format: "plain-text",
});


const result = await summarizer.summarize(url, {
  context: ctx || "summarize this YouTube video",
});

summarizer.destroy(); // free up resources
return result;
}

function transcribe() {
//   (async () => {
//   try {
//     const transcript = await YoutubeTranscript.fetchTranscript("I7_WXKhyGms");
//     console.log(transcript);
//   } catch (err) {
//     console.error(err);
//   }
// })();
//YoutubeTranscript.fetchTranscript('EpSmQa7UyA0').then(console.log);
  fetchTranscript('ODGBUYvIMVE', {
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
})
  .then(console.log)
  .catch(console.error);

}

// FIX FOR LATER
// TODO

// https://github.com/Kakulukian/youtube-transcript/issues/45#issuecomment-2906780325 <--------
// https://github.com/Kakulukian/youtube-transcript/issues/45#issuecomment-2924659026 <--------

