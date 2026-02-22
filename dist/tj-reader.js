const R = ':host{display:block;font-family:inherit;max-width:80em;margin:1em auto;color:#333;background-color:#f8f8ff;position:relative}.sticky-bar{position:sticky;top:0;background:#ffffffe6;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding:.8em 1.2em;border-radius:1em;box-shadow:0 4px 20px #0000000d;z-index:100;margin-bottom:1.5em;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(226,232,240,.8)}.playback-controls{display:flex;gap:1em;align-items:center}.autoplay-toggle-container{display:flex;align-items:center;gap:.8em;padding:.4em .8em;background:#f8fafc80;border-radius:2em;border:1px solid #e2e8f0;font-size:.85em;font-weight:600;color:#475569;-webkit-user-select:none;user-select:none}.switch{position:relative;display:inline-block;width:32px;height:18px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#cbd5e1;transition:.4s;border-radius:18px}.slider:before{position:absolute;content:"";height:14px;width:14px;left:2px;bottom:2px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#2563eb}input:checked+.slider:before{transform:translate(14px)}.control-btn{display:flex;align-items:center;gap:.5em;padding:.5em 1em;font-size:.9em;font-weight:600;border-radius:.6em;background:#f8fafc;border:1px solid #e2e8f0;color:#475569;cursor:pointer;transition:all .2s}.control-btn:hover{background:#f1f5f9;border-color:#cbd5e1;color:#2563eb}#play-pause-btn{background:#2563eb;color:#fff;border-color:#1d4ed8}#play-pause-btn:hover{background:#1d4ed8}#stop-btn{display:none}.progress-text{font-weight:700;color:#2563eb;font-size:1.1em;white-space:nowrap}.story-container{display:flex;flex-direction:column;gap:1em;padding:1em;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#cbd5e1 transparent}.story-container::-webkit-scrollbar{width:6px}.story-container::-webkit-scrollbar-thumb{background-color:#cbd5e1;border-radius:3px}.card{background:#fffffff2;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:1.2em;padding:1em;box-shadow:0 .5em 2em #0000000d;text-align:center;transition:all .4s cubic-bezier(.4,0,.2,1);border:1px solid #e2e8f0;opacity:.7;transform:scale(.98)}.card:hover,.card.completed{opacity:1;transform:scale(1);box-shadow:0 1em 3em #0000001a}.card.completed{border-color:#22c55e;background:#f0fdf4}.card.failed{border-color:#ef4444;background:#fef2f2}.card.playing{border-color:#2563eb;background:#eff6ff;opacity:1;transform:scale(1.02);box-shadow:0 10px 25px -5px #2563eb33}.card-header{display:flex;align-items:flex-start;justify-content:center;gap:1em;margin-bottom:.5em}.original-text{font-size:1.4em;line-height:1.6;font-weight:500;flex:1}.tts-word{cursor:pointer;transition:background .2s;border-radius:.2em;padding:0 .1em}.tts-word:hover{background:#f1f5f9}.voice-btn{background:#f8fafc;border:1px solid #f1f5f9;padding:.5em;font-size:1.1em;border-radius:50%;width:2.2em;height:2.2em;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0;color:#64748b}.voice-btn{background:#eef2ff;border:1px solid #c7d2fe;padding:0;font-size:1.1em;border-radius:50%;width:2.2em;height:2.2em;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s cubic-bezier(.4,0,.2,1);flex-shrink:0;color:#003;box-shadow:0 1px 3px #0000001a}.voice-btn:hover{background:#c7d2fe;color:#000;transform:scale(1.1);box-shadow:0 2px 6px #00000026}.card-btn-group{display:flex;gap:.6em;align-items:center;padding:.4em;background:#fdfdfd;border-radius:2em;border:1px solid #f1f5f9}.record-btn,.play-recorded-btn{background:#f8fafc;border:1px solid #e2e8f0;padding:0;border-radius:50%;width:2.2em;height:2.2em;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#1a202c;transition:all .2s cubic-bezier(.4,0,.2,1);flex-shrink:0}.record-btn:hover{background:#fee2e2;color:#b91c1c;border-color:#fecaca;transform:scale(1.1)}.record-btn.recording{background:#ef4444;color:#fff;border-color:#dc2626;animation:pulse 1.5s infinite}.play-recorded-btn{background:#f0fdf4;color:#15803d;border-color:#bbf7d0}.play-recorded-btn.playing{background:#15803d;color:#fff;border-color:#14532d;animation:pulse-green 1.5s infinite}.play-recorded-btn:hover{background:#bbf7d0;color:#14532d;transform:scale(1.1)}@keyframes pulse-green{0%{transform:scale(1);box-shadow:0 0 #15803db3}70%{transform:scale(1.05);box-shadow:0 0 0 10px #15803d00}to{transform:scale(1);box-shadow:0 0 #15803d00}}@keyframes pulse{0%{transform:scale(1);box-shadow:0 0 #ef4444b3}70%{transform:scale(1.05);box-shadow:0 0 0 10px #ef444400}to{transform:scale(1);box-shadow:0 0 #ef444400}}.full-translation{font-size:1.5em;color:#64748b;margin-bottom:1em;font-style:italic}.highlight{color:#2563eb;font-weight:700;border-bottom:3px solid #bfdbfe;padding:0 .1em;transition:all .3s ease}.card.completed .highlight{color:#16a34a;border-bottom-color:#bbf7d0}.card.failed .highlight{color:#dc2626;border-bottom-color:#fecaca}.translation-options{display:flex;flex-wrap:wrap;gap:.8em;justify-content:center}button{font-family:inherit;font-size:1em;padding:.6em 1.2em;cursor:pointer;background:#fff;border:1px solid #e2e8f0;border-radius:.7em;transition:all .2s cubic-bezier(.4,0,.2,1);outline:none;color:#475569}button:hover:not(:disabled){background:#00f;border-color:#cbd5e1;transform:translateY(-1px)}button.success{background:#22c55e!important;color:#fff;border-color:#16a34a;animation:bounce .4s ease}button.error{background:#ef4444!important;color:#fff;border-color:#dc2626;animation:shake .4s ease}.finish-container{padding:2em 0 5em;text-align:center}.finish-btn{background:#2563eb;color:#fff;border:none;padding:1.2em 2.5em;font-size:1.1em;font-weight:700;border-radius:.8em;cursor:pointer;box-shadow:0 4px 12px #2563eb26;transition:all .3s ease}.finish-btn:hover{background:#1d4ed8;transform:translateY(-1px);box-shadow:0 6px 15px #2563eb33}.form-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:#fffffff2;display:none;flex-direction:column;align-items:center;justify-content:center;border-radius:1.2em;z-index:20;animation:fadeIn .3s ease}.form-container{width:80%;max-width:300px;text-align:center}input{width:100%;padding:1em;margin-bottom:1em;border:1px solid #e2e8f0;border-radius:.5em;font-size:1em;box-sizing:border-box}.generate-btn,.try-again-btn{background:#2563eb;color:#fff;border:none;width:100%;padding:1em;font-weight:600;border-radius:.5em}.report-card{background:#fff;padding:2em;border-radius:1em;box-shadow:0 4px 20px #0000001a;text-align:left}@keyframes shake{0%,to{transform:translate(0)}25%{transform:translate(-5px)}75%{transform:translate(5px)}}@keyframes bounce{0%,to{transform:scale(1)}50%{transform:scale(1.1)}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.browser-prompt-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#0f172ae6;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:1000;color:#fff;padding:2em;text-align:center}.browser-prompt-card{background:#fff;color:#1e293b;padding:2.5em;border-radius:1.5em;max-width:400px;box-shadow:0 20px 25px -5px #0000001a,0 10px 10px -5px #0000000a}.browser-prompt-card h2{margin-top:0;color:#1e293b;font-size:1.5em}.browser-prompt-card p{color:#64748b;line-height:1.6;margin-bottom:2em}.browser-action-btn{display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:1em 2em;border-radius:.75em;font-weight:600;transition:background .2s;cursor:pointer;border:none;width:100%;box-sizing:border-box}.browser-action-btn:hover{background:#1d4ed8}.close-prompt{margin-top:1.5em;background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:.9em;text-decoration:underline}.activities-wrapper{display:flex;flex-direction:column;gap:3em;padding:1em 1em 10em}.section-divider{border:none;border-top:2px dashed #e2e8f0;margin:2em 0;position:relative}.section-divider:after{content:attr(data-label);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:0 1em;color:#94a3b8;font-weight:600;font-size:.9em;text-transform:uppercase;letter-spacing:.1em}.form-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#0f172acc;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:1000;animation:fadeIn .3s ease}.form-container{background:#fff;width:90%;max-width:450px;padding:2.5em;border-radius:1.5em;box-shadow:0 25px 50px -12px #00000040;text-align:center;max-height:90vh;overflow-y:auto}.report-area{width:100%}.report-card{text-align:left}.report-actions{display:flex;flex-direction:column;gap:.8em;margin-top:2em}.return-btn{background:#22c55e;color:#fff;border:none;width:100%;padding:1em;font-weight:600;border-radius:.5em;cursor:pointer;transition:background .2s}.return-btn:hover{background:#16a34a}.reset-all-btn{background:#ef4444;color:#fff;border:none;width:100%;padding:1em;font-weight:600;border-radius:.5em;cursor:pointer;transition:background .2s;margin-top:1em;font-size:.85em;opacity:.9}.reset-all-btn:hover{background:#dc2626;opacity:1}.unscramble-card{max-width:600px;margin-left:auto;margin-right:auto;width:100%;box-sizing:border-box}.unscramble-card h3{margin-top:0;color:#2563eb}.unscramble-result{min-height:3em;border-bottom:2px dashed #e2e8f0;margin-bottom:1em;padding:.5em;display:flex;flex-wrap:wrap;gap:.5em;justify-content:center}.unscramble-pool{display:flex;flex-wrap:wrap;gap:.5em;justify-content:center;margin-bottom:2em}.unscramble-actions{display:flex;gap:1em;font-size:.9em;padding:.5em;justify-content:center;flex-wrap:wrap}.unscramble-result button{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}.unscramble-pool button{background:#f8fafc}.memory-game-header{text-align:center;margin-bottom:2em}.memory-game-header h3{color:#2563eb;margin:0}.memory-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1em;width:100%;max-width:500px;margin:0 auto 2em;padding:1em;box-sizing:border-box}.memory-card{aspect-ratio:4/5;perspective:1000px;cursor:pointer;min-height:100px}.memory-card-inner{position:relative;width:100%;height:100%;text-align:center;transition:transform .6s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d;border-radius:.8em;box-shadow:0 4px 8px #0000001a}.memory-card.flipped .memory-card-inner{transform:rotateY(180deg)}.memory-card-front,.memory-card-back{position:absolute;width:100%;height:100%;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;border-radius:.8em;padding:.5em;font-weight:600;font-size:.9em;box-sizing:border-box;border:1px solid #e2e8f0}.memory-card-front{background-color:#2563eb;color:#fff;font-size:2em;box-shadow:inset 0 0 20px #fff3}.memory-card-back{background-color:#fff;color:#1e293b;transform:rotateY(180deg);word-break:break-word;font-size:1.1em;padding:.8em;line-height:1.2}.memory-card.matched .memory-card-inner{box-shadow:0 0 15px #22c55e66;border:2px solid #22c55e}.memory-game-actions{display:flex;gap:1em;justify-content:center;margin-top:2em}.report-icon{font-size:3em;margin-bottom:.5em;text-align:center}.recordings-section{margin-top:1.5em;background:#fff;padding:1.5em;border-radius:1em;box-shadow:0 4px 15px #00000014;max-width:500px;width:100%;box-sizing:border-box;animation:fadeIn .5s ease}.recordings-section h4{margin-top:0;margin-bottom:1em;color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:.5em;display:flex;align-items:center;gap:.5em}.recordings-list{display:flex;flex-direction:column;gap:.8em}.recording-item{display:flex;align-items:center;gap:1em;padding:.6em;border-radius:.5em;background:#f8fafc;transition:background .2s}.recording-item:hover{background:#f1f5f9}.recording-play-btn{background:#eef2ff;color:#2563eb;border:1px solid #c7d2fe;border-radius:50%;width:34px;height:34px;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .2s cubic-bezier(.4,0,.2,1);box-sizing:border-box;box-shadow:0 1px 3px #0000001a}.recording-play-btn:hover{background:#c7d2fe;color:#1a202c;transform:scale(1.1);box-shadow:0 2px 6px #00000026}.recording-play-btn:active{transform:scale(.95)}.recording-text{font-size:.9em;color:#475569;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}@media (max-width: 600px){.sticky-bar{padding:.5em .8em;gap:.5em}.playback-controls{gap:.5em}.control-btn span{display:none}.autoplay-toggle-container{padding:.4em .5em}.progress-text{font-size:.9em;white-space:nowrap}}@media (min-width: 601px){.memory-grid{grid-template-columns:repeat(4,1fr)}}.voice-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#0f172ab3;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;z-index:1000;animation:fadeIn .2s ease}.voice-card{background:#fff;width:90%;max-width:400px;max-height:80vh;border-radius:1.2em;display:flex;flex-direction:column;box-shadow:0 20px 25px -5px #0003}.voice-card-header{padding:1.25em;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center}.voice-card-header h3{margin:0;font-size:1.1em;color:#1e293b}.close-voice-btn{background:none;border:none;padding:.5em;color:#94a3b8;cursor:pointer}.voice-list{padding:1em;overflow-y:auto;display:flex;flex-direction:column;gap:.5em}.voice-option-btn{width:100%;text-align:left!important;padding:.8em 1em!important;border:1px solid #f1f5f9!important;background:#f8fafc!important;border-radius:.6em!important;font-size:.9em!important;display:flex;justify-content:space-between;align-items:center;transition:all .2s;color:#475569!important}.voice-option-btn:hover{background:#f1f5f9!important;border-color:#e2e8f0!important}.voice-option-btn.active{background:#eff6ff!important;border-color:#3b82f6!important;color:#2563eb!important;font-weight:600!important}.voice-option-btn .badge{font-size:.75em;background:#dcfce7;color:#166534;padding:.2em .5em;border-radius:1em}', M = `<div class="sticky-bar">
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
class L extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.shadowRoot.innerHTML = `
      <style>${R}</style>
      ${M}
    `, this.data = [], this.studentInfo = { nickname: "", number: "" }, this.score = 0, this.answeredCount = 0, this.isPlayingAll = !1, this.playbackIndex = 0, this.isPaused = !1, this.playbackUtterance = null, this.isAutoplay = !0, this.unscrambleData = [], this.currentUnscrambleIndex = 0, this.unscrambleScore = 0, this.userUnscrambledWords = [], this.memoryGameData = [], this.flippedCards = [], this.matchedPairsCount = 0, this.matchingGamesCompleted = 0, this.isCheckingMatch = !1, this.isSwapped = !1, this.selectedVoiceName = null, this.recordedBlobs = /* @__PURE__ */ new Map(), this.recordedSentences = /* @__PURE__ */ new Set(), this.completedIndices = /* @__PURE__ */ new Set(), this.unscrambleCompleted = !1, this.memoryCompleted = !1, this.unscrambleTotal = 0, this.memoryTotal = 0, this.isRecordingLine = null, this.mediaRecorder = null, this.recordingStartTime = 0, this.isPlayingRecording = null, this.shadowRoot.querySelector(".generate-btn").onclick = () => this.generateReport(), this.shadowRoot.querySelector("#play-pause-btn").onclick = () => this.toggleFullPlayback(), this.shadowRoot.querySelector("#stop-btn").onclick = () => this.stopFullPlayback(), this.shadowRoot.querySelector("#swap-btn").onclick = () => this.swapLanguages(), this.shadowRoot.querySelector("#voice-btn").onclick = () => this._showVoiceOverlay(), this.shadowRoot.querySelector(".close-voice-btn").onclick = () => this._hideVoiceOverlay(), this.shadowRoot.querySelector(".voice-overlay").onclick = (i) => {
      i.target.classList.contains("voice-overlay") && this._hideVoiceOverlay();
    };
    const e = this.shadowRoot.querySelector("#autoplay-checkbox");
    e.onchange = (i) => {
      this.isAutoplay = i.target.checked;
    };
  }
  connectedCallback() {
    requestAnimationFrame(() => {
      this.loadData(), this.checkBrowserSupport(), window.speechSynthesis.onvoiceschanged !== void 0 && (window.speechSynthesis.onvoiceschanged = () => {
        this._updateVoiceList();
      }), this._updateVoiceList(), setTimeout(() => this._updateVoiceList(), 500), setTimeout(() => this._updateVoiceList(), 1500);
    });
  }
  loadData() {
    try {
      this.rawJson || (this.rawJson = this.innerHTML.trim(), this.innerHTML = "");
      const e = this.rawJson;
      if (e) {
        const i = e.replace(/"((?:\\.|[^"\\])*)"/gs, (t, r) => '"' + r.replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"'), o = JSON.parse(i);
        this.data = (Array.isArray(o) ? o : [o]).map((t) => {
          const r = [...t.translationOptions], n = t.translationOptions[t.correctTranslationIndex];
          for (let d = r.length - 1; d > 0; d--) {
            const p = Math.floor(Math.random() * (d + 1));
            [r[d], r[p]] = [r[p], r[d]];
          }
          const s = t.original.split(/\s+/), a = t.highlightIndex, l = t.highlightIndexEnd !== void 0 ? t.highlightIndexEnd : a, h = s.slice(a, l + 1).join(" ").replace(/[.,!?;:]/g, "");
          return {
            ...t,
            highlightIndexEnd: l,
            shuffledOptions: r,
            newCorrectIndex: r.indexOf(n),
            originalWord: h,
            translationWord: n
          };
        }), this.matchingGamesCompleted = 0, this.render();
      }
    } catch (e) {
      console.error("Failed to parse JSON data for lbl-reader", e), this.shadowRoot.innerHTML = '<div class="error">Error loading data. Check console.</div>';
    }
  }
  displayAllLines() {
    const e = this.shadowRoot.querySelector(".story-container");
    e.innerHTML = "", this.score = this.completedIndices.size, this.answeredCount = this.completedIndices.size;
    const i = this.getAttribute("lang-original") || "en", o = this.getAttribute("lang-translation") || "th";
    this.data.forEach((t, r) => {
      const n = document.createElement("div");
      n.classList.add("card"), n.dataset.index = r;
      const s = document.createElement("div");
      s.classList.add("card-header");
      const a = document.createElement("div");
      a.classList.add("original-text"), t.original.split(" ").forEach((p, m) => {
        const c = document.createElement("span");
        c.textContent = p + " ", c.classList.add("tts-word"), !this.isSwapped && m >= t.highlightIndex && m <= t.highlightIndexEnd && c.classList.add("highlight"), c.onclick = (g) => {
          g.stopPropagation(), this.isPlayingAll && this.stopFullPlayback(), this._speak(p.replace(/[.,!?;:]/g, ""), i);
        }, a.appendChild(c);
      }), s.appendChild(a), n.appendChild(s), this.renderLineButtons(r, n);
      const l = document.createElement("div");
      l.classList.add("full-translation"), t.fullTranslation.split(" ").forEach((p, m) => {
        const c = document.createElement("span");
        c.textContent = p + " ", c.classList.add("tts-word"), this.isSwapped && m >= t.highlightIndex && m <= t.highlightIndexEnd && c.classList.add("highlight"), c.onclick = (g) => {
          g.stopPropagation(), this.isPlayingAll && this.stopFullPlayback(), this._speak(p.replace(/[.,!?;:]/g, ""), o);
        }, l.appendChild(c);
      });
      const h = document.createElement("div");
      h.classList.add("translation-options");
      const d = this.completedIndices.has(r);
      d && n.classList.add("completed", "answered"), t.shuffledOptions.forEach((p, m) => {
        const c = document.createElement("button");
        c.textContent = p, c.addEventListener("click", () => this.handleSelection(r, m, t.newCorrectIndex, c, n)), d && (c.disabled = !0, m !== t.newCorrectIndex ? c.style.opacity = "0.5" : c.classList.add("success")), h.appendChild(c);
      }), n.appendChild(l), n.appendChild(h), e.appendChild(n);
    }), this.updateProgress();
  }
  _getBestVoice(e) {
    if (!window.speechSynthesis) return null;
    const i = window.speechSynthesis.getVoices();
    if (i.length === 0) return null;
    const o = e.split(/[-_]/)[0].toLowerCase();
    let t = i.filter((s) => s.lang.toLowerCase() === e.toLowerCase());
    if (t.length === 0 && (t = i.filter((s) => s.lang.split(/[-_]/)[0].toLowerCase() === o)), t.length === 0) return null;
    const r = ["natural", "google", "premium", "siri"];
    for (const s of r) {
      const a = t.find((l) => l.name.toLowerCase().includes(s));
      if (a) return a;
    }
    return t.find((s) => !s.name.toLowerCase().includes("microsoft")) || t[0];
  }
  _isMobile() {
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }
  _updateVoiceList() {
    if (!window.speechSynthesis) return;
    const e = window.speechSynthesis.getVoices(), i = this.shadowRoot.querySelector(".voice-list"), o = this.shadowRoot.querySelector("#voice-btn");
    if (!i || !o) return;
    const t = this.getAttribute("lang-original") || "en", r = t.split(/[-_]/)[0].toLowerCase();
    let n = e.filter((a) => a.lang.toLowerCase() === t.toLowerCase());
    if (n.length === 0 && (n = e.filter((a) => a.lang.split(/[-_]/)[0].toLowerCase() === r)), n.length === 0) {
      o.style.display = "none";
      return;
    }
    o.style.display = "flex", i.innerHTML = "";
    const s = this._getBestVoice(t);
    !this.selectedVoiceName && s && (this.selectedVoiceName = s.name), n.sort((a, l) => a.name.localeCompare(l.name)), n.forEach((a) => {
      const l = document.createElement("button");
      l.classList.add("voice-option-btn"), this.selectedVoiceName === a.name && l.classList.add("active");
      const h = document.createElement("span");
      if (h.textContent = a.name, l.appendChild(h), s && a.name === s.name) {
        const d = document.createElement("span");
        d.classList.add("badge"), d.textContent = "Best", l.appendChild(d);
      }
      l.onclick = () => {
        this.selectedVoiceName = a.name, this._updateVoiceList(), this._hideVoiceOverlay();
      }, i.appendChild(l);
    });
  }
  _showVoiceOverlay() {
    const e = this.shadowRoot.querySelector(".voice-overlay");
    e && (e.style.display = "flex");
  }
  _hideVoiceOverlay() {
    const e = this.shadowRoot.querySelector(".voice-overlay");
    e && (e.style.display = "none");
  }
  _speak(e, i, o = null) {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser. Please try Chrome or Safari.");
      return;
    }
    window.speechSynthesis.cancel();
    const t = new SpeechSynthesisUtterance(e);
    let r = null;
    const n = this.getAttribute("lang-original") || "en", s = i.split(/[-_]/)[0].toLowerCase(), a = n.split(/[-_]/)[0].toLowerCase();
    return this.selectedVoiceName && s === a && (r = window.speechSynthesis.getVoices().find((h) => h.name === this.selectedVoiceName)), r || (r = this._getBestVoice(i)), r && (t.voice = r), t.lang = i, t.rate = 0.7, o && (t.onend = o), window.speechSynthesis.speak(t), t;
  }
  toggleFullPlayback() {
    this.isPlayingAll ? this.isPaused ? this.resumeFullPlayback() : this.pauseFullPlayback() : this.startFullPlayback();
  }
  startFullPlayback() {
    this.isPlayingAll = !0, this.isPaused = !1, this.updatePlaybackUI(), this.playLine(this.playbackIndex, !0);
  }
  pauseFullPlayback() {
    this.isPaused = !0, window.speechSynthesis.pause(), this.updatePlaybackUI();
  }
  resumeFullPlayback() {
    this.isPaused = !1, window.speechSynthesis.resume(), this.updatePlaybackUI();
  }
  stopFullPlayback() {
    window.speechSynthesis.cancel(), this.isPlayingAll = !1, this.isPaused = !1, this.playbackIndex = 0, this.clearPlaybackHighlights(), this.updatePlaybackUI();
  }
  async startRecording(e) {
    if (this.isRecordingLine === null)
      try {
        const i = await navigator.mediaDevices.getUserMedia({ audio: !0 });
        let o = "audio/webm";
        typeof MediaRecorder.isTypeSupported == "function" && (MediaRecorder.isTypeSupported(o) || (o = "audio/mp4", MediaRecorder.isTypeSupported(o) || (o = "")));
        const t = o ? { mimeType: o } : {};
        this.mediaRecorder = new MediaRecorder(i, t), this._recordingMimeType = this.mediaRecorder.mimeType || o || "audio/webm";
        let r = [];
        this.mediaRecorder.ondataavailable = (n) => {
          n.data.size > 0 && r.push(n.data);
        }, this.mediaRecorder.onstop = () => {
          const n = new Blob(r, { type: this._recordingMimeType });
          Date.now() - this.recordingStartTime > 600 ? (this.recordedBlobs.set(e, n), this.recordedSentences.add(e)) : console.warn("Recording too short to be counted."), i.getTracks().forEach((a) => a.stop()), this.isRecordingLine = null, this.renderLineButtons(e);
        }, this.recordingStartTime = Date.now(), this.isRecordingLine = e, this.mediaRecorder.start(1e3), this.renderLineButtons(e);
      } catch (i) {
        console.error("Error starting recording:", i), alert("Could not access microphone. Please check permissions.");
      }
  }
  stopRecording() {
    this.mediaRecorder && this.mediaRecorder.state === "recording" && this.mediaRecorder.stop();
  }
  playRecordedAudio(e) {
    const i = this.recordedBlobs.get(e);
    if (!i) return;
    this.isPlayingRecording;
    const o = URL.createObjectURL(i), t = new Audio(o);
    this.isPlayingRecording = e, this.renderLineButtons(e), t.play(), t.onended = () => {
      this.isPlayingRecording = null, this.renderLineButtons(e), URL.revokeObjectURL(o);
    };
  }
  renderLineButtons(e, i = null) {
    if (i || (i = this.shadowRoot.querySelector(`.card[data-index="${e}"]`)), !i) return;
    const o = i.querySelector(".card-header");
    let t = o.querySelector(".card-btn-group");
    t || (t = document.createElement("div"), t.classList.add("card-btn-group"), o.appendChild(t)), t.innerHTML = "";
    const r = document.createElement("button");
    r.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', r.classList.add("voice-btn"), r.title = "Play TTS", r.onclick = () => {
      this.isPlayingAll && this.stopFullPlayback(), this.playLine(e, !1);
    }, t.appendChild(r);
    const n = document.createElement("button");
    if (n.classList.add("record-btn"), this.isRecordingLine === e ? (n.classList.add("recording"), n.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>', n.onclick = () => this.stopRecording(), n.title = "Stop Recording") : (n.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>', n.onclick = () => this.startRecording(e), n.title = "Record Voice"), t.appendChild(n), this.recordedBlobs.has(e) && this.isRecordingLine !== e) {
      const s = document.createElement("button");
      this.isPlayingRecording === e ? (s.classList.add("play-recorded-btn", "playing"), s.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>') : (s.classList.add("play-recorded-btn"), s.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'), s.title = "Play Recording", s.onclick = () => this.playRecordedAudio(e), t.appendChild(s);
    }
  }
  playLine(e, i = !1) {
    if (e >= this.data.length) {
      i && this.stopFullPlayback();
      return;
    }
    this.playbackIndex = e;
    const o = this.data[e], t = this.getAttribute("lang-original") || "en";
    this.highlightCard(e), this.playbackUtterance = this._speak(o.original, t, () => {
      i && this.isPlayingAll && !this.isPaused && this.playLine(e + 1, !0);
    });
  }
  highlightCard(e) {
    this.clearPlaybackHighlights();
    const o = this.shadowRoot.querySelectorAll(".card")[e];
    o && (o.classList.add("playing"), o.scrollIntoView({ behavior: "smooth", block: "center" }));
  }
  clearPlaybackHighlights() {
    this.shadowRoot.querySelectorAll(".card").forEach((e) => e.classList.remove("playing"));
  }
  updatePlaybackUI() {
    const e = this.shadowRoot.querySelector("#play-pause-btn");
    if (!e) return;
    this.isPlayingAll ? this.isPaused ? e.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> <span>Resume</span>' : e.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> <span>Pause</span>' : e.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> <span>All</span>';
    const i = this.shadowRoot.querySelector("#stop-btn");
    i && (i.style.display = this.isPlayingAll ? "flex" : "none");
  }
  _shouldShowAudioControls() {
    const e = navigator.userAgent.toLowerCase();
    return !(e.includes("wv") || e.includes("webview") || e.includes("instagram") || e.includes("facebook") || e.includes("line") || !window.speechSynthesis);
  }
  _getAndroidIntentLink() {
    if (!/android/i.test(navigator.userAgent)) return "";
    const i = this.getAttribute("lesson-id"), o = new URL(window.location.href);
    i && o.searchParams.set("lesson", i);
    const r = o.toString().replace(/^https?:\/\//, ""), n = window.location.protocol.replace(":", "");
    return `intent://${r}#Intent;scheme=${n};package=com.android.chrome;end`;
  }
  checkBrowserSupport() {
    if (!this._shouldShowAudioControls()) {
      const e = this.shadowRoot.querySelector(".browser-prompt-overlay");
      if (e) {
        e.style.display = "flex";
        const i = this._getAndroidIntentLink(), o = this.shadowRoot.querySelector(".browser-action-btn");
        i ? (o.href = i, o.textContent = "Open in Chrome") : (o.onclick = (t) => {
          (!o.href || o.href === "javascript:void(0)") && (t.preventDefault(), alert("Please open this page in Safari or Chrome for the best experience with audio features."));
        }, o.textContent = "Use Safari / Chrome");
      }
    }
  }
  handleSelection(e, i, o, t, r) {
    if (r.classList.contains("answered")) return;
    if (i === o) {
      r.classList.add("answered"), this.answeredCount++, this.completedIndices.add(e), r.dataset.hadError || this.score++, t.classList.add("success"), r.classList.add("completed"), r.classList.remove("failed"), r.querySelectorAll(".translation-options button").forEach((l) => {
        l.disabled = !0, l !== t && (l.style.opacity = "0.5");
      }), this.updateProgress();
      const a = r.nextElementSibling;
      a && !a.classList.contains("finish-container") ? setTimeout(() => {
        a.scrollIntoView({ behavior: "smooth", block: "center" }), this.isAutoplay && this.playLine(e + 1, !1);
      }, 600) : setTimeout(() => {
        this.clearPlaybackHighlights();
        const l = this.shadowRoot.querySelector(".finish-btn");
        l && l.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    } else
      t.classList.add("error"), t.disabled = !0, r.classList.add("failed"), r.dataset.hadError = "true";
  }
  updateProgress() {
    const e = this.shadowRoot.querySelector(".progress-text");
    e && (e.textContent = `${this.score} / ${this.data.length}`);
  }
  startUnscrambleActivity(e = !0) {
    this.shadowRoot.querySelector("#scramble-section").style.display = "block", this.unscrambleData = [], this.currentUnscrambleIndex = 0, this.unscrambleScore = 0, this.userUnscrambledWords = [], this.unscrambleUsedSentences || (this.unscrambleUsedSentences = /* @__PURE__ */ new Set());
    let i = String.keys ? Object.keys(this.data) : Array.from(this.data.keys());
    i = i.map((n) => parseInt(n));
    const o = i.filter((n) => !this.unscrambleUsedSentences.has(n));
    let t = [];
    if (o.length >= 5)
      t = o.sort(() => 0.5 - Math.random()).slice(0, 5);
    else {
      t = [...o];
      const n = 5 - t.length, s = i.filter((a) => !o.includes(a)).sort(() => 0.5 - Math.random());
      t = t.concat(s.slice(0, n));
    }
    if (t.forEach((n) => this.unscrambleUsedSentences.add(n)), this.unscrambleUsedSentences.size >= this.data.length && (this.unscrambleUsedSentences.clear(), t.forEach((n) => this.unscrambleUsedSentences.add(n))), this.unscrambleData = t.map((n) => {
      const s = this.data[n], a = s.original.split(/\s+/).filter((h) => h.length > 0), l = [...a].sort(() => 0.5 - Math.random());
      return {
        ...s,
        correctWords: a,
        shuffledWords: l
      };
    }), this.unscrambleTotal = this.unscrambleData.length, this.currentUnscrambleIndex = 0, this.unscrambleScore = 0, this.userUnscrambledWords = [], (this.getAttribute("lang-original") || "en") === "th") {
      this.startMemoryGame();
      return;
    }
    this.renderUnscrambleChallenge(e), this.updateProgress();
  }
  renderUnscrambleChallenge(e = !0) {
    const i = this.shadowRoot.querySelector(".scramble-container");
    i.innerHTML = "";
    const o = this.unscrambleData[this.currentUnscrambleIndex], t = document.createElement("div");
    t.classList.add("card", "unscramble-card", "playing");
    const r = document.createElement("h3");
    r.innerHTML = `Unscramble the Sentence <span style="font-size: 0.8em; color: #64748b; font-weight: normal; margin-left: 0.5em; white-space: nowrap;">(${this.currentUnscrambleIndex + 1} / ${this.unscrambleTotal})</span>`, t.appendChild(r);
    const n = this.getAttribute("lang-original") || "en", s = document.createElement("button");
    s.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', s.classList.add("voice-btn"), s.style.margin = "0 auto 1em auto", s.onclick = () => {
      this._speak(o.original, n);
    }, t.appendChild(s);
    const a = document.createElement("div");
    a.classList.add("full-translation"), a.style.fontSize = "1.2em", a.textContent = o.fullTranslation, a.setAttribute("lang", this.getAttribute("lang-translation") || "th"), t.appendChild(a);
    const l = document.createElement("div");
    l.classList.add("unscramble-result"), l.setAttribute("lang", n), t.appendChild(l);
    const h = document.createElement("div");
    h.classList.add("unscramble-pool"), h.setAttribute("lang", n), t.appendChild(h);
    const d = () => {
      l.innerHTML = "", this.userUnscrambledWords.forEach((b, u) => {
        const f = document.createElement("button");
        f.textContent = b, f.onclick = () => {
          this.userUnscrambledWords.splice(u, 1), d();
        }, l.appendChild(f);
      }), h.innerHTML = "", o.shuffledWords.forEach((b, u) => {
        const f = this.userUnscrambledWords.filter((y) => y === b).length, w = o.shuffledWords.filter((y) => y === b).length;
        if (f < w) {
          const y = document.createElement("button");
          y.textContent = b, y.onclick = () => {
            this.userUnscrambledWords.push(b), d();
          }, h.appendChild(y);
        }
      });
    };
    d();
    const p = document.createElement("div");
    p.classList.add("unscramble-actions");
    const m = document.createElement("button");
    m.textContent = "Skip", m.style.opacity = "0.7", m.onclick = () => {
      this.currentUnscrambleIndex++, this.userUnscrambledWords = [], this.currentUnscrambleIndex < this.unscrambleData.length ? (this.renderUnscrambleChallenge(), this.updateProgress()) : this.renderUnscrambleCompletion();
    };
    const c = document.createElement("button");
    c.textContent = "Check", c.classList.add("finish-btn"), c.style.padding = "0.8em 2em", c.onclick = () => {
      this.userUnscrambledWords.join(" ") === o.correctWords.join(" ") ? (this.unscrambleScore++, c.textContent = "Correct! Next", c.classList.add("success"), c.onclick = () => {
        this.currentUnscrambleIndex++, this.userUnscrambledWords = [], this.currentUnscrambleIndex < this.unscrambleData.length ? (this.renderUnscrambleChallenge(), this.updateProgress()) : this.renderUnscrambleCompletion();
      }) : (c.classList.add("error"), setTimeout(() => c.classList.remove("error"), 500));
    };
    const g = document.createElement("button");
    g.textContent = "Reset", g.onclick = () => {
      this.userUnscrambledWords = [], d();
    }, p.appendChild(g), p.appendChild(m), p.appendChild(c), t.appendChild(p), i.appendChild(t), e && t.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  startMemoryGame(e = !0) {
    this.shadowRoot.querySelector("#memory-section").style.display = "block", this.matchingGamesCompleted++, this.matchedPairsCount = 0, this.flippedCards = [], this.isCheckingMatch = !1;
    const i = this.data.map((n) => ({
      original: n.originalWord,
      translation: n.translationWord
    })), o = [], t = /* @__PURE__ */ new Set();
    for (; o.length < 6 && t.size < i.length; ) {
      const n = Math.floor(Math.random() * i.length);
      t.has(n) || (o.push(i[n]), t.add(n));
    }
    const r = [];
    o.forEach((n, s) => {
      r.push({ id: s, type: "original", text: n.original, lang: this.getAttribute("lang-original") || "en" }), r.push({ id: s, type: "translation", text: n.translation, lang: this.getAttribute("lang-translation") || "th" });
    }), this.memoryGameData = r.sort(() => 0.5 - Math.random()), this.memoryTotal = this.memoryGameData.length / 2, this.renderMemoryGameUI(), this.updateProgress();
  }
  renderUnscrambleCompletion() {
    const e = this.shadowRoot.querySelector(".scramble-container");
    e && (e.innerHTML = `
        <div class="card unscramble-card" style="text-align: center; border-color: #22c55e; background: #f0fdf4;">
          <h3 style="color: #16a34a;">Unscramble Complete!</h3>
          <p>You scored ${this.unscrambleScore} / ${this.unscrambleTotal}</p>
          <div style="display: flex; gap: 1em; justify-content: center; margin-top: 1em;">
            <button class="control-btn" id="scramble-again-btn">Try Again (Different Sentences)</button>
          </div>
        </div>
      `, e.querySelector("#scramble-again-btn").onclick = () => {
      this.startUnscrambleActivity();
    }), this.unscrambleCompleted = !0;
  }
  renderMemoryGameUI() {
    const e = this.shadowRoot.querySelector(".memory-container");
    e.innerHTML = "";
    const i = document.createElement("div");
    i.classList.add("memory-game-header"), i.innerHTML = `
      <h3>Memory Matching Game</h3>
      <p>Match the word with its translation!</p>
    `, e.appendChild(i);
    const o = document.createElement("div");
    o.classList.add("memory-grid"), this.memoryGameData.forEach((s, a) => {
      const l = document.createElement("div");
      l.classList.add("memory-card"), l.dataset.index = a, l.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front">?</div>
          <div class="memory-card-back" lang="${s.lang}">${s.text}</div>
        </div>
      `, l.onclick = () => this.handleMemoryCardFlip(l, s), o.appendChild(l);
    }), e.appendChild(o);
    const t = document.createElement("div");
    t.classList.add("memory-game-actions");
    const r = document.createElement("button");
    r.textContent = "Play Again (New Words)", r.onclick = () => this.startMemoryGame(), t.appendChild(r), e.appendChild(t);
    const n = this.shadowRoot.querySelector(".finish-container");
    n.style.display = "block", n.querySelector(".finish-btn").onclick = () => this.showFinalForm();
  }
  handleMemoryCardFlip(e, i) {
    if (!(this.isCheckingMatch || e.classList.contains("flipped") || e.classList.contains("matched")) && (this._speak(i.text, i.lang), e.classList.add("flipped"), this.flippedCards.push({ element: e, data: i }), this.flippedCards.length === 2)) {
      this.isCheckingMatch = !0;
      const [o, t] = this.flippedCards;
      o.data.id === t.data.id ? setTimeout(() => {
        o.element.classList.add("matched"), t.element.classList.add("matched"), this.matchedPairsCount++, this.flippedCards = [], this.isCheckingMatch = !1, this.updateProgress(), this.matchedPairsCount === this.memoryGameData.length / 2 && (this.memoryCompleted = !0);
      }, 600) : setTimeout(() => {
        o.element.classList.remove("flipped"), t.element.classList.remove("flipped"), this.flippedCards = [], this.isCheckingMatch = !1;
      }, 1200);
    }
  }
  showFinalForm() {
    const e = this.shadowRoot.querySelector(".sticky-bar");
    e && (e.style.display = "none");
    const i = this.shadowRoot.querySelector(".form-overlay");
    i.style.display = "flex";
    const o = this.shadowRoot.querySelector("#nickname"), t = this.shadowRoot.querySelector("#student-number");
    this.studentInfo.nickname ? (o.value = this.studentInfo.nickname, o.disabled = !0, t.value = this.studentInfo.number, t.disabled = !0, this.generateReport()) : (this.shadowRoot.querySelector(".initial-form").style.display = "block", this.shadowRoot.querySelector(".report-area").innerHTML = "");
  }
  generateReport() {
    const e = this.shadowRoot.querySelector("#nickname").value, i = this.shadowRoot.querySelector("#student-number").value;
    if (!e || !i) {
      alert("Please enter both nickname and student number.");
      return;
    }
    this.studentInfo = { nickname: e, number: i };
    const o = this.getAttribute("story-title") || "Story Practice", t = (/* @__PURE__ */ new Date()).toLocaleString(), r = this.data.length > 0 ? this.score / this.data.length : 0, n = this.data.length > 0 ? this.recordedSentences.size / this.data.length : 0, s = this.unscrambleData.length || this.unscrambleTotal, a = s > 0 ? this.unscrambleScore / s : 0, l = this.memoryGameData.length / 2 || this.memoryTotal, h = l > 0 ? this.matchedPairsCount / l : 0;
    let d = 85, p = 10, m = 5;
    this.unscrambleData.length === 0 && (d += p, p = 0);
    const c = r * d + a * p + h * m, g = r * (d / 2) + n * (d / 2) + a * p + h * m, b = this.shadowRoot.querySelector(".report-area");
    if (b.innerHTML = `
      <div class="report-card">
        <div class="report-icon">📄</div>
        <h3>Report Card: ${o}</h3>
        <p><strong>Student:</strong> ${e} (${i})</p>
        <p><strong>Overall Score:</strong> ${Math.round(c)}%</p>
        <p><strong>Score (with recordings):</strong> ${Math.round(g)}%</p>
        <hr style="margin: 1em 0; border: none; border-top: 1px solid #eee;">
        <p><strong>Translation Score:</strong> ${this.score} / ${this.data.length}</p>
        <p><strong>Sentences Recorded:</strong> ${this.recordedSentences.size} / ${this.data.length}</p>
        ${s > 0 ? `<p><strong>Unscramble Score:</strong> ${this.unscrambleScore} / ${s}</p>` : ""}
        <p><strong>Matching Pairs:</strong> ${this.matchedPairsCount} / ${l}</p>
        <p><strong>Completed On:</strong> ${t}</p>
        
        <div class="report-actions">
          <button class="return-btn">Return to Story</button>
          <button class="reset-all-btn">Reset All Progress</button>
        </div>
      </div>
    `, this.recordedBlobs.size > 0) {
      const u = document.createElement("div");
      u.classList.add("recordings-section");
      const f = document.createElement("h4");
      f.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#2563eb"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg> Student Recordings', u.appendChild(f);
      const w = document.createElement("div");
      w.classList.add("recordings-list"), Array.from(this.recordedBlobs.keys()).sort((v, C) => v - C).forEach((v) => {
        const C = this.data[v], k = document.createElement("div");
        k.classList.add("recording-item");
        const x = document.createElement("button");
        x.classList.add("recording-play-btn"), x.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', x.title = "Play Recording", x.onclick = () => this.playRecordedAudio(v);
        const S = document.createElement("div");
        S.classList.add("recording-text"), S.textContent = C.original, k.appendChild(x), k.appendChild(S), w.appendChild(k);
      }), u.appendChild(w), b.appendChild(u);
    }
    this.shadowRoot.querySelector(".initial-form").style.display = "none", b.querySelector(".return-btn").onclick = () => {
      this.shadowRoot.querySelector(".form-overlay").style.display = "none";
      const u = this.shadowRoot.querySelector(".sticky-bar");
      u && (u.style.display = "flex");
    }, b.querySelector(".reset-all-btn").onclick = () => {
      var u;
      confirm("Are you sure you want to reset all progress? This will delete all your scores and recordings.") && (this.completedIndices.clear(), this.recordedBlobs.clear(), this.recordedSentences.clear(), this.unscrambleScore = 0, this.matchedPairsCount = 0, this.unscrambleCompleted = !1, this.memoryCompleted = !1, this.score = 0, this.answeredCount = 0, (u = this.unscrambleUsedSentences) == null || u.clear(), this.shadowRoot.querySelector(".form-overlay").style.display = "none", this.shadowRoot.querySelector(".report-area").innerHTML = "", this.shadowRoot.querySelector(".initial-form").style.display = "block", this.loadData());
    };
  }
  swapLanguages() {
    const e = this.getAttribute("lang-original") || "en", i = this.getAttribute("lang-translation") || "th";
    this.setAttribute("lang-original", i), this.setAttribute("lang-translation", e), this.isSwapped = !this.isSwapped, this.selectedVoiceName = null, this._updateVoiceList(), this.data = this.data.map((o) => {
      const t = o.fullTranslation, r = o.original, n = o.translationWord, s = o.originalWord;
      return {
        ...o,
        original: t,
        fullTranslation: r,
        originalWord: n,
        translationWord: s
        // Keep options as requested
      };
    }), this.displayAllLines();
  }
  render() {
    if (!(!this.data || this.data.length === 0) && (this.displayAllLines(), this.startUnscrambleActivity(!1), this.startMemoryGame(!1), this.updateProgress(), this._updateVoiceList(), !this._shouldShowAudioControls())) {
      const e = this.shadowRoot.querySelector("#autoplay-container");
      e && (e.style.display = "none");
    }
  }
}
customElements.get("tj-reader") || customElements.define("tj-reader", L);
customElements.get("lbl-reader") || customElements.define("lbl-reader", class extends L {
});
