export default defineContentScript({
  matches: ['*://www.youtube.com/*'],
  main() {
    console.log('hello world');
  },
});
