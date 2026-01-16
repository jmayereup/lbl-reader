# Web Speech API: Voice Selection Guide

This guide explains how to implement a robust Text-to-Speech (TTS) system with a "Best Voice" fallback and a user-selectable dropdown.

## 1. Core State
Track the selected voice name and the playback state.

```javascript
this.selectedVoiceName = null;
this.isPlayingAll = false;
```

## 2. Getting the "Best" Voice
Browsers provide many voices, but some are much better than others (e.g., "Natural" on Edge, "Google" on Chrome). Use a priority list to find the highest quality voice for a given language.

```javascript
_getBestVoice(lang) {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const langPrefix = lang.split(/[-_]/)[0].toLowerCase();
  
  // 1. Filter by language (exact match or prefix)
  let langVoices = voices.filter(v => v.lang.toLowerCase() === lang.toLowerCase());
  if (langVoices.length === 0) {
    langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
  }

  if (langVoices.length === 0) return null;

  // 2. Priority list for high-quality voices
  const priorities = ["natural", "google", "premium", "siri"];
  for (const p of priorities) {
    const found = langVoices.find(v => v.name.toLowerCase().includes(p));
    if (found) return found;
  }

  // 3. Fallback to first non-robotic voice
  const nonRobotic = langVoices.find(v => !v.name.toLowerCase().includes("microsoft"));
  return nonRobotic || langVoices[0];
}
```

> [!TIP]
> **Android Selection**: On Android, you must set `utterance.lang` even when `utterance.voice` is assigned. Without the lang property, the OS often ignores the specific voice choice.

## 3. Populating the Voice Dropdown
The `speechSynthesis.getVoices()` list is populated asynchronously. You must listen for the `onvoiceschanged` event.

```javascript
connectedCallback() {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => this._updateVoiceList();
  }
  this._updateVoiceList(); 
  
  // Mobile/Chrome Backup: Voices can load lazily
  setTimeout(() => this._updateVoiceList(), 500);
  setTimeout(() => this._updateVoiceList(), 1500);
}

_updateVoiceList() {
  const voices = window.speechSynthesis.getVoices();
  const select = document.querySelector('#voice-select');
  if (!select || voices.length === 0) return;

  // Best Practice: Mobile devices usually have high-quality defaults.
  // Hiding the selector on mobile keeps the UI clean.
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isMobile) {
    select.style.display = 'none';
    return;
  }

  const lang = "en-US"; // Your target language
  const langVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
  const bestVoice = this._getBestVoice(lang);

  select.innerHTML = '';
  langVoices.sort((a, b) => a.name.localeCompare(b.name));

  langVoices.forEach(voice => {
    const opt = document.createElement('option');
    opt.value = voice.name;
    opt.textContent = voice.name + (bestVoice && voice.name === bestVoice.name ? ' (Best)' : '');
    select.appendChild(opt);
  });

  // Default to best voice if no user choice yet
  if (!this.selectedVoiceName && bestVoice) {
    this.selectedVoiceName = bestVoice.name;
    select.value = bestVoice.name;
  }
}
```

## 4. Speaking with Selection
Apply the selected voice to the `SpeechSynthesisUtterance`.

```javascript
_speak(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Use selected voice, or fallback to best
  let voice = voices.find(v => v.name === this.selectedVoiceName) || this._getBestVoice(lang);
  
  if (voice) {
    utterance.voice = voice;
  }
  
  // Always set lang (critical for Android stability)
  utterance.lang = lang;

  utterance.rate = 0.7; // Optional: slower speed for learners
  window.speechSynthesis.cancel(); // Stop current speech
  window.speechSynthesis.speak(utterance);
}
```

## 5. CSS Styling (Premium Look)
```css
#voice-select {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.85em;
  color: #1e293b;
  max-width: 150px;
  cursor: pointer;
}
```

## 6. In-App Browser Detection & Redirection

In-app browsers (like those inside Instagram, Facebook, or Line) often have broken or limited TTS support. To ensure the best experience, detect these browsers and prompt users to open the page in a standalone browser like Chrome or Safari.

### 1. Detection Logic
Use the User Agent to identify known in-app browsers and verify `speechSynthesis` availability.

```javascript
_shouldShowAudioControls() {
  const ua = navigator.userAgent.toLowerCase();

  // Block known in-app browsers and WebViews
  if (ua.includes("wv") || ua.includes("webview") ||
    ua.includes("instagram") || ua.includes("facebook") ||
    ua.includes("line")) {
    return false;
  }

  // Also check if TTS is available
  if (!window.speechSynthesis) {
    return false;
  }

  return true;
}
```

### 2. Android Redirection (Intent Links)
On Android, you can use `intent://` links to force the device to open the current URL in Chrome.

```javascript
_getAndroidIntentLink() {
  const isAndroid = /android/i.test(navigator.userAgent);
  if (!isAndroid) return '';

  const url = new URL(window.location.href);
  // Optional: Preserve query parameters like lesson IDs
  // const lessonId = this.getAttribute('lesson-id');
  // if (lessonId) url.searchParams.set('lesson', lessonId);

  const urlNoScheme = url.toString().replace(/^https?:\/\//, '');
  const scheme = window.location.protocol.replace(':', '');

  return `intent://${urlNoScheme}#Intent;scheme=${scheme};package=com.android.chrome;end`;
}
```

### 3. Implementation (UI Prompt)
Show a full-screen overlay if the browser is not supported.

```javascript
checkBrowserSupport() {
  if (!this._shouldShowAudioControls()) {
    const overlay = this.shadowRoot.querySelector('.browser-prompt-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const androidLink = this._getAndroidIntentLink();
      const actionBtn = this.shadowRoot.querySelector('.browser-action-btn');

      if (androidLink) {
        actionBtn.href = androidLink;
        actionBtn.textContent = 'Open in Chrome';
      } else {
        // iOS or fallback: manual prompt
        actionBtn.textContent = 'Use Safari / Chrome';
        actionBtn.onclick = () => alert('Please open this page in Safari or Chrome for audio features.');
      }
    }
  }
}
```

### 4. CSS for Overlay
```css
.browser-prompt-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  padding: 2em;
  text-align: center;
}

.browser-prompt-card {
  background: white;
  color: #1e293b;
  padding: 2.5em;
  border-radius: 1.5em;
  max-width: 400px;
}
```
