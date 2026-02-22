export default defineContentScript({
  matches: ["*://*.youtube.com/*"],

  main(ctx) {
    console.log("Precap: Content Script Loaded on", window.location.href);

    const BUTTON_CLASS = "precap-clip-btn";
    const WATCH_BUTTON_CLASS = "precap-watch-btn";

    // ─── Create a styled 📋 button ───
    function createPrecapButton(onClick: () => void): HTMLButtonElement {
      const btn = document.createElement("button");
      btn.className = BUTTON_CLASS;
      btn.textContent = "📋";
      btn.title = "Precap";
      btn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 4px 8px;
        opacity: 0.7;
        transition: opacity 0.15s;
        display: inline-flex;
        align-items: center;
        z-index: 999;
      `;
      btn.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
      btn.addEventListener("mouseleave", () => (btn.style.opacity = "0.7"));
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      });
      return btn;
    }

    // ─── Extract video URL from a container ───
    function getVideoUrl(container: Element): string | null {
      // Try to find any link to a /watch page
      const links = container.querySelectorAll("a[href*='/watch']");
      for (const link of links) {
        const href = link.getAttribute("href");
        if (href) {
          // Filter out ad tracking links
          if (href.startsWith("/watch")) {
            return `https://www.youtube.com${href}`;
          }
          if (href.includes("youtube.com/watch")) {
            return href;
          }
        }
      }
      return null;
    }

    // ─── 1. New YouTube cards (yt-lockup-view-model) — homepage & sidebar ───
    function injectLockupButtons() {
      const lockups = document.querySelectorAll("yt-lockup-view-model");
      lockups.forEach((lockup) => {
        if (lockup.querySelector(`.${BUTTON_CLASS}`)) return;

        const url = getVideoUrl(lockup);
        if (!url) return;

        const btn = createPrecapButton(() => {
          const videoUrl = getVideoUrl(lockup);
          if (videoUrl) {
            console.log("Precap 📋 Video URL:", videoUrl);
          } else {
            console.warn("Precap: Could not find video URL.");
          }
        });

        // Append to the inner div of the lockup
        const innerDiv = lockup.querySelector("div");
        if (innerDiv) {
          innerDiv.appendChild(btn);
        } else {
          lockup.appendChild(btn);
        }
      });
    }

    // ─── 2. Legacy YouTube cards (ytd-*-renderer) — search results ───
    const LEGACY_CARD_SELECTORS = [
      "ytd-rich-item-renderer",
      "ytd-compact-video-renderer",
      "ytd-video-renderer",
      "ytd-grid-video-renderer",
    ].join(", ");

    function injectLegacyCardButtons() {
      document.querySelectorAll(LEGACY_CARD_SELECTORS).forEach((container) => {
        if (container.querySelector(`.${BUTTON_CLASS}`)) return;

        const anchor =
          container.querySelector("ytd-menu-renderer") ||
          container.querySelector("#details") ||
          container.querySelector("#meta") ||
          container.querySelector("#metadata");

        if (!anchor) return;

        const btn = createPrecapButton(() => {
          const videoUrl = getVideoUrl(container);
          if (videoUrl) {
            console.log("Precap 📋 Video URL:", videoUrl);
          } else {
            console.warn("Precap: Could not find video URL.");
          }
        });

        anchor.insertAdjacentElement("afterend", btn);
      });
    }

    // ─── 3. Currently playing video (watch page) ───
    function injectWatchPageButton() {
      if (document.querySelector(`.${WATCH_BUTTON_CLASS}`)) return;
      if (!window.location.pathname.startsWith("/watch")) return;

      // Try multiple anchor points for the watch page action bar
      const anchorSelectors = [
        "#actions",
        "#above-the-fold #top-row",
        "#owner",
        "#above-the-fold",
        "ytd-watch-metadata",
      ];

      let anchor: Element | null = null;
      for (const sel of anchorSelectors) {
        anchor = document.querySelector(sel);
        if (anchor) {
          console.log("Precap: Watch page anchor found:", sel);
          break;
        }
      }

      if (!anchor) return;

      const btn = createPrecapButton(() => {
        console.log("Precap 📋 Video URL:", window.location.href);
      });
      btn.className = WATCH_BUTTON_CLASS;
      btn.style.fontSize = "22px";
      btn.style.padding = "6px 12px";

      anchor.appendChild(btn);
    }

    // ─── Scan all targets ───
    function scanAndInject() {
      injectLockupButtons();       // New YouTube (homepage, etc.)
      injectLegacyCardButtons();   // Old YouTube (search results)
      injectWatchPageButton();     // Watch page player
    }

    // Initial scan after YouTube renders
    setTimeout(scanAndInject, 2000);

    // YouTube is an SPA — watch for DOM changes
    let debounceTimer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(scanAndInject, 300);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Periodic fallback
    const interval = setInterval(scanAndInject, 3000);

    // Clean up
    ctx.onInvalidated(() => {
      observer.disconnect();
      clearInterval(interval);
      clearTimeout(debounceTimer);
    });
  },
});
