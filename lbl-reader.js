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
        this.unscrambleData = [];
        this.currentUnscrambleIndex = 0;
        this.unscrambleScore = 0;
        this.userUnscrambledWords = [];
        this.matchingGamesCompleted = 0;
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
    this.score = 0;
    this.answeredCount = 0;

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
        // Only highlight if NOT swapped
        // Only highlight if NOT swapped
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

      const playBtn = document.createElement('button');
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      playBtn.classList.add('voice-btn');
      playBtn.onclick = () => {
        if (this.isPlayingAll) this.stopFullPlayback();
        this.playLine(index, false);
      };

      header.appendChild(originalText);
      header.appendChild(playBtn);

      const fullTranslation = document.createElement('div');
      fullTranslation.classList.add('full-translation');
      // Render translation using spans so it can be highlighted when swapped
      lineData.fullTranslation.split(' ').forEach((word, wIdx) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.classList.add('tts-word');
        // Only highlight if IS swapped
        // Only highlight if IS swapped
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

      lineData.shuffledOptions.forEach((word, oIdx) => {
        const btn = document.createElement('button');
        btn.textContent = word;
        btn.addEventListener('click', () => this.handleSelection(index, oIdx, lineData.newCorrectIndex, btn, card));
        translationOptions.appendChild(btn);
      });

      card.appendChild(header);
      card.appendChild(fullTranslation);
      card.appendChild(translationOptions);
      container.appendChild(card);
    });

    const finishBtnContainer = document.createElement('div');
    finishBtnContainer.classList.add('finish-container');
    const finishBtn = document.createElement('button');
    finishBtn.textContent = 'Continue to Activity';
    finishBtn.classList.add('finish-btn');
    finishBtn.onclick = () => this.startUnscrambleActivity();
    finishBtnContainer.appendChild(finishBtn);
    container.appendChild(finishBtnContainer);

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
    const voiceSelect = this.shadowRoot.querySelector('#voice-select');
    if (!voiceSelect) return;

    const langOrg = this.getAttribute('lang-original') || 'en';
    const langPrefix = langOrg.split(/[-_]/)[0].toLowerCase();

    // Filter voices for this language
    let langVoices = voices.filter(v => v.lang.toLowerCase() === langOrg.toLowerCase());
    if (langVoices.length === 0) {
      langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
    }

    if (langVoices.length === 0 || this._isMobile()) {
      voiceSelect.style.display = 'none';
      return;
    }

    voiceSelect.style.display = 'block';

    // Save current selection if any
    const currentVal = voiceSelect.value || this.selectedVoiceName;

    voiceSelect.innerHTML = '';

    // Always add "Best Voice" as first option (it's the dynamic default)
    const bestVoice = this._getBestVoice(langOrg);

    langVoices.sort((a, b) => a.name.localeCompare(b.name));

    langVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = voice.name;
      if (bestVoice && voice.name === bestVoice.name) {
        option.textContent += ' (Best)';
      }
      voiceSelect.appendChild(option);
    });

    // Restore selection or default to best voice
    if (currentVal && langVoices.some(v => v.name === currentVal)) {
      voiceSelect.value = currentVal;
      this.selectedVoiceName = currentVal;
    } else if (bestVoice) {
      voiceSelect.value = bestVoice.name;
      this.selectedVoiceName = bestVoice.name;
    }
  }

  _speak(text, lang, onEnd = null) {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser. Please try Chrome or Safari.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    let voiceToUse = null;
    if (this.selectedVoiceName) {
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

    if (selectedIndex === correctIndex) {
      card.classList.add('answered');
      this.answeredCount++;

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
      if (this.unscrambleData && this.unscrambleData.length > 0 && this.currentUnscrambleIndex < this.unscrambleData.length) {
        // Just show numbers as requested: 1 / 5
        progressText.textContent = `${this.currentUnscrambleIndex + 1} / ${this.unscrambleData.length}`;
      } else if (this.memoryGameData && this.memoryGameData.length > 0 && this.matchedPairsCount < (this.memoryGameData.length / 2)) {
        // Just show numbers as requested: 0 / 6
        progressText.textContent = `${this.matchedPairsCount} / ${this.memoryGameData.length / 2}`;
      } else {
        progressText.textContent = `${this.score} / ${this.data.length}`;
      }
    }
  }

  startUnscrambleActivity() {
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

    this.currentUnscrambleIndex = 0;
    this.unscrambleScore = 0;
    this.userUnscrambledWords = [];

    const langOrg = this.getAttribute('lang-original') || 'en';
    if (langOrg === 'th') {
      this.startMemoryGame();
      return;
    }

    this.renderUnscrambleChallenge();
    this.updateProgress();
  }

  renderUnscrambleCompletion() {
    const container = this.shadowRoot.querySelector('.story-container');
    container.innerHTML = '';

    const completionCard = document.createElement('div');
    completionCard.classList.add('card', 'unscramble-card', 'playing');

    const title = document.createElement('h3');
    title.textContent = "Unscramble Activity Completed!";
    completionCard.appendChild(title);

    const message = document.createElement('p');
    message.textContent = `You've completed this round. Do you want to play again with new sentences or continue to the next game?`;
    completionCard.appendChild(message);

    const actions = document.createElement('div');
    actions.classList.add('unscramble-actions');
    actions.style.marginTop = "2em";
    actions.style.flexDirection = "column";
    actions.style.alignItems = "center";

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again (New Sentences)';
    playAgainBtn.onclick = () => this.startUnscrambleActivity();
    actions.appendChild(playAgainBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Continue to Memory Game';
    nextBtn.classList.add('finish-btn');
    nextBtn.style.marginTop = "0.5em";
    nextBtn.onclick = () => this.startMemoryGame();
    actions.appendChild(nextBtn);

    completionCard.appendChild(actions);
    container.appendChild(completionCard);
    completionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  renderUnscrambleChallenge() {
    const container = this.shadowRoot.querySelector('.story-container');
    container.innerHTML = '';

    const challenge = this.unscrambleData[this.currentUnscrambleIndex];

    const unscrambleCard = document.createElement('div');
    unscrambleCard.classList.add('card', 'unscramble-card', 'playing');

    const title = document.createElement('h3');
    title.textContent = "Unscramble the Sentence";
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
    unscrambleCard.appendChild(translation);

    const resultArea = document.createElement('div');
    resultArea.classList.add('unscramble-result');
    unscrambleCard.appendChild(resultArea);

    const poolArea = document.createElement('div');
    poolArea.classList.add('unscramble-pool');
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
    unscrambleCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  startMemoryGame() {
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

    this.renderMemoryGameUI();
    this.updateProgress();
  }

  renderMemoryGameUI() {
    const container = this.shadowRoot.querySelector('.story-container');
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
          <div class="memory-card-back">${cardData.text}</div>
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

    const finishBtn = document.createElement('button');
    finishBtn.textContent = 'Finish & See Report';
    finishBtn.classList.add('finish-btn');
    finishBtn.onclick = () => this.showFinalForm();
    gameActions.appendChild(finishBtn);

    container.appendChild(gameActions);
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
    const formOverlay = this.shadowRoot.querySelector('.form-overlay');
    formOverlay.style.display = 'flex';

    const nicknameInput = this.shadowRoot.querySelector('#nickname');
    const numberInput = this.shadowRoot.querySelector('#student-number');

    if (this.studentInfo.nickname) {
      nicknameInput.value = this.studentInfo.nickname;
      nicknameInput.disabled = true;
      numberInput.value = this.studentInfo.number;
      numberInput.disabled = true;
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

    const reportArea = this.shadowRoot.querySelector('.report-area');
    reportArea.innerHTML = `
      <div class="report-card">
        <div class="report-icon">📄</div>
        <h3>Report Card: ${storyTitle}</h3>
        <p><strong>Student:</strong> ${nickname} (${number})</p>
        <p><strong>Translation Score:</strong> ${this.score} / ${this.data.length}</p>
        <p><strong>Unscramble Score:</strong> ${this.unscrambleScore} / ${this.unscrambleData.length}</p>
        <p><strong>Matching Games:</strong> ${this.matchingGamesCompleted}</p>
        <p><strong>Completed On:</strong> ${timestamp}</p>
        <button class="try-again-btn">Try Again</button>
      </div>
    `;
    this.shadowRoot.querySelector('.form-container').style.display = 'none';

    reportArea.querySelector('.try-again-btn').onclick = () => {
      this.shadowRoot.querySelector('.form-overlay').style.display = 'none';
      this.shadowRoot.querySelector('.report-area').innerHTML = '';
      this.shadowRoot.querySelector('.form-container').style.display = 'block';
      this.loadData(); // Re-shuffles and resets cards
    };
  }

  swapLanguages() {
    const oldOrg = this.getAttribute('lang-original') || 'en';
    const oldTrans = this.getAttribute('lang-translation') || 'th';

    this.setAttribute('lang-original', oldTrans);
    this.setAttribute('lang-translation', oldOrg);
    this.isSwapped = !this.isSwapped;

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

        .voice-btn:hover {
          background: #4c80b4ff;
          color: #2563eb;
          transform: scale(1.02);
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

        #voice-select {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.85em;
          color: #1e293b;
          max-width: 150px;
          outline: none;
          cursor: pointer;
        }

        #voice-select:hover {
          border-color: #94a3b8;
        }

        @media (max-width: 600px) {
          #voice-select {
            max-width: 100px;
          }
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
          <select id="voice-select" title="Choose Voice" style="display: none;"></select>
        </div>
        <div class="progress-text">0 / 0</div>
      </div>
      <div class="story-container"></div>
      <div class="form-overlay">
        <div class="form-container">
          <h2>Great Job!</h2>
          <p>Please enter your details to generate your report card.</p>
          <input type="text" id="nickname" placeholder="Your Nickname">
          <input type="text" id="student-number" placeholder="Student Number">
          <button class="generate-btn">Generate Report Card</button>
        </div>
        <div class="report-area"></div>
      </div>

      <div class="browser-prompt-overlay">
        <div class="browser-prompt-card">
          <h2>Better in a Browser</h2>
          <p>It looks like you're using an in-app browser. For the best experience (including audio features), please open this page in <b>Chrome</b> or <b>Safari</b>.</p>
          <a class="browser-action-btn" href="javascript:void(0)">Open Browser</a>
          <button class="close-prompt" onclick="this.parentElement.parentElement.style.display='none'">Continue anyway</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.generate-btn').onclick = () => this.generateReport();
    this.shadowRoot.querySelector('#play-pause-btn').onclick = () => this.toggleFullPlayback();
    this.shadowRoot.querySelector('#stop-btn').onclick = () => this.stopFullPlayback();
    this.shadowRoot.querySelector('#swap-btn').onclick = () => this.swapLanguages();

    const voiceSelect = this.shadowRoot.querySelector('#voice-select');
    voiceSelect.onchange = (e) => {
      this.selectedVoiceName = e.target.value;
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
