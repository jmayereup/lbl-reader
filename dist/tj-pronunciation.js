const b = ":host{--tj-primary-color: #2563eb;--tj-primary-hover: #1d4ed8;--tj-primary-light: #eff6ff;--tj-primary-border: #bfdbfe;--tj-success-color: #22c55e;--tj-success-hover: #16a34a;--tj-success-light: #f0fdf4;--tj-success-border: #bbf7d0;--tj-error-color: #ef4444;--tj-error-hover: #dc2626;--tj-error-light: #fef2f2;--tj-error-border: #fecaca;--tj-text-main: #1e293b;--tj-text-muted: #64748b;--tj-text-light: #94a3b8;--tj-bg-main: ghostwhite;--tj-bg-card: rgba(255, 255, 255, .95);--tj-bg-alt: #f8fafc;--tj-border-light: #f1f5f9;--tj-border-main: #e2e8f0;--tj-border-dark: #cbd5e1;--tj-font-family: inherit;--tj-font-size-base: 16px;--tj-border-radius-sm: .5em;--tj-border-radius-md: .8em;--tj-border-radius-lg: 1.2em;--tj-border-radius-full: 50%;--tj-shadow-sm: 0 1px 3px rgba(0,0,0,.1);--tj-shadow-md: 0 4px 12px rgba(0,0,0,.05);--tj-shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, .1);--tj-shadow-glass: 0 4px 20px rgba(0,0,0,.05);--tj-backdrop-blur: blur(10px);--tj-transition-fast: all .2s cubic-bezier(.4, 0, .2, 1);--tj-transition-normal: all .3s ease;display:block;font-family:var(--tj-font-family);color:var(--tj-text-main);background-color:var(--tj-bg-main);position:relative;box-sizing:border-box}@media (prefers-color-scheme: dark){:host{--tj-primary-light: #1e3a8a;--tj-primary-border: #1e40af;--tj-success-light: #14532d;--tj-success-border: #166534;--tj-error-light: #7f1d1d;--tj-error-border: #991b1b;--tj-text-main: #f8fafc;--tj-text-muted: #94a3b8;--tj-text-light: #cbd5e1;--tj-bg-main: #0f172a;--tj-bg-card: rgba(30, 41, 59, .95);--tj-bg-alt: #1e293b;--tj-border-light: #334155;--tj-border-main: #475569;--tj-border-dark: #64748b}}:host *{box-sizing:border-box}.tj-card{background:var(--tj-bg-card);-webkit-backdrop-filter:var(--tj-backdrop-blur);backdrop-filter:var(--tj-backdrop-blur);border-radius:var(--tj-border-radius-lg);padding:1.5em;box-shadow:var(--tj-shadow-md);border:1px solid var(--tj-border-main);transition:var(--tj-transition-normal)}.tj-btn{font-family:inherit;font-size:1em;padding:.6em 1.2em;font-weight:600;cursor:pointer;border-radius:var(--tj-border-radius-md);transition:var(--tj-transition-fast);outline:none;display:inline-flex;align-items:center;justify-content:center;gap:.5em}.tj-btn-primary{background:var(--tj-primary-color);color:#fff;border:1px solid var(--tj-primary-hover);box-shadow:var(--tj-shadow-sm)}.tj-btn-primary:hover:not(:disabled){background:var(--tj-primary-hover);transform:translateY(-1px);box-shadow:var(--tj-shadow-md)}.tj-btn-secondary{background:var(--tj-bg-alt);color:#475569;border:1px solid var(--tj-border-main)}.tj-btn-secondary:hover:not(:disabled){background:var(--tj-border-light);border-color:var(--tj-border-dark);color:var(--tj-primary-color)}.tj-btn-success{background:var(--tj-success-color);color:#fff;border:1px solid var(--tj-success-hover)}.tj-btn-error{background:var(--tj-error-color);color:#fff;border:1px solid var(--tj-error-hover)}.tj-icon-btn{background:var(--tj-bg-alt);border:1px solid var(--tj-border-light);padding:.5em;border-radius:var(--tj-border-radius-full);width:3.5em;height:3.5em;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--tj-transition-fast);color:var(--tj-text-muted);flex-shrink:0}.tj-icon-btn:hover{background:var(--tj-primary-light);color:var(--tj-primary-color);border-color:var(--tj-primary-border);transform:scale(1.1)}.tj-input{width:100%;padding:1em;border:1px solid var(--tj-border-main);border-radius:var(--tj-border-radius-sm);font-size:1em;outline:none;transition:var(--tj-transition-fast)}.tj-input:focus{border-color:var(--tj-primary-color);box-shadow:0 0 0 3px var(--tj-primary-light)}.tj-sticky-bar{position:sticky;top:0;background:#ffffffe6;-webkit-backdrop-filter:var(--tj-backdrop-blur);backdrop-filter:var(--tj-backdrop-blur);padding:.8em 1.2em;border-radius:var(--tj-border-radius-md);box-shadow:var(--tj-shadow-glass);z-index:100;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(226,232,240,.8)}.tj-h2{font-size:1.5em;color:var(--tj-text-main);margin-top:0;margin-bottom:1em}.tj-h3{font-size:1.2em;color:var(--tj-primary-color);margin-top:0;margin-bottom:.5em}.tj-text-muted{color:var(--tj-text-muted)}.tj-flex-center{display:flex;align-items:center;justify-content:center}.tj-flex-between{display:flex;align-items:center;justify-content:space-between}.tj-divider{border:none;border-top:2px dashed var(--tj-border-main);margin:2em 0;position:relative}.tj-divider:after{content:attr(data-label);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:0 1em;color:var(--tj-text-light);font-weight:600;font-size:.9em;text-transform:uppercase;letter-spacing:.1em}.tj-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#0f172acc;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:1000;animation:tj-fadeIn .3s ease}.tj-overlay.active{display:flex}@keyframes tj-fadeIn{0%{opacity:0}to{opacity:1}}@keyframes tj-shake{0%,to{transform:translate(0)}25%{transform:translate(-5px)}75%{transform:translate(5px)}}@keyframes tj-bounce{0%,to{transform:scale(1)}50%{transform:scale(1.1)}}.tj-anim-shake{animation:tj-shake .4s ease}.tj-anim-bounce{animation:tj-bounce .4s ease}", u = '@import"https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap";:host{display:block;max-width:80em;margin:1em auto;font-family:Outfit,sans-serif}.activities-wrapper{display:flex;flex-direction:column;gap:2em;padding:1em 1em 5em}.header-main{flex:1}.progress-text{font-weight:700;color:var(--tj-primary-color);font-size:1.1em;white-space:nowrap}.play-audio-btn.playing{animation:pulse 1s infinite alternate}@keyframes pulse{0%{transform:scale(1);box-shadow:0 0 #2563eb66}to{transform:scale(1.05);box-shadow:0 0 0 10px #2563eb00}}.lr-container{display:flex;flex-direction:column;align-items:center;gap:1.5rem}.lr-target-word{font-size:2em;font-family:Inter,sans-serif;font-weight:500;text-align:center;margin-bottom:.5rem;color:var(--tj-text-main)}.lr-phonetic{font-size:1.25em;color:var(--tj-text-muted);font-family:monospace;margin-top:.2rem}.lr-translation{color:var(--tj-text-muted);font-style:italic;margin-top:.8rem;font-size:1.5em}.translation-toggle{font-size:.8em;padding:.4em 1em;border-radius:var(--tj-border-radius-full)}.lr-controls{display:flex;gap:2rem;align-items:center;justify-content:center;width:100%;margin-top:1rem}.lr-control-group{display:flex;flex-direction:column;align-items:center;gap:.5rem}.lr-label{font-size:.75em;font-weight:700;color:var(--tj-text-muted);text-transform:uppercase;letter-spacing:.05em}.record-btn{color:var(--tj-error-color)}.record-btn:hover{background:var(--tj-error-light);color:var(--tj-error-hover);border-color:var(--tj-error-border)}.record-btn.recording{background:var(--tj-error-color);color:#fff;border-color:var(--tj-error-hover);animation:pulse-record 1.5s infinite}@keyframes pulse-record{0%{box-shadow:0 0 #ef444466;transform:scale(1)}70%{box-shadow:0 0 0 15px #ef444400;transform:scale(1.05)}to{box-shadow:0 0 #ef444400;transform:scale(1)}}.playback-btn.ready{color:var(--tj-success-color)}.playback-btn.ready:hover{background:var(--tj-success-light);color:var(--tj-success-hover);border-color:var(--tj-success-border)}.playback-btn.playing{background:var(--tj-success-color);color:#fff;animation:pulse-success 1s infinite alternate}@keyframes pulse-success{0%{transform:scale(1);box-shadow:0 0 #22c55e66}to{transform:scale(1.05);box-shadow:0 0 0 10px #22c55e00}}.mp-container{display:flex;flex-direction:column;align-items:center;gap:1.5rem}.mp-options{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;width:100%}.mp-option-btn{padding:.8rem 1.5rem;min-width:120px}.mp-option-btn.highlight{border-color:var(--tj-primary-color);background:var(--tj-primary-light);transform:translateY(-2px)}.mp-focus{font-size:1.2em;color:var(--tj-text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700}.mp-instr{font-size:1.2em;color:var(--tj-text-muted);font-style:italic}.feedback-msg{min-height:1.2em;font-weight:700;font-size:1.1em}.feedback-msg.correct{color:var(--tj-success-color)}.feedback-msg.wrong{color:var(--tj-error-color)}.scramble-container{display:flex;flex-direction:column;align-items:center;gap:1.5rem;width:100%}.scramble-dropzone{min-height:80px;width:100%;border:2px dashed var(--tj-border-main);border-radius:var(--tj-border-radius-lg);padding:1rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:center;background:var(--tj-bg-alt);transition:var(--tj-transition-fast)}.scramble-dropzone.success{border-color:var(--tj-success-color);background:var(--tj-success-light)}.scramble-bank{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;width:100%}.scramble-word{background:var(--tj-bg-card);border:1px solid var(--tj-border-main);padding:.6rem 1.2rem;border-radius:var(--tj-border-radius-md);font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;box-shadow:var(--tj-shadow-sm);transition:var(--tj-transition-fast)}.scramble-word:hover{border-color:var(--tj-primary-color);transform:translateY(-2px);box-shadow:var(--tj-shadow-md);color:var(--tj-primary-color)}.scramble-word.in-dropzone{background:var(--tj-primary-light);border-color:var(--tj-primary-border);color:var(--tj-primary-color)}.scramble-controls{display:flex;gap:1rem}.voice-card{max-height:80vh;display:flex;flex-direction:column}.voice-list{padding:.5rem;overflow-y:auto;flex:1}.voice-option-btn{width:100%;text-align:left;padding:.8rem 1.2rem;margin-bottom:.5rem;border:1px solid var(--tj-border-main);border-radius:var(--tj-border-radius-md);background:var(--tj-bg-card);color:var(--tj-text-main);cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:var(--tj-transition-fast)}.voice-option-btn:hover{background-color:var(--tj-bg-alt);border-color:var(--tj-primary-color);color:var(--tj-primary-color)}.voice-option-btn.active{background:var(--tj-primary-light);border-color:var(--tj-primary-color);color:var(--tj-primary-color);font-weight:700}.badge{background:var(--tj-primary-color);color:#fff;font-size:.7em;padding:.2rem .6rem;border-radius:var(--tj-border-radius-full);font-weight:800;text-transform:uppercase}.close-voice-btn{padding:0;width:2em;height:2em;display:flex;align-items:center;justify-content:center}.tj-card.completed{border-color:var(--tj-success-color);background:var(--tj-success-light);box-shadow:var(--tj-shadow-md),0 0 0 1px var(--tj-success-border)}', g = `<div class="pronunciation-wrapper" translate="no">
    <div class="tj-sticky-bar">
        <div class="header-main">
            <h1 class="tj-h3" id="pronunciationTitle" style="margin: 0;">Pronunciation Practice</h1>
            <p class="instructions tj-text-muted" id="pronunciationInstructions" style="display: none; margin: 0; font-size: 0.9em;"></p>
        </div>
        <div class="tj-flex-center" style="gap: 1em;">
            <div class="progress-text">0 / 0</div>
            <button id="voice-btn" class="tj-icon-btn" title="Choose Voice">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z"/>
                </svg>
            </button>
        </div>
    </div>
    <div class="activities-wrapper" id="activitiesContainer">
    </div>

    <!-- Voice Selection Overlay -->
    <div class="tj-overlay" id="voice-overlay">
        <div class="tj-card voice-card" style="width: 90%; max-width: 450px;">
            <div class="voice-card-header tj-flex-between" style="margin-bottom: 1em;">
                <h3 class="tj-h3" style="margin: 0;">Choose Voice</h3>
                <button class="tj-icon-btn close-voice-btn" id="close-voice-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
            <div class="voice-list" id="voice-list"></div>
        </div>
    </div>

    <div class="tj-overlay" id="browser-prompt-overlay" style="padding: 1rem;">
        <div class="tj-card" style="max-width: 400px; text-align: center;">
            <h2 class="tj-h2">Better in a Browser</h2>
            <p class="tj-text-muted" style="margin-bottom: 2em; line-height: 1.6;">It looks like you're using an in-app browser. For the best experience (including audio features), please open this page in <b>Chrome</b> or <b>Safari</b>.</p>
            <a id="browser-action-btn" class="tj-btn tj-btn-primary" style="width: 100%; text-decoration: none;" href="javascript:void(0)">Open Browser</a>
            <button class="tj-btn tj-btn-secondary" style="width: 100%; margin-top: 1em; border: none; background: transparent; text-decoration: underline;" onclick="this.closest('.tj-overlay').classList.remove('active')">Continue anyway</button>
        </div>
    </div>
</div>
`, d = {
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  mic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>',
  headphones: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>'
};
class f extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.synth = window.speechSynthesis, this.language = "en-US", this.mediaRecorder = null, this.audioChunks = [], this.recordings = /* @__PURE__ */ new Map(), this.selectedVoiceName = localStorage.getItem("tj-pronunciation-voice"), this.isPlaying = !1, this.synth && (this.synth.onvoiceschanged = () => this._updateVoiceList());
  }
  connectedCallback() {
    const t = this.getAttribute("src");
    t ? this.loadData(t) : requestAnimationFrame(() => {
      try {
        const e = JSON.parse(this.textContent.trim());
        this.render(e);
      } catch (e) {
        console.error("Error parsing inline JSON data", e), this.shadowRoot.innerHTML = '<p style="color: red;">Error loading pronunciation data: Invalid JSON.</p>';
      }
    });
  }
  async loadData(t) {
    try {
      const i = await (await fetch(t)).json();
      this.render(i);
    } catch (e) {
      console.error("Error loading pronunciation data:", e), this.shadowRoot.innerHTML = '<p style="color: red;">Error loading pronunciation data.</p>';
    }
  }
  render(t) {
    t.language && (this.language = t.language);
    const e = document.createElement("template");
    if (e.innerHTML = `<style>${b}</style><style>${u}</style>${g}`, this.shadowRoot.firstChild && (this.shadowRoot.innerHTML = ""), this.shadowRoot.appendChild(e.content.cloneNode(!0)), t.title && (this.shadowRoot.getElementById("pronunciationTitle").textContent = t.title), t.instructions) {
      const r = this.shadowRoot.getElementById(
        "pronunciationInstructions"
      );
      r.textContent = t.instructions, r.style.display = "block";
    }
    let i = "";
    if (t.activities && Array.isArray(t.activities) && (i = t.activities.map((r, s) => this.renderActivity(r, s)).join("")), this.shadowRoot.getElementById("activitiesContainer").innerHTML = i, this.updateProgress(), this.attachEventListeners(), this._updateVoiceList(), !this._shouldShowAudioControls()) {
      const r = this.shadowRoot.getElementById("voice-btn");
      r && (r.style.display = "none"), this.checkBrowserSupport();
    }
  }
  renderActivity(t, e) {
    switch (t.type) {
      case "listen_record":
        return this.renderListenRecord(t, e);
      case "minimal_pair":
        return this.renderMinimalPair(t, e);
      case "stress_match":
        return '<div class="tj-card"><h2 class="tj-h3">Stress Match Activity (Coming Soon)</h2></div>';
      case "scramble":
        return this.renderScramble(t, e);
      case "odd_one_out":
        return '<div class="tj-card"><h2 class="tj-h3">Odd One Out Activity (Coming Soon)</h2></div>';
      default:
        return `<div class="tj-card"><p>Unknown activity type: ${t.type}</p></div>`;
    }
  }
  updateProgress() {
    const t = this.shadowRoot.querySelectorAll(".tj-card[id^='act-']").length, e = this.shadowRoot.querySelectorAll(".tj-card.completed").length, i = this.shadowRoot.querySelector(".progress-text");
    i && (i.textContent = `${e} / ${t}`);
  }
  renderListenRecord(t, e) {
    return `
            <div class="tj-card" id="act-${e}">
                <div class="activity-title tj-h3">${d.headphones} Listen & Record</div>
                <div class="lr-container">
                    <div style="text-align: center;">
                        <div class="lr-target-word">${t.targetText}</div>
                        ${t.phoneticHint ? `<div class="lr-phonetic">/[${t.phoneticHint}]/</div>` : ""}
                        
                        ${t.translation ? `
                            <button class="tj-btn tj-btn-secondary translation-toggle" data-index="${e}" style="margin-top: 1em;">Show Translation</button>
                            <div class="lr-translation hidden" id="trans-${e}" style="display: none;">${t.translation}</div>
                        ` : ""}
                    </div>

                    <div class="lr-controls">
                        <div class="lr-control-group">
                            <span class="lr-label">Listen</span>
                            <button class="tj-icon-btn play-audio-btn" data-action="play" data-text="${t.targetText.replace(/"/g, "&quot;")}">
                                ${d.play}
                            </button>
                        </div>

                        <div class="lr-control-group">
                            <span class="lr-label">Record</span>
                            <button class="tj-icon-btn record-btn" data-action="record" data-index="${e}">
                                ${d.mic}
                            </button>
                        </div>

                        <div class="lr-control-group">
                            <span class="lr-label">Playback</span>
                            <button class="tj-icon-btn playback-btn" id="playback-${e}" data-action="playback" data-index="${e}">
                                ${d.play}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
  renderMinimalPair(t, e) {
    return !t.options || !Array.isArray(t.options) ? `<div class="tj-card"><p>Error: Minimal Pair requires 'options' array.</p></div>` : `
            <div class="tj-card" id="act-${e}">
                <div class="activity-title tj-h3">
                    <span style="display:inline-block; margin-right: 0.5rem;">⚖️</span> Minimal Pair
                </div>
                <div class="mp-container">
                    ${t.focus ? `<div class="mp-focus">Focus: ${t.focus}</div>` : ""}
                    <div class="mp-instr">Click on the last word that you hear.</div>
                    
                    <button class="tj-icon-btn play-audio-btn" data-action="play-mp" data-index="${e}" 
                            data-options="${t.options.join(",").replace(/"/g, "&quot;")}" 
                            data-answer="${t.correctAnswer.replace(/"/g, "&quot;")}">
                        ${d.play}
                    </button>

                    <div class="mp-options">
                        ${t.options.map(
      (i) => `
                            <button class="tj-btn tj-btn-secondary mp-option-btn" data-action="mp-guess" data-index="${e}" data-correct="${t.correctAnswer === i}">${i}</button>
                        `
    ).join("")}
                    </div>
                    <div class="feedback-msg" id="feedback-${e}"></div>
                </div>
            </div>
        `;
  }
  renderScramble(t, e) {
    if (!t.words || !Array.isArray(t.words))
      return `<div class="tj-card"><p>Error: Scramble requires 'words' array.</p></div>`;
    let i = [...t.words];
    t.distractors && Array.isArray(t.distractors) && (i = i.concat(t.distractors));
    for (let r = i.length - 1; r > 0; r--) {
      const s = Math.floor(Math.random() * (r + 1));
      [i[r], i[s]] = [i[s], i[r]];
    }
    return `
            <div class="tj-card" id="act-${e}">
                <div class="activity-title tj-h3">
                    <span style="display:inline-block; margin-right: 0.5rem;">🧩</span> Dictation Scramble
                </div>
                <div class="scramble-container">
                    <button class="tj-icon-btn play-audio-btn" data-action="play" data-text="${t.audioText.replace(/"/g, "&quot;")}">
                        ${d.play}
                    </button>

                    <!-- Hidden data store for correct answer -->
                    <div id="scramble-ans-${e}" style="display:none;" data-answer="${t.words.join(" ").replace(/"/g, "&quot;")}"></div>

                    <div class="scramble-dropzone" id="dropzone-${e}">
                        <!-- Words dropped here -->
                    </div>

                    <div class="scramble-bank" id="bank-${e}">
                        ${i.map(
      (r, s) => `
                            <div class="scramble-word" data-action="scramble-move" data-index="${e}" data-word-id="${s}">${r}</div>
                        `
    ).join("")}
                    </div>

                    <div class="scramble-controls">
                        <button class="tj-btn tj-btn-secondary scramble-btn" data-action="scramble-reset" data-index="${e}">Reset</button>
                        <button class="tj-btn tj-btn-primary scramble-btn" data-action="scramble-check" data-index="${e}">Check</button>
                    </div>
                    
                    <div class="feedback-msg" id="feedback-${e}"></div>
                </div>
            </div>
        `;
  }
  attachEventListeners() {
    const t = this.shadowRoot.getElementById("voice-btn"), e = this.shadowRoot.getElementById("close-voice-btn"), i = this.shadowRoot.getElementById("voice-overlay");
    t && (t.onclick = () => this._showVoiceOverlay()), e && (e.onclick = () => this._hideVoiceOverlay()), i && (i.onclick = (r) => {
      r.target === i && this._hideVoiceOverlay();
    }), this.shadowRoot.querySelectorAll(".translation-toggle").forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.dataset.index, a = this.shadowRoot.querySelector("#trans-" + o);
        a.style.display === "none" ? (a.style.display = "block", s.target.textContent = "Hide Translation") : (a.style.display = "none", s.target.textContent = "Show Translation");
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="play"]').forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.closest("button"), a = o.dataset.text;
        this.playTTS(a, o);
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="play-mp"]').forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.closest("button"), a = o.dataset.options.split(","), n = o.dataset.answer;
        this.playMinimalPairSequence(a, n, o);
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="record"]').forEach((r) => {
      r.addEventListener("click", async (s) => {
        const o = s.target.closest("button"), a = o.dataset.index;
        await this.toggleRecording(o, a);
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="playback"]').forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.closest("button");
        if (o.classList.contains("ready")) {
          const a = o.dataset.index;
          this.playRecording(a, o);
        }
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="mp-guess"]').forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.closest("button"), a = o.dataset.correct === "true", n = o.dataset.index, c = this.shadowRoot.querySelector(
          "#feedback-" + n
        ), h = o.closest(".mp-options");
        if (h.querySelectorAll("button").forEach((l) => l.disabled = !0), a) {
          o.classList.add("tj-btn-success"), o.classList.remove("tj-btn-secondary"), c.textContent = "Correct! 🎉", c.className = "feedback-msg correct";
          const l = o.closest(".tj-card");
          l && (l.classList.add("completed"), this.updateProgress());
        } else
          o.classList.add("tj-btn-error"), o.classList.remove("tj-btn-secondary"), c.textContent = "Incorrect.", c.className = "feedback-msg wrong", h.querySelectorAll("button").forEach((l) => {
            l.dataset.correct === "true" && (l.classList.add("tj-btn-success"), l.classList.remove("tj-btn-secondary"));
          });
      });
    }), this.shadowRoot.querySelectorAll('.scramble-word[data-action="scramble-move"]').forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.dataset.index, a = this.shadowRoot.querySelector("#dropzone-" + o), n = this.shadowRoot.querySelector("#bank-" + o), c = this.shadowRoot.querySelector(
          "#feedback-" + o
        );
        c && (c.textContent = "", c.className = "feedback-msg"), a.classList.remove("success"), s.target.parentElement === n ? (a.appendChild(s.target), s.target.classList.add("in-dropzone")) : (n.appendChild(s.target), s.target.classList.remove("in-dropzone"));
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="scramble-reset"]').forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.dataset.index, a = this.shadowRoot.querySelector("#dropzone-" + o), n = this.shadowRoot.querySelector("#bank-" + o), c = this.shadowRoot.querySelector(
          "#feedback-" + o
        );
        c && (c.textContent = "", c.className = "feedback-msg"), a.classList.remove("success"), a.querySelectorAll(".scramble-word").forEach((l) => {
          n.appendChild(l), l.classList.remove("in-dropzone");
        });
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="scramble-check"]').forEach((r) => {
      r.addEventListener("click", (s) => {
        const o = s.target.dataset.index, a = this.shadowRoot.querySelector("#dropzone-" + o), n = this.shadowRoot.querySelector(
          "#feedback-" + o
        ), h = this.shadowRoot.querySelector(
          "#scramble-ans-" + o
        ).dataset.answer, l = Array.from(
          a.querySelectorAll(".scramble-word")
        ).map((p) => p.textContent), m = l.join(" ");
        if (l.length === 0) {
          n.textContent = "Please construct a sentence first.", n.className = "feedback-msg";
          return;
        }
        if (m === h) {
          n.textContent = "Correct! 🎉", n.className = "feedback-msg correct", a.classList.add("success");
          const p = s.target.closest(".tj-card");
          p && (p.classList.add("completed"), this.updateProgress());
        } else
          n.textContent = "Incorrect. Try again!", n.className = "feedback-msg wrong";
      });
    });
  }
  playTTS(t, e) {
    return !this.synth || !this._shouldShowAudioControls() ? Promise.resolve() : new Promise((i, r) => {
      this.synth.cancel();
      const s = new SpeechSynthesisUtterance(t);
      s.lang = this.language, s.rate = 0.9;
      let a = this.synth.getVoices().find((n) => n.name === this.selectedVoiceName);
      a || (a = this._getBestVoice(this.language)), a && (s.voice = a), s.onstart = () => {
        e.classList.add("playing"), this.isPlaying = !0;
      }, s.onend = () => {
        e.classList.remove("playing"), this.isPlaying = !1, i();
      }, s.onerror = (n) => {
        e.classList.remove("playing"), this.isPlaying = !1, r(n);
      }, this.synth.speak(s);
    });
  }
  // TTS Guide 1.3 Methods
  _getBestVoice(t) {
    if (!this.synth) return null;
    const e = this.synth.getVoices();
    if (e.length === 0) return null;
    const i = t.split(/[-_]/)[0].toLowerCase();
    let r = e.filter(
      (a) => a.lang.toLowerCase() === t.toLowerCase()
    );
    if (r.length === 0 && (r = e.filter(
      (a) => a.lang.split(/[-_]/)[0].toLowerCase() === i
    )), r.length === 0) return null;
    const s = ["natural", "google", "premium", "siri"];
    for (const a of s) {
      const n = r.find((c) => c.name.toLowerCase().includes(a));
      if (n) return n;
    }
    return r.find(
      (a) => !a.name.toLowerCase().includes("microsoft")
    ) || r[0];
  }
  _showVoiceOverlay() {
    const t = this.shadowRoot.getElementById("voice-overlay");
    t && (t.style.display = "flex", this._updateVoiceList());
  }
  _hideVoiceOverlay() {
    const t = this.shadowRoot.getElementById("voice-overlay");
    t && (t.style.display = "none");
  }
  _updateVoiceList() {
    const t = this.shadowRoot.getElementById("voice-list");
    if (!t) return;
    const e = this.synth.getVoices(), i = this.language.split(/[-_]/)[0].toLowerCase(), r = e.filter(
      (o) => o.lang.split(/[-_]/)[0].toLowerCase() === i
    ), s = this._getBestVoice(this.language);
    t.innerHTML = "", r.sort((o, a) => o.name.localeCompare(a.name)), r.forEach((o) => {
      const a = document.createElement("button");
      a.classList.add("voice-option-btn"), (this.selectedVoiceName === o.name || !this.selectedVoiceName && s && o.name === s.name) && a.classList.add("active"), a.innerHTML = `<span>${o.name}</span>`, s && o.name === s.name && (a.innerHTML += '<span class="badge">Best</span>'), a.onclick = () => {
        this.selectedVoiceName = o.name, localStorage.setItem("tj-pronunciation-voice", o.name), this._updateVoiceList(), this._hideVoiceOverlay();
      }, t.appendChild(a);
    });
  }
  _shouldShowAudioControls() {
    const t = navigator.userAgent.toLowerCase();
    return t.includes("wv") || t.includes("webview") || t.includes("instagram") || t.includes("facebook") || t.includes("line") ? !1 : !!window.speechSynthesis;
  }
  _getAndroidIntentLink() {
    if (!/android/i.test(navigator.userAgent)) return "";
    const i = new URL(window.location.href).toString().replace(/^https?:\/\//, ""), r = window.location.protocol.replace(":", "");
    return `intent://${i}#Intent;scheme=${r};package=com.android.chrome;end`;
  }
  checkBrowserSupport() {
    if (!this._shouldShowAudioControls()) {
      const t = this.shadowRoot.getElementById("browser-prompt-overlay");
      if (t) {
        t.classList.add("active");
        const e = this._getAndroidIntentLink(), i = this.shadowRoot.getElementById("browser-action-btn");
        e ? (i.href = e, i.textContent = "Open in Chrome") : (i.onclick = (r) => {
          (!i.href || i.href === "javascript:void(0)") && (r.preventDefault(), alert(
            "Please open this page in Safari or Chrome for the best experience with audio features."
          ));
        }, i.textContent = "Use Safari / Chrome");
      }
    }
  }
  async playMinimalPairSequence(t, e, i) {
    if (i.classList.contains("playing")) return;
    const s = i.closest(".mp-container").querySelectorAll(".mp-option-btn");
    try {
      for (let o = 0; o < 2; o++) {
        for (const a of t) {
          const n = Array.from(s).find(
            (c) => c.textContent.trim() === a.trim()
          );
          n && n.classList.add("highlight"), await this.playTTS(a, i), n && n.classList.remove("highlight"), await new Promise((c) => setTimeout(c, 600));
        }
        await new Promise((a) => setTimeout(a, 400));
      }
      await new Promise((o) => setTimeout(o, 500)), await this.playTTS(e, i);
    } catch (o) {
      console.error("Audio sequence error:", o), i.classList.remove("playing"), s.forEach((a) => a.classList.remove("highlight"));
    }
  }
  async toggleRecording(t, e) {
    if (t.classList.contains("recording"))
      this.mediaRecorder && this.mediaRecorder.state !== "inactive" && this.mediaRecorder.stop(), t.classList.remove("recording");
    else
      try {
        const i = await navigator.mediaDevices.getUserMedia({
          audio: !0
        });
        this.audioChunks = [], this.mediaRecorder = new MediaRecorder(i), this.mediaRecorder.ondataavailable = (r) => {
          r.data.size > 0 && this.audioChunks.push(r.data);
        }, this.mediaRecorder.onstop = () => {
          const r = new Blob(this.audioChunks, { type: "audio/webm" }), s = URL.createObjectURL(r);
          this.recordings.has(e) && URL.revokeObjectURL(this.recordings.get(e)), this.recordings.set(e, s);
          const o = this.shadowRoot.querySelector(
            `#playback-${e}`
          );
          o && o.classList.add("ready");
          const a = t.closest(".tj-card");
          a && !a.classList.contains("completed") && (a.classList.add("completed"), this.updateProgress()), i.getTracks().forEach((n) => n.stop());
        }, this.mediaRecorder.start(), t.classList.add("recording");
      } catch (i) {
        console.error("Error accessing microphone:", i), alert(
          "Could not access microphone. Please ensure you have granted permission."
        );
      }
  }
  playRecording(t, e) {
    const i = this.recordings.get(t);
    if (!i) return;
    const r = new Audio(i);
    r.onplay = () => {
      e.classList.add("playing");
    }, r.onended = () => {
      e.classList.remove("playing");
    }, r.play().catch((s) => {
      console.error("Error playing recording:", s), e.classList.remove("playing");
    });
  }
}
customElements.define("tj-pronunciation", f);
