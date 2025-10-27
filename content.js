let currentSkipTime = 5;
const DEFAULT_SKIP_TIME = 5;

// --- Storage (no change) ---
// 1. Get the saved value from storage when the page loads
(async () => {
  const data = await chrome.storage.sync.get("customSkipTime");
  currentSkipTime=data.customSkipTime || DEFAULT_SKIP_TIME;
})();


// 2. Listen for any *changes* to the value
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.customSkipTime) {
    currentSkipTime = changes.customSkipTime.newValue;
  }
});

// --- Helper Functions ---
function getVideoPlayer() {
  return document.querySelector('video');
}

// Checks if the user is currently typing in a text box
function isTyping() {
  const activeEl = document.activeElement;
  return activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable;
}

// --- UPDATED: Keydown Listener ---
// Now handles 'j', 'l', 'ArrowLeft', and 'ArrowRight'
document.addEventListener('keydown', (e) => {
  if (isTyping()) {
    return; // Don't interfere with search or comments
  }

  const video = getVideoPlayer();
  if (!video) return;

  const key = e.key.toLowerCase();

  // Check for all our target keys
  if (key === 'j' || key === 'arrowleft' || key === 'l' || key === 'arrowright') {
    
    // Stop YouTube's default handler
    e.preventDefault();
    e.stopPropagation();

    // Apply custom skip
    if (key === 'j' || key === 'arrowleft') {
      video.currentTime -= currentSkipTime; // Skip backward
    } else if (key === 'l' || key === 'arrowright') {
      video.currentTime += currentSkipTime; // Skip forward
    }
  }
}, true); // Use capture phase

// --- NEW: Click Listener ---
// Intercepts clicks on the on-screen rewind and forward buttons
document.addEventListener('click', (e) => {
  // We use .closest() because the user might click the <svg> icon *inside* the button
  const rewindButton = e.target.closest('.ytp-rewind-button');
  const forwardButton = e.target.closest('.ytp-forward-button');

  if (!rewindButton && !forwardButton) {
    return; // Click wasn't on one of our target buttons
  }
  
  const video = getVideoPlayer();
  if (!video) return;

  // Stop YouTube's default 10-second skip
  e.preventDefault();
  e.stopPropagation();

  // Apply our custom skip
  if (rewindButton) {
    video.currentTime -= currentSkipTime;
  } else if (forwardButton) {
    video.currentTime += currentSkipTime;
  }
}, true); // Use capture phase