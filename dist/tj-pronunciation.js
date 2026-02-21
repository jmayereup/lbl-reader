const p = '@import"https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap";:host{--tj-bg-color: #f8fafc;--tj-text-color: #1e293b;--tj-card-bg: #ffffff;--tj-accent-color: #0ea5e9;--tj-subtitle-color: #64748b;--tj-card-border: #e2e8f0;--tj-btn-bg: #f1f5f9;--tj-btn-text: #475569;--tj-btn-hover: #e2e8f0;--tj-shadow: rgba(0, 0, 0, .05);--tj-success-color: #10b981;--tj-error-color: #ef4444;display:block;box-sizing:border-box;font-family:Lato,sans-serif;background-color:var(--tj-bg-color);color:var(--tj-text-color);padding:1rem;max-width:800px;margin:0 auto}*{box-sizing:border-box}.header{text-align:center;margin-bottom:2rem}.title{font-size:2rem;color:var(--tj-accent-color);margin-bottom:.5rem}.instructions{color:var(--tj-subtitle-color);font-size:1.1rem}.activity-card{background:var(--tj-card-bg);border:1px solid var(--tj-card-border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 4px 6px -1px var(--tj-shadow)}.activity-title{font-size:1.25rem;font-weight:700;margin-bottom:1.5rem;color:var(--tj-text-color);display:flex;align-items:center;gap:.5rem}.play-audio-btn{background:var(--tj-accent-color);color:#fff;border:none;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .2s,background-color .2s;flex-shrink:0}.play-audio-btn:hover{transform:scale(1.05);background-color:#0284c7}.play-audio-btn.playing{animation:pulse 1s infinite alternate}@keyframes pulse{0%{transform:scale(1);box-shadow:0 0 #0ea5e966}to{transform:scale(1.05);box-shadow:0 0 0 10px #0ea5e900}}.lr-container{display:flex;flex-direction:column;align-items:center;gap:1.5rem}.lr-target-word{font-size:2rem;font-weight:700;text-align:center}.lr-phonetic{font-size:1.25rem;color:var(--tj-subtitle-color);font-family:monospace;margin-top:.5rem}.lr-translation{color:var(--tj-subtitle-color);font-style:italic;margin-top:.5rem;font-size:.95rem}.lr-controls{display:flex;gap:2rem;align-items:center;justify-content:center;width:100%;margin-top:1rem}.lr-control-group{display:flex;flex-direction:column;align-items:center;gap:.5rem}.lr-label{font-size:.875rem;font-weight:600;color:var(--tj-subtitle-color);text-transform:uppercase;letter-spacing:.05em}.record-btn{background:#fff;border:2px solid var(--tj-error-color);color:var(--tj-error-color);border-radius:50%;width:64px;height:64px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}.record-btn:hover{background:#fef2f2}.record-btn.recording{background:var(--tj-error-color);color:#fff;animation:pulse-record 1.5s infinite}@keyframes pulse-record{0%{box-shadow:0 0 #ef444466}70%{box-shadow:0 0 0 15px #ef444400}to{box-shadow:0 0 #ef444400}}.playback-btn{background:var(--tj-success-color);color:#fff;border:none;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.5;pointer-events:none;transition:all .2s}.playback-btn.ready{opacity:1;pointer-events:auto}.playback-btn.ready:hover{transform:scale(1.05);background:#059669}.translation-toggle{background:none;border:none;color:var(--tj-accent-color);cursor:pointer;font-size:.9rem;text-decoration:underline;margin-top:.5rem}.mp-container{display:flex;flex-direction:column;align-items:center;gap:1.5rem}.mp-options{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;width:100%;margin-top:1rem}.mp-option-btn{background:var(--tj-btn-bg);border:2px solid var(--tj-card-border);color:var(--tj-text-color);padding:1rem 2rem;border-radius:9999px;font-size:1.25rem;font-weight:700;cursor:pointer;transition:all .2s;min-width:120px}.mp-option-btn.highlight{border-color:var(--tj-accent-color);background:#0ea5e91a;transform:scale(1.05)}.mp-option-btn:hover:not(:disabled){border-color:var(--tj-accent-color);background:#fff}.mp-option-btn.correct{background:var(--tj-success-color);color:#fff;border-color:var(--tj-success-color);box-shadow:0 0 10px #10b98166}.mp-option-btn.wrong{background:var(--tj-error-color);color:#fff;border-color:var(--tj-error-color)}.mp-option-btn:disabled{cursor:not-allowed;opacity:.8}.mp-focus{font-size:.9rem;color:var(--tj-subtitle-color);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:.5rem}.mp-instr{font-size:.95rem;color:var(--tj-subtitle-color);font-style:italic;margin-bottom:1rem}.feedback-msg{min-height:1.5rem;font-weight:700;font-size:1.1rem;margin-top:.5rem}.feedback-msg.correct{color:var(--tj-success-color)}.feedback-msg.wrong{color:var(--tj-error-color)}.scramble-container{display:flex;flex-direction:column;align-items:center;gap:1.5rem}.scramble-dropzone{min-height:60px;width:100%;border:2px dashed var(--tj-card-border);border-radius:12px;padding:.5rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:center;background:var(--tj-bg-color);transition:background-color .2s}.scramble-dropzone.drag-over{background:var(--tj-btn-hover);border-color:var(--tj-accent-color)}.scramble-dropzone.success{border-color:var(--tj-success-color);background:#ecfdf5}.scramble-bank{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;width:100%}.scramble-word{background:#fff;border:1px solid var(--tj-card-border);padding:.5rem 1rem;border-radius:8px;font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;box-shadow:0 1px 3px var(--tj-shadow);transition:all .2s}.scramble-word:hover{border-color:var(--tj-accent-color);transform:translateY(-2px);box-shadow:0 4px 6px var(--tj-shadow)}.scramble-word.in-dropzone{background:var(--tj-btn-bg);border-color:var(--tj-accent-color);color:var(--tj-accent-color)}.scramble-controls{display:flex;gap:1rem;width:100%;justify-content:center}.scramble-btn{background:var(--tj-btn-bg);color:var(--tj-btn-text);border:1px solid var(--tj-card-border);padding:.5rem 1.5rem;border-radius:9999px;font-weight:700;cursor:pointer;transition:all .2s}.scramble-btn:hover{background:var(--tj-btn-hover)}.scramble-btn.primary{background:var(--tj-accent-color);color:#fff;border-color:var(--tj-accent-color)}.scramble-btn.primary:hover{background:#0284c7}', h = `<div class="pronunciation-wrapper" translate="no">
    <div class="header">
        <h1 class="title" id="pronunciationTitle">Pronunciation Practice</h1>
        <p class="instructions" id="pronunciationInstructions" style="display: none;"></p>
    </div>
    <div class="activities-container" id="activitiesContainer">
    </div>
</div>
`, l = {
  play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
  mic: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>',
  headphones: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>'
};
class m extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.synth = window.speechSynthesis, this.language = "en-US", this.mediaRecorder = null, this.audioChunks = [], this.recordings = /* @__PURE__ */ new Map();
  }
  connectedCallback() {
    const e = this.getAttribute("src");
    e ? this.loadData(e) : setTimeout(() => {
      try {
        const t = JSON.parse(this.textContent.trim());
        this.render(t);
      } catch (t) {
        console.error("Error parsing inline JSON data", t), this.shadowRoot.innerHTML = '<p style="color: red;">Error loading pronunciation data: Invalid JSON.</p>';
      }
    }, 0);
  }
  async loadData(e) {
    try {
      const o = await (await fetch(e)).json();
      this.render(o);
    } catch (t) {
      console.error("Error loading pronunciation data:", t), this.shadowRoot.innerHTML = '<p style="color: red;">Error loading pronunciation data.</p>';
    }
  }
  render(e) {
    e.language && (this.language = e.language);
    const t = document.createElement("template");
    if (t.innerHTML = `<style>${p}</style>${h}`, this.shadowRoot.firstChild && (this.shadowRoot.innerHTML = ""), this.shadowRoot.appendChild(t.content.cloneNode(!0)), e.title && (this.shadowRoot.getElementById("pronunciationTitle").textContent = e.title), e.instructions) {
      const r = this.shadowRoot.getElementById(
        "pronunciationInstructions"
      );
      r.textContent = e.instructions, r.style.display = "block";
    }
    let o = "";
    e.activities && Array.isArray(e.activities) && (o = e.activities.map((r, a) => this.renderActivity(r, a)).join("")), this.shadowRoot.getElementById("activitiesContainer").innerHTML = o, this.attachEventListeners();
  }
  renderActivity(e, t) {
    switch (e.type) {
      case "listen_record":
        return this.renderListenRecord(e, t);
      case "minimal_pair":
        return this.renderMinimalPair(e, t);
      case "stress_match":
        return '<div class="activity-card"><h2 class="activity-title">Stress Match Activity (Coming Soon)</h2></div>';
      case "scramble":
        return this.renderScramble(e, t);
      case "odd_one_out":
        return '<div class="activity-card"><h2 class="activity-title">Odd One Out Activity (Coming Soon)</h2></div>';
      default:
        return `<div class="activity-card"><p>Unknown activity type: ${e.type}</p></div>`;
    }
  }
  renderListenRecord(e, t) {
    return `
            <div class="activity-card" id="act-${t}">
                <div class="activity-title">${l.headphones} Listen & Record</div>
                <div class="lr-container">
                    <div style="text-align: center;">
                        <div class="lr-target-word">${e.targetText}</div>
                        ${e.phoneticHint ? `<div class="lr-phonetic">/[${e.phoneticHint}]/</div>` : ""}
                        
                        ${e.translation ? `
                            <button class="translation-toggle" data-index="${t}">Show Translation</button>
                            <div class="lr-translation hidden" id="trans-${t}" style="display: none;">${e.translation}</div>
                        ` : ""}
                    </div>

                    <div class="lr-controls">
                        <div class="lr-control-group">
                            <span class="lr-label">Listen</span>
                            <button class="play-audio-btn" data-action="play" data-text="${e.targetText.replace(/"/g, "&quot;")}">
                                ${l.play}
                            </button>
                        </div>

                        <div class="lr-control-group">
                            <span class="lr-label">Record</span>
                            <button class="record-btn" data-action="record" data-index="${t}">
                                ${l.mic}
                            </button>
                        </div>

                        <div class="lr-control-group">
                            <span class="lr-label">Playback</span>
                            <button class="playback-btn" id="playback-${t}" data-action="playback" data-index="${t}">
                                ${l.play}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
  renderMinimalPair(e, t) {
    return e.options && Array.isArray(e.options) ? `
            <div class="activity-card" id="act-${t}">
                <div class="activity-title">
                    <span style="display:inline-block; margin-right: 0.5rem;">⚖️</span> Minimal Pair
                </div>
                <div class="mp-container">
                    ${e.focus ? `<div class="mp-focus">Focus: ${e.focus}</div>` : ""}
                    <div class="mp-instr">Click on the last word that you hear.</div>
                    
                    <button class="play-audio-btn" data-action="play-mp" data-index="${t}" 
                            data-options="${e.options.join(",").replace(/"/g, "&quot;")}" 
                            data-answer="${e.correctAnswer.replace(/"/g, "&quot;")}">
                        ${l.play}
                    </button>

                    <div class="mp-options">
                        ${e.options.map(
      (r) => `
                            <button class="mp-option-btn" data-action="mp-guess" data-index="${t}" data-correct="${e.correctAnswer === r}">${r}</button>
                        `
    ).join("")}
                    </div>
                    <div class="feedback-msg" id="feedback-${t}"></div>
                </div>
            </div>
        ` : `<div class="activity-card"><p>Error: Minimal Pair requires 'options' array.</p></div>`;
  }
  renderScramble(e, t) {
    if (!e.words || !Array.isArray(e.words))
      return `<div class="activity-card"><p>Error: Scramble requires 'words' array.</p></div>`;
    let o = [...e.words];
    e.distractors && Array.isArray(e.distractors) && (o = o.concat(e.distractors));
    for (let r = o.length - 1; r > 0; r--) {
      const a = Math.floor(Math.random() * (r + 1));
      [o[r], o[a]] = [o[a], o[r]];
    }
    return `
            <div class="activity-card" id="act-${t}">
                <div class="activity-title">
                    <span style="display:inline-block; margin-right: 0.5rem;">🧩</span> Dictation Scramble
                </div>
                <div class="scramble-container">
                    <button class="play-audio-btn" data-action="play" data-text="${e.audioText.replace(/"/g, "&quot;")}">
                        ${l.play}
                    </button>

                    <!-- Hidden data store for correct answer -->
                    <div id="scramble-ans-${t}" style="display:none;" data-answer="${e.words.join(" ").replace(/"/g, "&quot;")}"></div>

                    <div class="scramble-dropzone" id="dropzone-${t}">
                        <!-- Words dropped here -->
                    </div>

                    <div class="scramble-bank" id="bank-${t}">
                        ${o.map(
      (r, a) => `
                            <div class="scramble-word" data-action="scramble-move" data-index="${t}" data-word-id="${a}">${r}</div>
                        `
    ).join("")}
                    </div>

                    <div class="scramble-controls">
                        <button class="scramble-btn" data-action="scramble-reset" data-index="${t}">Reset</button>
                        <button class="scramble-btn primary" data-action="scramble-check" data-index="${t}">Check</button>
                    </div>
                    
                    <div class="feedback-msg" id="feedback-${t}"></div>
                </div>
            </div>
        `;
  }
  attachEventListeners() {
    this.shadowRoot.querySelectorAll(".translation-toggle").forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.dataset.index, r = this.shadowRoot.querySelector("#trans-" + o);
        r.style.display === "none" ? (r.style.display = "block", t.target.textContent = "Hide Translation") : (r.style.display = "none", t.target.textContent = "Show Translation");
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="play"]').forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.closest("button"), r = o.dataset.text;
        this.playTTS(r, o);
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="play-mp"]').forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.closest("button"), r = o.dataset.options.split(","), a = o.dataset.answer;
        this.playMinimalPairSequence(r, a, o);
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="record"]').forEach((e) => {
      e.addEventListener("click", async (t) => {
        const o = t.target.closest("button"), r = o.dataset.index;
        await this.toggleRecording(o, r);
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="playback"]').forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.closest("button");
        if (o.classList.contains("ready")) {
          const r = o.dataset.index;
          this.playRecording(r, o);
        }
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="mp-guess"]').forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.closest("button"), r = o.dataset.correct === "true", a = o.dataset.index, s = this.shadowRoot.querySelector(
          "#feedback-" + a
        ), i = o.closest(".mp-options");
        i.querySelectorAll("button").forEach((n) => n.disabled = !0), r ? (o.classList.add("correct"), s.textContent = "Correct! 🎉", s.className = "feedback-msg correct") : (o.classList.add("wrong"), s.textContent = "Incorrect.", s.className = "feedback-msg wrong", i.querySelectorAll("button").forEach((n) => {
          n.dataset.correct === "true" && n.classList.add("correct");
        }));
      });
    }), this.shadowRoot.querySelectorAll('.scramble-word[data-action="scramble-move"]').forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.dataset.index, r = this.shadowRoot.querySelector("#dropzone-" + o), a = this.shadowRoot.querySelector("#bank-" + o), s = this.shadowRoot.querySelector(
          "#feedback-" + o
        );
        s && (s.textContent = "", s.className = "feedback-msg"), r.classList.remove("success"), t.target.parentElement === a ? (r.appendChild(t.target), t.target.classList.add("in-dropzone")) : (a.appendChild(t.target), t.target.classList.remove("in-dropzone"));
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="scramble-reset"]').forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.dataset.index, r = this.shadowRoot.querySelector("#dropzone-" + o), a = this.shadowRoot.querySelector("#bank-" + o), s = this.shadowRoot.querySelector(
          "#feedback-" + o
        );
        s && (s.textContent = "", s.className = "feedback-msg"), r.classList.remove("success"), r.querySelectorAll(".scramble-word").forEach((n) => {
          a.appendChild(n), n.classList.remove("in-dropzone");
        });
      });
    }), this.shadowRoot.querySelectorAll('button[data-action="scramble-check"]').forEach((e) => {
      e.addEventListener("click", (t) => {
        const o = t.target.dataset.index, r = this.shadowRoot.querySelector("#dropzone-" + o), a = this.shadowRoot.querySelector(
          "#feedback-" + o
        ), i = this.shadowRoot.querySelector(
          "#scramble-ans-" + o
        ).dataset.answer, n = Array.from(
          r.querySelectorAll(".scramble-word")
        ).map((d) => d.textContent), c = n.join(" ");
        if (n.length === 0) {
          a.textContent = "Please construct a sentence first.", a.className = "feedback-msg";
          return;
        }
        c === i ? (a.textContent = "Correct! 🎉", a.className = "feedback-msg correct", r.classList.add("success")) : (a.textContent = "Incorrect. Try again!", a.className = "feedback-msg wrong");
      });
    });
  }
  playTTS(e, t) {
    return this.synth ? new Promise((o, r) => {
      this.synth.cancel();
      const a = new SpeechSynthesisUtterance(e);
      a.lang = this.language;
      const s = this.synth.getVoices(), i = this.language.split(/[-_]/)[0].toLowerCase(), n = s.filter(
        (c) => c.lang.split(/[-_]/)[0].toLowerCase() === i
      );
      if (n.length > 0) {
        const c = n.find(
          (d) => d.name.toLowerCase().includes("google") || d.name.toLowerCase().includes("natural") || d.name.toLowerCase().includes("siri")
        ) || n[0];
        a.voice = c;
      }
      a.onstart = () => {
        t.classList.add("playing");
      }, a.onend = () => {
        t.classList.remove("playing"), o();
      }, a.onerror = (c) => {
        t.classList.remove("playing"), r(c);
      }, this.synth.speak(a);
    }) : Promise.resolve();
  }
  async playMinimalPairSequence(e, t, o) {
    if (o.classList.contains("playing")) return;
    const a = o.closest(".mp-container").querySelectorAll(".mp-option-btn");
    try {
      for (let s = 0; s < 2; s++) {
        for (const i of e) {
          const n = Array.from(a).find(
            (c) => c.textContent.trim() === i.trim()
          );
          n && n.classList.add("highlight"), await this.playTTS(i, o), n && n.classList.remove("highlight"), await new Promise((c) => setTimeout(c, 600));
        }
        await new Promise((i) => setTimeout(i, 400));
      }
      await new Promise((s) => setTimeout(s, 500)), await this.playTTS(t, o);
    } catch (s) {
      console.error("Audio sequence error:", s), o.classList.remove("playing"), a.forEach((i) => i.classList.remove("highlight"));
    }
  }
  async toggleRecording(e, t) {
    if (e.classList.contains("recording"))
      this.mediaRecorder && this.mediaRecorder.state !== "inactive" && this.mediaRecorder.stop(), e.classList.remove("recording");
    else
      try {
        const o = await navigator.mediaDevices.getUserMedia({
          audio: !0
        });
        this.audioChunks = [], this.mediaRecorder = new MediaRecorder(o), this.mediaRecorder.ondataavailable = (r) => {
          r.data.size > 0 && this.audioChunks.push(r.data);
        }, this.mediaRecorder.onstop = () => {
          const r = new Blob(this.audioChunks, { type: "audio/webm" }), a = URL.createObjectURL(r);
          this.recordings.has(t) && URL.revokeObjectURL(this.recordings.get(t)), this.recordings.set(t, a);
          const s = this.shadowRoot.querySelector(
            `#playback-${t}`
          );
          s && s.classList.add("ready"), o.getTracks().forEach((i) => i.stop());
        }, this.mediaRecorder.start(), e.classList.add("recording");
      } catch (o) {
        console.error("Error accessing microphone:", o), alert(
          "Could not access microphone. Please ensure you have granted permission."
        );
      }
  }
  playRecording(e, t) {
    const o = this.recordings.get(e);
    if (!o) return;
    const r = new Audio(o);
    r.onplay = () => {
      t.classList.add("playing");
    }, r.onended = () => {
      t.classList.remove("playing");
    }, r.play().catch((a) => {
      console.error("Error playing recording:", a), t.classList.remove("playing");
    });
  }
}
customElements.define("tj-pronunciation", m);
