class LblReader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [];
    this.studentInfo = { nickname: '', number: '' };
    this.score = 0;
    this.answeredCount = 0;

    // Playback state
    this.isPlayingAll = false;
    this.playbackIndex = 0;
    this.isPaused = false;
    this.playbackUtterance = null;

    this.isAutoplay = true;
    this.unscrambleData = [];
    this.currentUnscrambleIndex = 0;
    this.unscrambleScore = 0;
    this.userUnscrambledWords = [];

    // Memory Matching activity state
    this.memoryGameData = [];
    this.flippedCards = [];
    this.matchedPairsCount = 0;
    this.matchingGamesCompleted = 0;
    this.isCheckingMatch = false;
    this.isSwapped = false;
    this.selectedVoiceName = null;

    // Recording state
    this.recordedBlobs = new Map(); // index -> Blob
    this.recordedSentences = new Set(); // indices of valid recordings
    this.completedIndices = new Set(); // indices of correct translations
    this.unscrambleCompleted = false;
    this.memoryCompleted = false;
    this.unscrambleTotal = 0;
    this.memoryTotal = 0;
    this.isRecordingLine = null; // null or index
    this.mediaRecorder = null;
    this.recordingStartTime = 0;
    this.isPlayingRecording = null; // null or index
  }

  connectedCallback() {
    this.render();
    this.loadData();
    this.checkBrowserSupport();

    // Ensure voices are loaded (Chrome/Edge can be async)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this._updateVoiceList();
      };
    }
    // Also try immediately and after short delays (mobile often needs this)
    this._updateVoiceList();
    setTimeout(() => this._updateVoiceList(), 500);
    setTimeout(() => this._updateVoiceList(), 1500);
  }

  loadData() {
    try {
      if (!this.rawJson) {
        this.rawJson = this.innerHTML.trim();
        this.innerHTML = '';
      }

      const jsonText = this.rawJson;
      if (jsonText) {
        // Pre-process: escape literal newlines inside JSON strings
        const sanitized = jsonText.replace(/"((?:\\.|[^"\\])*)"/gs, (match, p1) => {
          return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
        });

        const data = JSON.parse(sanitized);
        this.data = (Array.isArray(data) ? data : [data]).map(item => {
          const options = [...item.translationOptions];
          const correctWord = item.translationOptions[item.correctTranslationIndex];
          // Shuffle options
          for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
          }

          const words = item.original.split(/\s+/);
          const start = item.highlightIndex;
          const end = item.highlightIndexEnd !== undefined ? item.highlightIndexEnd : start;
          const originalWord = words.slice(start, end + 1).join(' ').replace(/[.,!?;:]/g, '');

          return {
            ...item,
            highlightIndexEnd: end,
            shuffledOptions: options,
            newCorrectIndex: options.indexOf(correctWord),
            originalWord: originalWord,
            translationWord: correctWord
          };
        });
        this.displayAllLines();
        this.matchingGamesCompleted = 0;
        this.startUnscrambleActivity(false);
        this.startMemoryGame(false);
        this.updateProgress();
      }
    } catch (e) {
      console.error('Failed to parse JSON data for lbl-reader', e);
      this.shadowRoot.innerHTML = `<div class="error">Error loading data. Check console.</div>`;
    }
  }

  displayAllLines() {
    const container = this.shadowRoot.querySelector('.story-container');
    container.innerHTML = '';

    // Initialize score from completed indices
    this.score = this.completedIndices.size;
    this.answeredCount = this.completedIndices.size;

    const langOrg = this.getAttribute('lang-original') || 'en';
    const langTrans = this.getAttribute('lang-translation') || 'th';

    this.data.forEach((lineData, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.index = index;

      const header = document.createElement('div');
      header.classList.add('card-header');

      const originalText = document.createElement('div');
      originalText.classList.add('original-text');

      lineData.original.split(' ').forEach((word, wIdx) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.classList.add('tts-word');
        if (!this.isSwapped && wIdx >= lineData.highlightIndex && wIdx <= lineData.highlightIndexEnd) {
          span.classList.add('highlight');
        }
        span.onclick = (e) => {
          e.stopPropagation();
          if (this.isPlayingAll) this.stopFullPlayback();
          this._speak(word.replace(/[.,!?;:]/g, ''), langOrg);
        };
        originalText.appendChild(span);
      });

      header.appendChild(originalText);
      card.appendChild(header);
      this.renderLineButtons(index, card);

      const fullTranslation = document.createElement('div');
      fullTranslation.classList.add('full-translation');
      lineData.fullTranslation.split(' ').forEach((word, wIdx) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.classList.add('tts-word');
        if (this.isSwapped && wIdx >= lineData.highlightIndex && wIdx <= lineData.highlightIndexEnd) {
          span.classList.add('highlight');
        }
        span.onclick = (e) => {
          e.stopPropagation();
          if (this.isPlayingAll) this.stopFullPlayback();
          this._speak(word.replace(/[.,!?;:]/g, ''), langTrans);
        };
        fullTranslation.appendChild(span);
      });

      const translationOptions = document.createElement('div');
      translationOptions.classList.add('translation-options');

      const isCompleted = this.completedIndices.has(index);
      if (isCompleted) {
        card.classList.add('completed', 'answered');
      }

      lineData.shuffledOptions.forEach((word, oIdx) => {
        const btn = document.createElement('button');
        btn.textContent = word;
        btn.addEventListener('click', () => this.handleSelection(index, oIdx, lineData.newCorrectIndex, btn, card));
        if (isCompleted) {
          btn.disabled = true;
          if (oIdx !== lineData.newCorrectIndex) btn.style.opacity = '0.5';
          else btn.classList.add('success');
        }
        translationOptions.appendChild(btn);
      });

      card.appendChild(fullTranslation);
      card.appendChild(translationOptions);
      container.appendChild(card);
    });

    this.updateProgress();
  }

  _getBestVoice(lang) {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const langPrefix = lang.split(/[-_]/)[0].toLowerCase();
    let langVoices = voices.filter(v => v.lang.toLowerCase() === lang.toLowerCase());
    if (langVoices.length === 0) {
      langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
    }

    if (langVoices.length === 0) return null;

    const priorities = ["natural", "google", "premium", "siri"];
    for (const p of priorities) {
      const found = langVoices.find(v => v.name.toLowerCase().includes(p));
      if (found) return found;
    }

    const nonRobotic = langVoices.find(v => !v.name.toLowerCase().includes("microsoft"));
    return nonRobotic || langVoices[0];
  }

  _isMobile() {
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  _updateVoiceList() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const voiceList = this.shadowRoot.querySelector('.voice-list');
    const voiceBtn = this.shadowRoot.querySelector('#voice-btn');
    if (!voiceList || !voiceBtn) return;

    const langOrg = this.getAttribute('lang-original') || 'en';
    const langPrefix = langOrg.split(/[-_]/)[0].toLowerCase();

    // Filter voices for this language
    let langVoices = voices.filter(v => v.lang.toLowerCase() === langOrg.toLowerCase());
    if (langVoices.length === 0) {
      langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
    }

    if (langVoices.length === 0) {
      voiceBtn.style.display = 'none';
      return;
    }

    voiceBtn.style.display = 'flex';

    voiceList.innerHTML = '';
    const bestVoice = this._getBestVoice(langOrg);

    // If no voice is selected yet, use best voice
    if (!this.selectedVoiceName && bestVoice) {
      this.selectedVoiceName = bestVoice.name;
    }

    langVoices.sort((a, b) => a.name.localeCompare(b.name));

    langVoices.forEach(voice => {
      const btn = document.createElement('button');
      btn.classList.add('voice-option-btn');
      if (this.selectedVoiceName === voice.name) {
        btn.classList.add('active');
      }

      const nameSpan = document.createElement('span');
      nameSpan.textContent = voice.name;
      btn.appendChild(nameSpan);

      if (bestVoice && voice.name === bestVoice.name) {
        const badge = document.createElement('span');
        badge.classList.add('badge');
        badge.textContent = 'Best';
        btn.appendChild(badge);
      }

      btn.onclick = () => {
        this.selectedVoiceName = voice.name;
        this._updateVoiceList();
        this._hideVoiceOverlay();
      };

      voiceList.appendChild(btn);
    });
  }

  _showVoiceOverlay() {
    const overlay = this.shadowRoot.querySelector('.voice-overlay');
    if (overlay) overlay.style.display = 'flex';
  }

  _hideVoiceOverlay() {
    const overlay = this.shadowRoot.querySelector('.voice-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  _speak(text, lang, onEnd = null) {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser. Please try Chrome or Safari.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    let voiceToUse = null;
    const langOrg = this.getAttribute('lang-original') || 'en';
    const langPrefix = lang.split(/[-_]/)[0].toLowerCase();
    const orgPrefix = langOrg.split(/[-_]/)[0].toLowerCase();

    // Only use selectedVoiceName if it's for the current original language
    if (this.selectedVoiceName && langPrefix === orgPrefix) {
      const voices = window.speechSynthesis.getVoices();
      voiceToUse = voices.find(v => v.name === this.selectedVoiceName);
    }

    if (!voiceToUse) {
      voiceToUse = this._getBestVoice(lang);
    }

    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    // Always set lang (critical for Android stability even when voice is set)
    utterance.lang = lang;

    utterance.rate = 0.7;
    if (onEnd) {
      utterance.onend = onEnd;
    }
    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  toggleFullPlayback() {
    if (this.isPlayingAll) {
      if (this.isPaused) {
        this.resumeFullPlayback();
      } else {
        this.pauseFullPlayback();
      }
    } else {
      this.startFullPlayback();
    }
  }

  startFullPlayback() {
    this.isPlayingAll = true;
    this.isPaused = false;
    this.updatePlaybackUI();
    this.playLine(this.playbackIndex, true);
  }

  pauseFullPlayback() {
    this.isPaused = true;
    window.speechSynthesis.pause();
    this.updatePlaybackUI();
  }

  resumeFullPlayback() {
    this.isPaused = false;
    window.speechSynthesis.resume();
    this.updatePlaybackUI();
  }

  stopFullPlayback() {
    window.speechSynthesis.cancel();
    this.isPlayingAll = false;
    this.isPaused = false;
    this.playbackIndex = 0;
    this.clearPlaybackHighlights();
    this.updatePlaybackUI();
  }

  async startRecording(index) {
    if (this.isRecordingLine !== null) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine supported MIME type (iOS Safari doesn't support webm)
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Let browser choose default
          }
        }
      }

      const options = mimeType ? { mimeType } : {};
      this.mediaRecorder = new MediaRecorder(stream, options);
      this._recordingMimeType = this.mediaRecorder.mimeType || mimeType || 'audio/webm';

      let chunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: this._recordingMimeType });
        const duration = Date.now() - this.recordingStartTime;

        // Check if recording is long enough (e.g., > 600ms) to prevent "just clicking"
        if (duration > 600) {
          this.recordedBlobs.set(index, blob);
          this.recordedSentences.add(index);
        } else {
          // Optional: handle "too short" feedback
          console.warn('Recording too short to be counted.');
        }

        // Stop all tracks in the stream to release the mic
        stream.getTracks().forEach(track => track.stop());

        this.isRecordingLine = null;
        this.renderLineButtons(index);
      };

      this.recordingStartTime = Date.now();
      this.isRecordingLine = index;

      // Use a timeslice (1000ms) - helps ensure data capture on some mobile browsers
      this.mediaRecorder.start(1000);
      this.renderLineButtons(index);
    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  playRecordedAudio(index) {
    const blob = this.recordedBlobs.get(index);
    if (!blob) return;

    // Reset any currently playing recording
    if (this.isPlayingRecording !== null) {
      // Logic to stop current recording if needed (simplified here)
    }

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    this.isPlayingRecording = index;
    this.renderLineButtons(index);

    audio.play();
    audio.onended = () => {
      this.isPlayingRecording = null;
      this.renderLineButtons(index);
      URL.revokeObjectURL(url);
    };
  }

  renderLineButtons(index, card = null) {
    if (!card) card = this.shadowRoot.querySelector(`.card[data-index="${index}"]`);
    if (!card) return;
    const header = card.querySelector('.card-header');

    // Find or create the button container
    let btnGroup = header.querySelector('.card-btn-group');
    if (!btnGroup) {
      btnGroup = document.createElement('div');
      btnGroup.classList.add('card-btn-group');
      header.appendChild(btnGroup);
    }

    btnGroup.innerHTML = '';

    // Original Play Button
    const playBtn = document.createElement('button');
    playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    playBtn.classList.add('voice-btn');
    playBtn.title = "Play TTS";
    playBtn.onclick = () => {
      if (this.isPlayingAll) this.stopFullPlayback();
      this.playLine(index, false);
    };
    btnGroup.appendChild(playBtn);

    // Record Button
    const recordBtn = document.createElement('button');
    recordBtn.classList.add('record-btn');
    if (this.isRecordingLine === index) {
      recordBtn.classList.add('recording');
      recordBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>`;
      recordBtn.onclick = () => this.stopRecording();
      recordBtn.title = "Stop Recording";
    } else {
      recordBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>`;
      recordBtn.onclick = () => this.startRecording(index);
      recordBtn.title = "Record Voice";
    }
    btnGroup.appendChild(recordBtn);

    // Playback Recorded Button
    if (this.recordedBlobs.has(index) && this.isRecordingLine !== index) {
      const playRecordedBtn = document.createElement('button');
      if (this.isPlayingRecording === index) {
        playRecordedBtn.classList.add('play-recorded-btn', 'playing');
        playRecordedBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`;
      } else {
        playRecordedBtn.classList.add('play-recorded-btn');
        playRecordedBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`;
      }
      playRecordedBtn.title = "Play Recording";
      playRecordedBtn.onclick = () => this.playRecordedAudio(index);
      btnGroup.appendChild(playRecordedBtn);
    }
  }

  playLine(index, continueNext = false) {
    if (index >= this.data.length) {
      if (continueNext) this.stopFullPlayback();
      return;
    }

    this.playbackIndex = index;
    const lineData = this.data[index];
    const langOrg = this.getAttribute('lang-original') || 'en';

    this.highlightCard(index);
    this.playbackUtterance = this._speak(lineData.original, langOrg, () => {
      if (continueNext && this.isPlayingAll && !this.isPaused) {
        this.playLine(index + 1, true);
      }
    });
  }

  highlightCard(index) {
    this.clearPlaybackHighlights();
    const cards = this.shadowRoot.querySelectorAll('.card');
    const activeCard = cards[index];
    if (activeCard) {
      activeCard.classList.add('playing');
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  clearPlaybackHighlights() {
    this.shadowRoot.querySelectorAll('.card').forEach(c => c.classList.remove('playing'));
  }

  updatePlaybackUI() {
    const playPauseBtn = this.shadowRoot.querySelector('#play-pause-btn');
    if (!playPauseBtn) return;

    if (!this.isPlayingAll) {
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> <span>All</span>`;
    } else if (this.isPaused) {
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> <span>Resume</span>`;
    } else {
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> <span>Pause</span>`;
    }

    const stopBtn = this.shadowRoot.querySelector('#stop-btn');
    if (stopBtn) {
      stopBtn.style.display = this.isPlayingAll ? 'flex' : 'none';
    }
  }

  _shouldShowAudioControls() {
    const ua = navigator.userAgent.toLowerCase();

    // 1. Block known in-app browsers and WebViews
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

  _getAndroidIntentLink() {
    const isAndroid = /android/i.test(navigator.userAgent);
    if (!isAndroid) return '';

    const lessonId = this.getAttribute('lesson-id');
    const url = new URL(window.location.href);
    if (lessonId) {
      url.searchParams.set('lesson', lessonId);
    }

    const urlString = url.toString();
    const urlNoScheme = urlString.replace(/^https?:\/\//, '');
    const scheme = window.location.protocol.replace(':', '');

    return `intent://${urlNoScheme}#Intent;scheme=${scheme};package=com.android.chrome;end`;
  }

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
          // Likely iOS in-app browser or no TTS support
          actionBtn.onclick = (e) => {
            if (!actionBtn.href || actionBtn.href === 'javascript:void(0)') {
              e.preventDefault();
              alert('Please open this page in Safari or Chrome for the best experience with audio features.');
            }
          };
          actionBtn.textContent = 'Use Safari / Chrome';
        }
      }
    }
  }

  handleSelection(cardIndex, selectedIndex, correctIndex, button, card) {
    if (card.classList.contains('answered')) return;

    const isCorrect = selectedIndex === correctIndex;
    if (isCorrect) {
      card.classList.add('answered');
      this.answeredCount++;
      this.completedIndices.add(cardIndex); // Add this line

      if (!card.dataset.hadError) {
        this.score++;
      }

      button.classList.add('success');
      card.classList.add('completed');
      card.classList.remove('failed');

      const buttons = card.querySelectorAll('.translation-options button');
      buttons.forEach(b => {
        b.disabled = true;
        if (b !== button) b.style.opacity = '0.5';
      });

      this.updateProgress();

      const nextCard = card.nextElementSibling;
      if (nextCard && !nextCard.classList.contains('finish-container')) {
        setTimeout(() => {
          nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (this.isAutoplay) {
            this.playLine(cardIndex + 1, false);
          }
        }, 600);
      } else {
        // Last card correctly answered
        setTimeout(() => {
          this.clearPlaybackHighlights();
          const finishBtn = this.shadowRoot.querySelector('.finish-btn');
          if (finishBtn) {
            finishBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 600);
      }
    } else {
      button.classList.add('error');
      button.disabled = true;
      card.classList.add('failed');
      card.dataset.hadError = "true";
    }
  }

  updateProgress() {
    const progressText = this.shadowRoot.querySelector('.progress-text');
    if (progressText) {
      // Consistently show story progress (lines read)
      progressText.textContent = `${this.score} / ${this.data.length}`;
    }
  }

  startUnscrambleActivity(shouldScroll = true) {
    this.shadowRoot.querySelector('#scramble-section').style.display = 'block';
    this.unscrambleData = [];
    this.currentUnscrambleIndex = 0;
    this.unscrambleScore = 0;
    this.userUnscrambledWords = [];
    // Filter out sentences that have been used too many times if possible
    if (!this.unscrambleUsedSentences) {
      this.unscrambleUsedSentences = new Set();
    }

    let availableIndices = String.keys ? Object.keys(this.data) : Array.from(this.data.keys());
    availableIndices = availableIndices.map(i => parseInt(i));

    const unusedIndices = availableIndices.filter(i => !this.unscrambleUsedSentences.has(i));

    let selectedIndices = [];
    if (unusedIndices.length >= 5) {
      // We have enough unused sentences
      selectedIndices = unusedIndices.sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
      // Not enough unused, take all unused and fill the rest with random ones
      selectedIndices = [...unusedIndices];
      const remainingNeeded = 5 - selectedIndices.length;
      const otherIndices = availableIndices.filter(i => !unusedIndices.includes(i))
        .sort(() => 0.5 - Math.random());
      selectedIndices = selectedIndices.concat(otherIndices.slice(0, remainingNeeded));
    }

    // Mark as used
    selectedIndices.forEach(i => this.unscrambleUsedSentences.add(i));

    // If we've used all sentences, reset the set for the next round (so we don't get stuck)
    if (this.unscrambleUsedSentences.size >= this.data.length) {
      this.unscrambleUsedSentences.clear();
      // But keep the current ones as "used" so we don't repeat them immediately in the next round of re-fills
      selectedIndices.forEach(i => this.unscrambleUsedSentences.add(i));
    }

    this.unscrambleData = selectedIndices.map(idx => {
      const item = this.data[idx];
      const words = item.original.split(/\s+/).filter(w => w.length > 0);
      const shuffledWords = [...words].sort(() => 0.5 - Math.random());
      return {
        ...item,
        correctWords: words,
        shuffledWords: shuffledWords
      };
    });
    this.unscrambleTotal = this.unscrambleData.length;

    this.currentUnscrambleIndex = 0;
    this.unscrambleScore = 0;
    this.userUnscrambledWords = [];

    const langOrg = this.getAttribute('lang-original') || 'en';
    if (langOrg === 'th') {
      this.startMemoryGame();
      return;
    }

    this.renderUnscrambleChallenge(shouldScroll);
    this.updateProgress();
  }


  renderUnscrambleChallenge(shouldScroll = true) {
    const container = this.shadowRoot.querySelector('.scramble-container');
    container.innerHTML = '';

    const challenge = this.unscrambleData[this.currentUnscrambleIndex];

    const unscrambleCard = document.createElement('div');
    unscrambleCard.classList.add('card', 'unscramble-card', 'playing');

    const title = document.createElement('h3');
    title.innerHTML = `Unscramble the Sentence <span style="font-size: 0.8em; color: #64748b; font-weight: normal; margin-left: 0.5em; white-space: nowrap;">(${this.currentUnscrambleIndex + 1} / ${this.unscrambleTotal})</span>`;
    unscrambleCard.appendChild(title);

    const langOrg = this.getAttribute('lang-original') || 'en';
    const playBtn = document.createElement('button');
    playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    playBtn.classList.add('voice-btn');
    playBtn.style.margin = "0 auto 1em auto";
    playBtn.onclick = () => {
      this._speak(challenge.original, langOrg);
    };
    unscrambleCard.appendChild(playBtn);

    const translation = document.createElement('div');
    translation.classList.add('full-translation');
    translation.style.fontSize = "1.2em";
    translation.textContent = challenge.fullTranslation;
    translation.setAttribute('lang', this.getAttribute('lang-translation') || 'th');
    unscrambleCard.appendChild(translation);

    const resultArea = document.createElement('div');
    resultArea.classList.add('unscramble-result');
    resultArea.setAttribute('lang', langOrg);
    unscrambleCard.appendChild(resultArea);

    const poolArea = document.createElement('div');
    poolArea.classList.add('unscramble-pool');
    poolArea.setAttribute('lang', langOrg);
    unscrambleCard.appendChild(poolArea);

    const updateUI = () => {
      resultArea.innerHTML = '';
      this.userUnscrambledWords.forEach((word, idx) => {
        const btn = document.createElement('button');
        btn.textContent = word;
        btn.onclick = () => {
          this.userUnscrambledWords.splice(idx, 1);
          updateUI();
        };
        resultArea.appendChild(btn);
      });

      poolArea.innerHTML = '';
      challenge.shuffledWords.forEach((word, idx) => {
        // Only show if not already picked (simplified: count occurrences)
        const pickedCount = this.userUnscrambledWords.filter(w => w === word).length;
        const totalCount = challenge.shuffledWords.filter(w => w === word).length;

        if (pickedCount < totalCount) {
          const btn = document.createElement('button');
          btn.textContent = word;
          btn.onclick = () => {
            this.userUnscrambledWords.push(word);
            updateUI();
          };
          poolArea.appendChild(btn);
        }
      });
    };

    updateUI();

    const actions = document.createElement('div');
    actions.classList.add('unscramble-actions');

    const skipBtn = document.createElement('button');
    skipBtn.textContent = 'Skip';
    skipBtn.style.opacity = "0.7";
    skipBtn.onclick = () => {
      this.currentUnscrambleIndex++;
      this.userUnscrambledWords = [];
      if (this.currentUnscrambleIndex < this.unscrambleData.length) {
        this.renderUnscrambleChallenge();
        this.updateProgress();
      } else {
        this.renderUnscrambleCompletion();
      }
    };

    const checkBtn = document.createElement('button');
    checkBtn.textContent = 'Check';
    checkBtn.classList.add('finish-btn');
    checkBtn.style.padding = "0.8em 2em";
    checkBtn.onclick = () => {
      const isCorrect = this.userUnscrambledWords.join(' ') === challenge.correctWords.join(' ');
      if (isCorrect) {
        this.unscrambleScore++;
        checkBtn.textContent = 'Correct! Next';
        checkBtn.classList.add('success');
        checkBtn.onclick = () => {
          this.currentUnscrambleIndex++;
          this.userUnscrambledWords = [];
          if (this.currentUnscrambleIndex < this.unscrambleData.length) {
            this.renderUnscrambleChallenge();
            this.updateProgress();
          } else {
            this.renderUnscrambleCompletion();
          }
        };
      } else {
        checkBtn.classList.add('error');
        setTimeout(() => checkBtn.classList.remove('error'), 500);
      }
    };

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.onclick = () => {
      this.userUnscrambledWords = [];
      updateUI();
    };

    actions.appendChild(resetBtn);
    actions.appendChild(skipBtn);
    actions.appendChild(checkBtn);
    unscrambleCard.appendChild(actions);

    container.appendChild(unscrambleCard);
    if (shouldScroll) {
      unscrambleCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  startMemoryGame(shouldScroll = true) {
    this.shadowRoot.querySelector('#memory-section').style.display = 'block';
    this.matchingGamesCompleted++;
    this.matchedPairsCount = 0;
    this.flippedCards = [];
    this.isCheckingMatch = false;

    // Collect all unique word pairs from data
    const allPairs = this.data.map(item => ({
      original: item.originalWord,
      translation: item.translationWord
    }));

    // Pick 6 random unique pairs
    const uniquePairs = [];
    const usedIndices = new Set();
    while (uniquePairs.length < 6 && usedIndices.size < allPairs.length) {
      const idx = Math.floor(Math.random() * allPairs.length);
      if (!usedIndices.has(idx)) {
        uniquePairs.push(allPairs[idx]);
        usedIndices.add(idx);
      }
    }

    // Prepare cards: 2 for each pair
    const cards = [];
    uniquePairs.forEach((pair, index) => {
      cards.push({ id: index, type: 'original', text: pair.original, lang: this.getAttribute('lang-original') || 'en' });
      cards.push({ id: index, type: 'translation', text: pair.translation, lang: this.getAttribute('lang-translation') || 'th' });
    });

    // Shuffle cards
    this.memoryGameData = cards.sort(() => 0.5 - Math.random());
    this.memoryTotal = this.memoryGameData.length / 2;

    this.renderMemoryGameUI();
    this.updateProgress();
  }

  renderUnscrambleCompletion() {
    const container = this.shadowRoot.querySelector('.scramble-container');
    if (container) {
      container.innerHTML = `
        <div class="card unscramble-card" style="text-align: center; border-color: #22c55e; background: #f0fdf4;">
          <h3 style="color: #16a34a;">Unscramble Complete!</h3>
          <p>You scored ${this.unscrambleScore} / ${this.unscrambleTotal}</p>
          <div style="display: flex; gap: 1em; justify-content: center; margin-top: 1em;">
            <button class="control-btn" id="scramble-again-btn">Try Again (Different Sentences)</button>
          </div>
        </div>
      `;

      container.querySelector('#scramble-again-btn').onclick = () => {
        this.startUnscrambleActivity();
      };
    }

    this.unscrambleCompleted = true;
  }

  renderMemoryGameUI() {
    const container = this.shadowRoot.querySelector('.memory-container');
    container.innerHTML = '';

    const gameHeader = document.createElement('div');
    gameHeader.classList.add('memory-game-header');
    gameHeader.innerHTML = `
      <h3>Memory Matching Game</h3>
      <p>Match the word with its translation!</p>
    `;
    container.appendChild(gameHeader);

    const grid = document.createElement('div');
    grid.classList.add('memory-grid');

    this.memoryGameData.forEach((cardData, idx) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.index = idx;
      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front">?</div>
          <div class="memory-card-back" lang="${cardData.lang}">${cardData.text}</div>
        </div>
      `;
      card.onclick = () => this.handleMemoryCardFlip(card, cardData);
      grid.appendChild(card);
    });

    container.appendChild(grid);

    const gameActions = document.createElement('div');
    gameActions.classList.add('memory-game-actions');

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again (New Words)';
    playAgainBtn.onclick = () => this.startMemoryGame();
    gameActions.appendChild(playAgainBtn);

    container.appendChild(gameActions);

    const mainFinishContainer = this.shadowRoot.querySelector('.finish-container');
    mainFinishContainer.style.display = 'block';
    mainFinishContainer.querySelector('.finish-btn').onclick = () => this.showFinalForm();
  }

  handleMemoryCardFlip(cardElement, cardData) {
    if (this.isCheckingMatch || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
      return;
    }

    this._speak(cardData.text, cardData.lang);
    cardElement.classList.add('flipped');
    this.flippedCards.push({ element: cardElement, data: cardData });

    if (this.flippedCards.length === 2) {
      this.isCheckingMatch = true;
      const [card1, card2] = this.flippedCards;

      if (card1.data.id === card2.data.id) {
        // Match!
        setTimeout(() => {
          card1.element.classList.add('matched');
          card2.element.classList.add('matched');
          this.matchedPairsCount++;
          this.flippedCards = [];
          this.isCheckingMatch = false;
          this.updateProgress();

          if (this.matchedPairsCount === (this.memoryGameData.length / 2)) {
            // Game Won!
            this.memoryCompleted = true;
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          card1.element.classList.remove('flipped');
          card2.element.classList.remove('flipped');
          this.flippedCards = [];
          this.isCheckingMatch = false;
        }, 1200);
      }
    }
  }

  showFinalForm() {
    const stickyBar = this.shadowRoot.querySelector('.sticky-bar');
    if (stickyBar) stickyBar.style.display = 'none';

    const formOverlay = this.shadowRoot.querySelector('.form-overlay');
    formOverlay.style.display = 'flex';

    const nicknameInput = this.shadowRoot.querySelector('#nickname');
    const numberInput = this.shadowRoot.querySelector('#student-number');

    if (this.studentInfo.nickname) {
      nicknameInput.value = this.studentInfo.nickname;
      nicknameInput.disabled = true;
      numberInput.value = this.studentInfo.number;
      numberInput.disabled = true;

      // Fix: Automatically regenerate report with latest scores
      this.generateReport();
    } else {
      // Ensure initial form is shown if no student info yet
      this.shadowRoot.querySelector('.initial-form').style.display = 'block';
      this.shadowRoot.querySelector('.report-area').innerHTML = '';
    }
  }

  generateReport() {
    const nickname = this.shadowRoot.querySelector('#nickname').value;
    const number = this.shadowRoot.querySelector('#student-number').value;

    if (!nickname || !number) {
      alert('Please enter both nickname and student number.');
      return;
    }

    this.studentInfo = { nickname, number };
    const storyTitle = this.getAttribute('story-title') || 'Story Practice';
    const timestamp = new Date().toLocaleString();

    // Calculate weighted percentage scores
    const selectionRatio = this.data.length > 0 ? this.score / this.data.length : 0;
    const recordingRatio = this.data.length > 0 ? this.recordedSentences.size / this.data.length : 0;

    const unscrambleTotal = this.unscrambleData.length || this.unscrambleTotal;
    const scrambleRatio = unscrambleTotal > 0 ? this.unscrambleScore / unscrambleTotal : 0;

    const memoryTotal = (this.memoryGameData.length / 2) || this.memoryTotal;
    const memoryRatio = memoryTotal > 0 ? (this.matchedPairsCount / memoryTotal) : 0;

    let weightSelection = 85;
    let weightScramble = 10;
    let weightMemory = 5;

    // Handle skipped Unscramble activity (e.g. for Thai)
    if (this.unscrambleData.length === 0) {
      weightSelection += weightScramble;
      weightScramble = 0;
    }

    const totalScoreNoRec = (selectionRatio * weightSelection) + (scrambleRatio * weightScramble) + (memoryRatio * weightMemory);
    const totalScoreWithRec = (selectionRatio * (weightSelection / 2)) + (recordingRatio * (weightSelection / 2)) + (scrambleRatio * weightScramble) + (memoryRatio * weightMemory);

    const reportArea = this.shadowRoot.querySelector('.report-area');
    reportArea.innerHTML = `
      <div class="report-card">
        <div class="report-icon">📄</div>
        <h3>Report Card: ${storyTitle}</h3>
        <p><strong>Student:</strong> ${nickname} (${number})</p>
        <p><strong>Overall Score:</strong> ${Math.round(totalScoreNoRec)}%</p>
        <p><strong>Score (with recordings):</strong> ${Math.round(totalScoreWithRec)}%</p>
        <hr style="margin: 1em 0; border: none; border-top: 1px solid #eee;">
        <p><strong>Translation Score:</strong> ${this.score} / ${this.data.length}</p>
        <p><strong>Sentences Recorded:</strong> ${this.recordedSentences.size} / ${this.data.length}</p>
        ${unscrambleTotal > 0 ? `<p><strong>Unscramble Score:</strong> ${this.unscrambleScore} / ${unscrambleTotal}</p>` : ''}
        <p><strong>Matching Pairs:</strong> ${this.matchedPairsCount} / ${memoryTotal}</p>
        <p><strong>Completed On:</strong> ${timestamp}</p>
        
        <div class="report-actions">
          <button class="return-btn">Return to Story</button>
          <button class="reset-all-btn">Reset All Progress</button>
        </div>
      </div>
    `;

    // Display individual recordings for spot checking
    if (this.recordedBlobs.size > 0) {
      const recordingsSection = document.createElement('div');
      recordingsSection.classList.add('recordings-section');

      const sectionTitle = document.createElement('h4');
      sectionTitle.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#2563eb"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg> Student Recordings`;
      recordingsSection.appendChild(sectionTitle);

      const recordingsList = document.createElement('div');
      recordingsList.classList.add('recordings-list');

      // Sort recordings by index so they appear in story order
      const sortedIndices = Array.from(this.recordedBlobs.keys()).sort((a, b) => a - b);

      sortedIndices.forEach(idx => {
        const lineData = this.data[idx];
        const item = document.createElement('div');
        item.classList.add('recording-item');

        const playBtn = document.createElement('button');
        playBtn.classList.add('recording-play-btn');
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        playBtn.title = "Play Recording";
        playBtn.onclick = () => this.playRecordedAudio(idx);

        const text = document.createElement('div');
        text.classList.add('recording-text');
        text.textContent = lineData.original;

        item.appendChild(playBtn);
        item.appendChild(text);
        recordingsList.appendChild(item);
      });

      recordingsSection.appendChild(recordingsList);
      reportArea.appendChild(recordingsSection);
    }

    this.shadowRoot.querySelector('.initial-form').style.display = 'none';

    reportArea.querySelector('.return-btn').onclick = () => {
      this.shadowRoot.querySelector('.form-overlay').style.display = 'none';
      const stickyBar = this.shadowRoot.querySelector('.sticky-bar');
      if (stickyBar) stickyBar.style.display = 'flex';
    };

    reportArea.querySelector('.reset-all-btn').onclick = () => {
      if (confirm('Are you sure you want to reset all progress? This will delete all your scores and recordings.')) {
        this.completedIndices.clear();
        this.recordedBlobs.clear();
        this.recordedSentences.clear();
        this.unscrambleScore = 0;
        this.matchedPairsCount = 0;
        this.unscrambleCompleted = false;
        this.memoryCompleted = false;
        this.score = 0;
        this.answeredCount = 0;

        // Reset activities
        this.unscrambleUsedSentences?.clear();

        this.shadowRoot.querySelector('.form-overlay').style.display = 'none';
        this.shadowRoot.querySelector('.report-area').innerHTML = '';
        this.shadowRoot.querySelector('.initial-form').style.display = 'block';

        this.loadData();
      }
    };
  }

  swapLanguages() {
    const oldOrg = this.getAttribute('lang-original') || 'en';
    const oldTrans = this.getAttribute('lang-translation') || 'th';

    this.setAttribute('lang-original', oldTrans);
    this.setAttribute('lang-translation', oldOrg);
    this.isSwapped = !this.isSwapped;
    this.selectedVoiceName = null;
    this._updateVoiceList();

    this.data = this.data.map(item => {
      const newOriginal = item.fullTranslation;
      const newFullTranslation = item.original;
      const newOriginalWord = item.translationWord;
      const newTranslationWord = item.originalWord;

      return {
        ...item,
        original: newOriginal,
        fullTranslation: newFullTranslation,
        originalWord: newOriginalWord,
        translationWord: newTranslationWord,
        // Keep options as requested
      };
    });

    this.displayAllLines();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: inherit;
          max-width: 80em;
          margin: 1em auto;
          color: #333;
          position: relative;
        }

        .sticky-bar {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 0.8em 1.2em;
          border-radius: 1em;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          z-index: 100;
          margin-bottom: 1.5em;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .playback-controls {
          display: flex;
          gap: 1em;
          align-items: center;
        }

        .autoplay-toggle-container {
          display: flex;
          align-items: center;
          gap: 0.8em;
          padding: 0.4em 0.8em;
          background: rgba(248, 250, 252, 0.5);
          border-radius: 2em;
          border: 1px solid #e2e8f0;
          font-size: 0.85em;
          font-weight: 600;
          color: #475569;
          user-select: none;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 32px;
          height: 18px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 18px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #2563eb;
        }

        input:checked + .slider:before {
          transform: translateX(14px);
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 0.5em;
          padding: 0.5em 1em;
          font-size: 0.9em;
          font-weight: 600;
          border-radius: 0.6em;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #2563eb;
        }

        #play-pause-btn {
          background: #2563eb;
          color: white;
          border-color: #1d4ed8;
        }

        #play-pause-btn:hover {
          background: #1d4ed8;
        }

        #stop-btn {
          display: none; /* Shown via JS */
        }

        .progress-text {
          font-weight: 700;
          color: #2563eb;
          font-size: 1.1em;
          white-space: nowrap;
        }

        .story-container {
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 1em;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .story-container::-webkit-scrollbar {
          width: 6px;
        }
        .story-container::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1.2em;
          padding: 1em;
          box-shadow: 0 0.5em 2em rgba(0,0,0,0.05);
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e2e8f0;
          opacity: 0.7;
          transform: scale(0.98);
        }

        .card:hover, .card.completed {
          opacity: 1;
          transform: scale(1);
          box-shadow: 0 1em 3em rgba(0,0,0,0.1);
        }

        .card.completed {
          border-color: #22c55e;
          background: #f0fdf4;
        }

        .card.failed {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .card.playing {
          border-color: #2563eb;
          background: #eff6ff;
          opacity: 1;
          transform: scale(1.02);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 1em;
          margin-bottom: 0.5em;
        }

        .original-text {
          font-size: 1.4em;
          line-height: 1.6;
          font-weight: 500;
          flex: 1;
        }

        .tts-word {
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 0.2em;
          padding: 0 0.1em;
        }

        .tts-word:hover {
          background: #f1f5f9;
        }

        .voice-btn {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          padding: 0.5em;
          font-size: 1.1em;
          border-radius: 50%;
          width: 2.2em;
          height: 2.2em;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          color: #64748b;
        }

        .voice-btn {
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 0;
          font-size: 1.1em;
          border-radius: 50%;
          width: 2.2em;
          height: 2.2em;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          color: #000033;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .voice-btn:hover {
          background: #c7d2fe;
          color: #000;
          transform: scale(1.1);
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .card-btn-group {
          display: flex;
          gap: 0.6em;
          align-items: center;
          padding: 0.4em;
          background: #fdfdfd;
          border-radius: 2em;
          border: 1px solid #f1f5f9;
        }

        .record-btn, .play-recorded-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0;
          border-radius: 50%;
          width: 2.2em;
          height: 2.2em;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #1a202c;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .record-btn:hover {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #fecaca;
          transform: scale(1.1);
        }

        .record-btn.recording {
          background: #ef4444;
          color: white;
          border-color: #dc2626;
          animation: pulse 1.5s infinite;
        }

        .play-recorded-btn {
          background: #f0fdf4;
          color: #15803d;
          border-color: #bbf7d0;
        }

        .play-recorded-btn.playing {
          background: #15803d;
          color: white;
          border-color: #14532d;
          animation: pulse-green 1.5s infinite;
        }

        .play-recorded-btn:hover {
          background: #bbf7d0;
          color: #14532d;
          transform: scale(1.1);
        }

        @keyframes pulse-green {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(21, 128, 61, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(21, 128, 61, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(21, 128, 61, 0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .full-translation {
          font-size: 1em;
          color: #64748b;
          margin-bottom: 1.5em;
          font-style: italic;
        }

        .highlight {
          color: #2563eb;
          font-weight: 700;
          border-bottom: 3px solid #bfdbfe;
          padding: 0 0.1em;
          transition: all 0.3s ease;
        }

        .card.completed .highlight {
          color: #16a34a;
          border-bottom-color: #bbf7d0;
        }

        .card.failed .highlight {
          color: #dc2626;
          border-bottom-color: #fecaca;
        }

        .translation-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8em;
          justify-content: center;
        }

        button {
          font-family: inherit;
          font-size: 1em;
          padding: 0.6em 1.2em;
          cursor: pointer;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 0.7em;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          color: #475569;
        }

        button:hover:not(:disabled) {
          background: blue;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        button.success {
          background: #22c55e !important;
          color: white;
          border-color: #16a34a;
          animation: bounce 0.4s ease;
        }

        button.error {
          background: #ef4444 !important;
          color: white;
          border-color: #dc2626;
          animation: shake 0.4s ease;
        }

        .finish-container {
          padding: 2em 0 5em 0;
          text-align: center;
        }

        .finish-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 1.2em 2.5em;
          font-size: 1.1em;
          font-weight: 700;
          border-radius: 0.8em;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
          transition: all 0.3s ease;
        }

        .finish-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.2);
        }

        .form-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 1.2em;
          z-index: 20;
          animation: fadeIn 0.3s ease;
        }

        .form-container {
          width: 80%;
          max-width: 300px;
          text-align: center;
        }

        input {
          width: 100%;
          padding: 1em;
          margin-bottom: 1em;
          border: 1px solid #e2e8f0;
          border-radius: 0.5em;
          font-size: 1em;
          box-sizing: border-box;
        }

        .generate-btn, .try-again-btn {
          background: #2563eb;
          color: white;
          border: none;
          width: 100%;
          padding: 1em;
          font-weight: 600;
          border-radius: 0.5em;
        }

        .report-card {
          background: white;
          padding: 2em;
          border-radius: 1em;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          text-align: left;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .browser-prompt-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          display: none;
          flex-direction: column;
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
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .browser-prompt-card h2 {
          margin-top: 0;
          color: #1e293b;
          font-size: 1.5em;
        }

        .browser-prompt-card p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2em;
        }

        .browser-action-btn {
          display: inline-block;
          background: #2563eb;
          color: white;
          text-decoration: none;
          padding: 1em 2em;
          border-radius: 0.75em;
          font-weight: 600;
          transition: background 0.2s;
          cursor: pointer;
          border: none;
          width: 100%;
          box-sizing: border-box;
        }

        .browser-action-btn:hover {
          background: #1d4ed8;
        }
        
        .close-prompt {
          margin-top: 1.5em;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.9em;
          text-decoration: underline;
        }

        /* Combined Container Styles */
        .activities-wrapper {
          display: flex;
          flex-direction: column;
          gap: 3em;
          padding: 1em;
          padding-bottom: 10em;
        }

        .section-divider {
          border: none;
          border-top: 2px dashed #e2e8f0;
          margin: 2em 0;
          position: relative;
        }

        .section-divider::after {
          content: attr(data-label);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 0 1em;
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Modal Styles */
        .form-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .form-container {
          background: white;
          width: 90%;
          max-width: 450px;
          padding: 2.5em;
          border-radius: 1.5em;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          text-align: center;
          max-height: 90vh;
          overflow-y: auto;
        }

        .report-area {
          width: 100%;
        }

        .report-card {
          text-align: left;
        }

        .report-actions {
          display: flex;
          flex-direction: column;
          gap: 0.8em;
          margin-top: 2em;
        }

        .return-btn {
          background: #22c55e;
          color: white;
          border: none;
          width: 100%;
          padding: 1em;
          font-weight: 600;
          border-radius: 0.5em;
          cursor: pointer;
          transition: background 0.2s;
        }

        .return-btn:hover {
          background: #16a34a;
        }

        .reset-all-btn {
          background: #ef4444;
          color: white;
          border: none;
          width: 100%;
          padding: 1em;
          font-weight: 600;
          border-radius: 0.5em;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1em;
          font-size: 0.85em;
          opacity: 0.9;
        }

        .reset-all-btn:hover {
          background: #dc2626;
          opacity: 1;
        }

        .unscramble-card {
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
          box-sizing: border-box;
        }

        .unscramble-card h3 {
          margin-top: 0;
          color: #2563eb;
        }

        .unscramble-result {
          min-height: 3em;
          border-bottom: 2px dashed #e2e8f0;
          margin-bottom: 1em;
          padding: 0.5em;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          justify-content: center;
        }

        .unscramble-pool {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          justify-content: center;
          margin-bottom: 2em;
        }

        .unscramble-actions {
          display: flex;
          gap: 1em;
          font-size: 0.9em;
          padding: 0.5em;
          justify-content: center;
          flex-wrap: wrap;
        }

        .unscramble-result button {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }

        .unscramble-pool button {
          background: #f8fafc;
        }

        .memory-game-header {
          text-align: center;
          margin-bottom: 2em;
        }

        .memory-game-header h3 {
          color: #2563eb;
          margin: 0;
        }

        .memory-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1em;
          width: 100%;
          max-width: 500px;
          margin: 0 auto 2em auto;
          padding: 1em;
          box-sizing: border-box;
        }

        .memory-card {
          aspect-ratio: 4/5;
          perspective: 1000px;
          cursor: pointer;
          min-height: 100px;
        }

        .memory-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          border-radius: 0.8em;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .memory-card.flipped .memory-card-inner {
          transform: rotateY(180deg);
        }

        .memory-card-front, .memory-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.8em;
          padding: 0.5em;
          font-weight: 600;
          font-size: 0.9em;
          box-sizing: border-box;
          border: 1px solid #e2e8f0;
        }

        .memory-card-front {
          background-color: #2563eb;
          color: white;
          font-size: 2em;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.2);
        }

        .memory-card-back {
          background-color: white;
          color: #1e293b;
          transform: rotateY(180deg);
          word-break: break-word;
          font-size: 1.1em;
          padding: 0.8em;
          line-height: 1.2;
        }

        .memory-card.matched .memory-card-inner {
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
          border: 2px solid #22c55e;
        }

        .memory-game-actions {
          display: flex;
          gap: 1em;
          justify-content: center;
          margin-top: 2em;
        }

        .report-icon {
          font-size: 3em;
          margin-bottom: 0.5em;
          text-align: center;
        }

        .recordings-section {
          margin-top: 1.5em;
          background: white;
          padding: 1.5em;
          border-radius: 1em;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          max-width: 500px;
          width: 100%;
          box-sizing: border-box;
          animation: fadeIn 0.5s ease;
        }

        .recordings-section h4 {
          margin-top: 0;
          margin-bottom: 1em;
          color: #1e293b;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5em;
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .recordings-list {
          display: flex;
          flex-direction: column;
          gap: 0.8em;
        }

        .recording-item {
          display: flex;
          align-items: center;
          gap: 1em;
          padding: 0.6em;
          border-radius: 0.5em;
          background: #f8fafc;
          transition: background 0.2s;
        }

        .recording-item:hover {
          background: #f1f5f9;
        }

        .recording-play-btn {
          background: #eef2ff;
          color: #2563eb;
          border: 1px solid #c7d2fe;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .recording-play-btn:hover {
          background: #c7d2fe;
          color: #1a202c;
          transform: scale(1.1);
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .recording-play-btn:active {
          transform: scale(0.95);
        }

        .recording-text {
          font-size: 0.9em;
          color: #475569;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        @media (max-width: 600px) {
          .sticky-bar {
            padding: 0.5em 0.8em;
            gap: 0.5em;
          }
          .playback-controls {
            gap: 0.5em;
          }
          .control-btn span {
            display: none;
          }
          .autoplay-toggle-container {
            padding: 0.4em 0.5em;
          }
          .progress-text {
            font-size: 0.9em;
            white-space: nowrap;
          }
        }

        @media (min-width: 601px) {
          .memory-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .voice-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .voice-card {
          background: white;
          width: 90%;
          max-width: 400px;
          max-height: 80vh;
          border-radius: 1.2em;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .voice-card-header {
          padding: 1.25em;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .voice-card-header h3 {
          margin: 0;
          font-size: 1.1em;
          color: #1e293b;
        }

        .close-voice-btn {
          background: none;
          border: none;
          padding: 0.5em;
          color: #94a3b8;
          cursor: pointer;
        }

        .voice-list {
          padding: 1em;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .voice-option-btn {
          width: 100%;
          text-align: left !important;
          padding: 0.8em 1em !important;
          border: 1px solid #f1f5f9 !important;
          background: #f8fafc !important;
          border-radius: 0.6em !important;
          font-size: 0.9em !important;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
          color: #475569 !important;
        }

        .voice-option-btn:hover {
          background: #f1f5f9 !important;
          border-color: #e2e8f0 !important;
        }

        .voice-option-btn.active {
          background: #eff6ff !important;
          border-color: #3b82f6 !important;
          color: #2563eb !important;
          font-weight: 600 !important;
        }

        .voice-option-btn .badge {
          font-size: 0.75em;
          background: #dcfce7;
          color: #166534;
          padding: 0.2em 0.5em;
          border-radius: 1em;
        }
      </style>
      <div class="sticky-bar">
        <div class="playback-controls">
          <div class="autoplay-toggle-container" id="autoplay-container">
            <span>Auto-Play</span>
            <label class="switch">
              <input type="checkbox" id="autoplay-checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
          <button class="control-btn" id="play-pause-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> 
            <span>All</span>
          </button>
          <button class="control-btn" id="stop-btn" title="Stop Playback">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
            <span>Stop</span>
          </button>
          <button class="control-btn" id="swap-btn" title="Swap Languages">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>
          </button>
          <button class="control-btn" id="voice-btn" title="Choose Voice">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z"/></svg>
          </button>
        </div>
        <div class="progress-text">0 / 0</div>
      </div>
      <div class="activities-wrapper">
        <div id="reading-section">
          <div class="story-container"></div>
        </div>
        
        <div id="scramble-section">
          <hr class="section-divider" data-label="Unscramble">
          <div class="scramble-container"></div>
        </div>

        <div id="memory-section">
          <hr class="section-divider" data-label="Memory Game">
          <div class="memory-container"></div>
        </div>

        <div class="finish-container">
          <button class="finish-btn">Finish & See Report</button>
        </div>
      </div>

      <div class="form-overlay">
        <div class="form-container">
          <div class="initial-form">
            <h2>Great Job!</h2>
            <p>Please enter your details to generate your report card.</p>
            <input type="text" id="nickname" placeholder="Your Nickname">
            <input type="text" id="student-number" placeholder="Student Number">
            <button class="generate-btn">Generate Report Card</button>
          </div>
          <div class="report-area"></div>
        </div>
      </div>

      <div class="browser-prompt-overlay">
        <div class="browser-prompt-card">
          <h2>Better in a Browser</h2>
          <p>It looks like you're using an in-app browser. For the best experience (including audio features), please open this page in <b>Chrome</b> or <b>Safari</b>.</p>
          <a class="browser-action-btn" href="javascript:void(0)">Open Browser</a>
          <button class="close-prompt" onclick="this.parentElement.parentElement.style.display='none'">Continue anyway</button>
        </div>
      </div>
      <div class="voice-overlay">
        <div class="voice-card">
          <div class="voice-card-header">
            <h3>Choose Voice</h3>
            <button class="close-voice-btn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
          <div class="voice-list"></div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.generate-btn').onclick = () => this.generateReport();
    this.shadowRoot.querySelector('#play-pause-btn').onclick = () => this.toggleFullPlayback();
    this.shadowRoot.querySelector('#stop-btn').onclick = () => this.stopFullPlayback();
    this.shadowRoot.querySelector('#swap-btn').onclick = () => this.swapLanguages();
    this.shadowRoot.querySelector('#voice-btn').onclick = () => this._showVoiceOverlay();
    this.shadowRoot.querySelector('.close-voice-btn').onclick = () => this._hideVoiceOverlay();
    this.shadowRoot.querySelector('.voice-overlay').onclick = (e) => {
      if (e.target.classList.contains('voice-overlay')) this._hideVoiceOverlay();
    };

    // Initial population
    this._updateVoiceList();

    const autoplayCheckbox = this.shadowRoot.querySelector('#autoplay-checkbox');
    autoplayCheckbox.onchange = (e) => {
      this.isAutoplay = e.target.checked;
    };

    if (!this._shouldShowAudioControls()) {
      this.shadowRoot.querySelector('#autoplay-container').style.display = 'none';
    }
  }
}

customElements.define('lbl-reader', LblReader);
