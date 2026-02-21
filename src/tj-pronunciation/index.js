import stylesText from "./styles.css?inline";
import templateHtml from "./template.html?raw";
const icons = {
  play: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  stop: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg>`,
  mic: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`,
  headphones: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`,
};

class TjPronunciation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.synth = window.speechSynthesis;
    this.language = "en-US";
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordings = new Map(); // Store blob URLs by activity index
  }

  connectedCallback() {
    const src = this.getAttribute("src");
    if (src) {
      this.loadData(src);
    } else {
      setTimeout(() => {
        try {
          const data = JSON.parse(this.textContent.trim());
          this.render(data);
        } catch (e) {
          console.error("Error parsing inline JSON data", e);
          this.shadowRoot.innerHTML = `<p style="color: red;">Error loading pronunciation data: Invalid JSON.</p>`;
        }
      }, 0);
    }
  }

  async loadData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.render(data);
    } catch (error) {
      console.error("Error loading pronunciation data:", error);
      this.shadowRoot.innerHTML = `<p style="color: red;">Error loading pronunciation data.</p>`;
    }
  }

  render(data) {
    if (data.language) {
      this.language = data.language;
    }

    const template = document.createElement("template");
    template.innerHTML = `<style>${stylesText}</style>${templateHtml}`;

    if (this.shadowRoot.firstChild) {
      this.shadowRoot.innerHTML = "";
    }

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if (data.title) {
      this.shadowRoot.getElementById("pronunciationTitle").textContent =
        data.title;
    }

    if (data.instructions) {
      const instrEl = this.shadowRoot.getElementById(
        "pronunciationInstructions",
      );
      instrEl.textContent = data.instructions;
      instrEl.style.display = "block";
    }

    let activitiesHtml = "";
    if (data.activities && Array.isArray(data.activities)) {
      activitiesHtml = data.activities
        .map((act, index) => this.renderActivity(act, index))
        .join("");
    }

    this.shadowRoot.getElementById("activitiesContainer").innerHTML =
      activitiesHtml;

    this.attachEventListeners();
  }

  renderActivity(activity, index) {
    switch (activity.type) {
      case "listen_record":
        return this.renderListenRecord(activity, index);
      case "minimal_pair":
        return this.renderMinimalPair(activity, index);
      case "stress_match":
        return `<div class="activity-card"><h2 class="activity-title">Stress Match Activity (Coming Soon)</h2></div>`;
      case "scramble":
        return this.renderScramble(activity, index);
      case "odd_one_out":
        return `<div class="activity-card"><h2 class="activity-title">Odd One Out Activity (Coming Soon)</h2></div>`;
      default:
        return `<div class="activity-card"><p>Unknown activity type: ${activity.type}</p></div>`;
    }
  }

  renderListenRecord(activity, index) {
    return `
            <div class="activity-card" id="act-${index}">
                <div class="activity-title">${icons.headphones} Listen & Record</div>
                <div class="lr-container">
                    <div style="text-align: center;">
                        <div class="lr-target-word">${activity.targetText}</div>
                        ${activity.phoneticHint ? `<div class="lr-phonetic">/[${activity.phoneticHint}]/</div>` : ""}
                        
                        ${
                          activity.translation
                            ? `
                            <button class="translation-toggle" data-index="${index}">Show Translation</button>
                            <div class="lr-translation hidden" id="trans-${index}" style="display: none;">${activity.translation}</div>
                        `
                            : ""
                        }
                    </div>

                    <div class="lr-controls">
                        <div class="lr-control-group">
                            <span class="lr-label">Listen</span>
                            <button class="play-audio-btn" data-action="play" data-text="${activity.targetText.replace(/"/g, "&quot;")}">
                                ${icons.play}
                            </button>
                        </div>

                        <div class="lr-control-group">
                            <span class="lr-label">Record</span>
                            <button class="record-btn" data-action="record" data-index="${index}">
                                ${icons.mic}
                            </button>
                        </div>

                        <div class="lr-control-group">
                            <span class="lr-label">Playback</span>
                            <button class="playback-btn" id="playback-${index}" data-action="playback" data-index="${index}">
                                ${icons.play}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  renderMinimalPair(activity, index) {
    const hasOptions = activity.options && Array.isArray(activity.options);
    if (!hasOptions)
      return `<div class="activity-card"><p>Error: Minimal Pair requires 'options' array.</p></div>`;

    return `
            <div class="activity-card" id="act-${index}">
                <div class="activity-title">
                    <span style="display:inline-block; margin-right: 0.5rem;">⚖️</span> Minimal Pair
                </div>
                <div class="mp-container">
                    ${activity.focus ? `<div class="mp-focus">Focus: ${activity.focus}</div>` : ""}
                    <div class="mp-instr">Click on the last word that you hear.</div>
                    
                    <button class="play-audio-btn" data-action="play-mp" data-index="${index}" 
                            data-options="${activity.options.join(",").replace(/"/g, "&quot;")}" 
                            data-answer="${activity.correctAnswer.replace(/"/g, "&quot;")}">
                        ${icons.play}
                    </button>

                    <div class="mp-options">
                        ${activity.options
                          .map(
                            (opt) => `
                            <button class="mp-option-btn" data-action="mp-guess" data-index="${index}" data-correct="${activity.correctAnswer === opt}">${opt}</button>
                        `,
                          )
                          .join("")}
                    </div>
                    <div class="feedback-msg" id="feedback-${index}"></div>
                </div>
            </div>
        `;
  }

  renderScramble(activity, index) {
    if (!activity.words || !Array.isArray(activity.words))
      return `<div class="activity-card"><p>Error: Scramble requires 'words' array.</p></div>`;

    let allWords = [...activity.words];
    if (activity.distractors && Array.isArray(activity.distractors)) {
      allWords = allWords.concat(activity.distractors);
    }

    // Shuffle the words
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }

    return `
            <div class="activity-card" id="act-${index}">
                <div class="activity-title">
                    <span style="display:inline-block; margin-right: 0.5rem;">🧩</span> Dictation Scramble
                </div>
                <div class="scramble-container">
                    <button class="play-audio-btn" data-action="play" data-text="${activity.audioText.replace(/"/g, "&quot;")}">
                        ${icons.play}
                    </button>

                    <!-- Hidden data store for correct answer -->
                    <div id="scramble-ans-${index}" style="display:none;" data-answer="${activity.words.join(" ").replace(/"/g, "&quot;")}"></div>

                    <div class="scramble-dropzone" id="dropzone-${index}">
                        <!-- Words dropped here -->
                    </div>

                    <div class="scramble-bank" id="bank-${index}">
                        ${allWords
                          .map(
                            (word, wIdx) => `
                            <div class="scramble-word" data-action="scramble-move" data-index="${index}" data-word-id="${wIdx}">${word}</div>
                        `,
                          )
                          .join("")}
                    </div>

                    <div class="scramble-controls">
                        <button class="scramble-btn" data-action="scramble-reset" data-index="${index}">Reset</button>
                        <button class="scramble-btn primary" data-action="scramble-check" data-index="${index}">Check</button>
                    </div>
                    
                    <div class="feedback-msg" id="feedback-${index}"></div>
                </div>
            </div>
        `;
  }

  attachEventListeners() {
    // Translation toggles
    this.shadowRoot.querySelectorAll(".translation-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const transDiv = this.shadowRoot.querySelector("#trans-" + index);
        if (transDiv.style.display === "none") {
          transDiv.style.display = "block";
          e.target.textContent = "Hide Translation";
        } else {
          transDiv.style.display = "none";
          e.target.textContent = "Show Translation";
        }
      });
    });

    // Play native audio (TTS for now, could be extended to real audio files later if needed)
    this.shadowRoot
      .querySelectorAll('button[data-action="play"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const button = e.target.closest("button");
          const text = button.dataset.text;
          this.playTTS(text, button);
        });
      });

    // Minimal Pair sequence play
    this.shadowRoot
      .querySelectorAll('button[data-action="play-mp"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const button = e.target.closest("button");
          const options = button.dataset.options.split(",");
          const answer = button.dataset.answer;
          this.playMinimalPairSequence(options, answer, button);
        });
      });

    // Record buttons
    this.shadowRoot
      .querySelectorAll('button[data-action="record"]')
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const button = e.target.closest("button");
          const index = button.dataset.index;
          await this.toggleRecording(button, index);
        });
      });

    // Playback buttons
    this.shadowRoot
      .querySelectorAll('button[data-action="playback"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const button = e.target.closest("button");
          if (button.classList.contains("ready")) {
            const index = button.dataset.index;
            this.playRecording(index, button);
          }
        });
      });

    // Minimal Pair guesses
    this.shadowRoot
      .querySelectorAll('button[data-action="mp-guess"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const button = e.target.closest("button");
          const isCorrect = button.dataset.correct === "true";
          const index = button.dataset.index;
          const feedbackDiv = this.shadowRoot.querySelector(
            "#feedback-" + index,
          );
          const container = button.closest(".mp-options");

          // Disable all buttons in this container
          container
            .querySelectorAll("button")
            .forEach((b) => (b.disabled = true));

          if (isCorrect) {
            button.classList.add("correct");
            feedbackDiv.textContent = "Correct! 🎉";
            feedbackDiv.className = "feedback-msg correct";
          } else {
            button.classList.add("wrong");
            feedbackDiv.textContent = "Incorrect.";
            feedbackDiv.className = "feedback-msg wrong";

            // Highlight the correct one
            container.querySelectorAll("button").forEach((b) => {
              if (b.dataset.correct === "true") {
                b.classList.add("correct");
              }
            });
          }
        });
      });

    // Scramble logic
    this.shadowRoot
      .querySelectorAll('.scramble-word[data-action="scramble-move"]')
      .forEach((wordBtn) => {
        wordBtn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          const dropzone = this.shadowRoot.querySelector("#dropzone-" + index);
          const bank = this.shadowRoot.querySelector("#bank-" + index);
          const feedbackDiv = this.shadowRoot.querySelector(
            "#feedback-" + index,
          );
          if (feedbackDiv) {
            feedbackDiv.textContent = "";
            feedbackDiv.className = "feedback-msg";
          }

          // Reset dropzone styling if it was correct
          dropzone.classList.remove("success");

          if (e.target.parentElement === bank) {
            // Move to dropzone
            dropzone.appendChild(e.target);
            e.target.classList.add("in-dropzone");
          } else {
            // Move back to bank
            bank.appendChild(e.target);
            e.target.classList.remove("in-dropzone");
          }
        });
      });

    this.shadowRoot
      .querySelectorAll('button[data-action="scramble-reset"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          const dropzone = this.shadowRoot.querySelector("#dropzone-" + index);
          const bank = this.shadowRoot.querySelector("#bank-" + index);
          const feedbackDiv = this.shadowRoot.querySelector(
            "#feedback-" + index,
          );
          if (feedbackDiv) {
            feedbackDiv.textContent = "";
            feedbackDiv.className = "feedback-msg";
          }

          dropzone.classList.remove("success");

          // Move all words back to bank
          const words = dropzone.querySelectorAll(".scramble-word");
          words.forEach((word) => {
            bank.appendChild(word);
            word.classList.remove("in-dropzone");
          });
        });
      });

    this.shadowRoot
      .querySelectorAll('button[data-action="scramble-check"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          const dropzone = this.shadowRoot.querySelector("#dropzone-" + index);
          const feedbackDiv = this.shadowRoot.querySelector(
            "#feedback-" + index,
          );
          const answerNode = this.shadowRoot.querySelector(
            "#scramble-ans-" + index,
          );

          const correctAnswer = answerNode.dataset.answer;

          // Get words currently in dropzone in order
          const currentWords = Array.from(
            dropzone.querySelectorAll(".scramble-word"),
          ).map((w) => w.textContent);
          const currentSentence = currentWords.join(" ");

          if (currentWords.length === 0) {
            feedbackDiv.textContent = "Please construct a sentence first.";
            feedbackDiv.className = "feedback-msg";
            return;
          }

          if (currentSentence === correctAnswer) {
            feedbackDiv.textContent = "Correct! 🎉";
            feedbackDiv.className = "feedback-msg correct";
            dropzone.classList.add("success");
          } else {
            feedbackDiv.textContent = "Incorrect. Try again!";
            feedbackDiv.className = "feedback-msg wrong";
          }
        });
      });
  }

  playTTS(text, button) {
    if (!this.synth) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.language;

      // Try to find a good native voice
      const voices = this.synth.getVoices();
      const langPrefix = this.language.split(/[-_]/)[0].toLowerCase();
      const langVoices = voices.filter(
        (v) => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix,
      );

      if (langVoices.length > 0) {
        const bestVoice =
          langVoices.find(
            (v) =>
              v.name.toLowerCase().includes("google") ||
              v.name.toLowerCase().includes("natural") ||
              v.name.toLowerCase().includes("siri"),
          ) || langVoices[0];
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        button.classList.add("playing");
      };

      utterance.onend = () => {
        button.classList.remove("playing");
        resolve();
      };

      utterance.onerror = (e) => {
        button.classList.remove("playing");
        reject(e);
      };

      this.synth.speak(utterance);
    });
  }

  async playMinimalPairSequence(options, answer, button) {
    if (button.classList.contains("playing")) return;

    const mpContainer = button.closest(".mp-container");
    const optionBtns = mpContainer.querySelectorAll(".mp-option-btn");

    try {
      // Step 1: Read words 2 times with short pauses and highlighting
      for (let i = 0; i < 2; i++) {
        for (const opt of options) {
          // Highlight the button for the current option
          const targetBtn = Array.from(optionBtns).find(
            (b) => b.textContent.trim() === opt.trim(),
          );
          if (targetBtn) targetBtn.classList.add("highlight");

          await this.playTTS(opt, button);

          if (targetBtn) targetBtn.classList.remove("highlight");
          await new Promise((r) => setTimeout(r, 600)); // Pause between words
        }
        await new Promise((r) => setTimeout(r, 400)); // Extra pause between cycles
      }

      // Step 2: Read one of the words (the answer) - NO highlighting
      await new Promise((r) => setTimeout(r, 500)); // Pause before final word
      await this.playTTS(answer, button);
    } catch (err) {
      console.error("Audio sequence error:", err);
      button.classList.remove("playing");
      // Cleanup highlights on error
      optionBtns.forEach((b) => b.classList.remove("highlight"));
    }
  }

  async toggleRecording(btn, index) {
    if (btn.classList.contains("recording")) {
      // Stop recording
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop();
      }
      btn.classList.remove("recording");
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Revoke old URL if it exists
          if (this.recordings.has(index)) {
            URL.revokeObjectURL(this.recordings.get(index));
          }

          this.recordings.set(index, audioUrl);

          // Enable playback button
          const playbackBtn = this.shadowRoot.querySelector(
            `#playback-${index}`,
          );
          if (playbackBtn) {
            playbackBtn.classList.add("ready");
          }

          // Stop tracks to release microphone
          stream.getTracks().forEach((track) => track.stop());
        };

        this.mediaRecorder.start();
        btn.classList.add("recording");
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert(
          "Could not access microphone. Please ensure you have granted permission.",
        );
      }
    }
  }

  playRecording(index, btn) {
    const audioUrl = this.recordings.get(index);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    audio.onplay = () => {
      btn.classList.add("playing");
    };

    audio.onended = () => {
      btn.classList.remove("playing");
    };

    audio.play().catch((e) => {
      console.error("Error playing recording:", e);
      btn.classList.remove("playing");
    });
  }
}

customElements.define("tj-pronunciation", TjPronunciation);
