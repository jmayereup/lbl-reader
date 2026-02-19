var x = Object.defineProperty;
var w = (b, e, t) => e in b ? x(b, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : b[e] = t;
var v = (b, e, t) => w(b, typeof e != "symbol" ? e + "" : e, t);
const h = class h extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.activityData = null, this.currentPlayerId = null, this.score = 0, this.answeredCount = 0, this.totalQuestions = 0, this.isCompleted = !1, this.studentInfo = { nickname: "", number: "" }, this.isSinglePlayer = !1, this.selectedVoiceName = null, this.isPlaying = !1, h._instances.push(this), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", () => this._updateVoiceList()), this.recordedBlobs = /* @__PURE__ */ new Map(), this.mediaRecorder = null, this.isRecordingId = null, this.recordingStartTime = 0, this.isPlayingRecordingId = null;
  }
  connectedCallback() {
    setTimeout(() => {
      const e = this.textContent.trim();
      this.textContent = "";
      try {
        this.activityData = JSON.parse(e), this.render();
      } catch (t) {
        this.shadowRoot.innerHTML = `<p style="color: red;">Error parsing JSON: ${t.message}</p>`;
      }
    }, 0);
  }
  render() {
    this.currentPlayerId === null ? this.renderSelectionScreen() : this.isCompleted ? this.renderScoreScreen() : this.renderGameScreen();
  }
  renderSelectionScreen() {
    const e = this.activityData.player_count;
    let t = `
      <style>${this.getBaseStyles()}</style>
      <div class="container">
        <h2>${this.activityData.topic}</h2>
        <p class="scenario">${this.activityData.scenario_description}</p>
        
        <div class="mode-selection">
            <p><strong>Step 1: Choose Game Mode</strong></p>
            <div class="mode-buttons">
                <button class="mode-btn ${this.isSinglePlayer ? "" : "active"}" id="mode-multi">
                    Collaborative (Multi-device)
                </button>
                <button class="mode-btn ${this.isSinglePlayer ? "active" : ""}" id="mode-single">
                    Single Player (TTS Partners)
                </button>
            </div>
        </div>

        <div class="player-selection">
            <p><strong>Step 2: Select your player number:</strong></p>
            <div class="role-grid" id="button-container"></div>
        </div>
      </div>
    `;
    this.shadowRoot.innerHTML = t, this.shadowRoot.getElementById("mode-multi").onclick = () => {
      this.isSinglePlayer = !1, this.render();
    }, this.shadowRoot.getElementById("mode-single").onclick = () => {
      this.isSinglePlayer = !0, this.render();
    };
    const o = this.shadowRoot.getElementById("button-container");
    for (let r = 1; r <= e; r++) {
      const i = document.createElement("button");
      i.className = "role-btn", i.textContent = `Player ${r}`, i.onclick = () => {
        this.currentPlayerId = r, this.calculateTotalQuestions(), this.render();
      }, o.appendChild(i);
    }
  }
  calculateTotalQuestions() {
    this.totalQuestions = 0, this.activityData.blocks.forEach((e) => {
      e.questions.forEach((t) => {
        (t.asker_id === this.currentPlayerId || this.isSinglePlayer) && this.totalQuestions++;
      });
    });
  }
  renderGameScreen() {
    const e = this.activityData, t = this.currentPlayerId;
    let o = "", r = "", i = "";
    e.blocks.forEach((a, d) => {
      a.text_holder_id === t && (o += `<div class="info-card"><p>${a.text}</p></div>`), a.questions.forEach((c, l) => {
        if (c.asker_id === t) {
          const p = `q_${d}_${l}`;
          let y = c.options.map((f, m) => `
            <label class="mc-option" id="label_${p}_${m}">
              <input type="radio" name="${p}" value="${f}" data-correct="${c.correct_answer}" data-label-id="label_${p}_${m}">
              ${f}
            </label>
          `).join(""), u = "";
          this.isSinglePlayer && (u = `
                            <button class="tts-btn" data-text="${a.text}" title="Listen to Partner">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                                Info
                            </button>
                        `), r += `
            <div class="question-card">
              <div class="question-header">
                <p class="question-text"><strong>Ask:</strong> "${c.question}"</p>
                ${u}
              </div>
              <div class="options-group">
                ${y}
              </div>
            </div>
          `;
        } else if (this.isSinglePlayer) {
          const p = `q_verbal_${d}_${l}`;
          i += `
                        <div class="question-card partner-question" data-qid="${p}">
                            <div class="question-header">
                                <p class="question-text"><strong>Partner asks:</strong> (Answer out loud)</p>
                                <button class="tts-btn" data-text="${c.question}" title="Hear Question">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                    </svg>
                                    Listen
                                </button>
                            </div>
                            <div class="recording-controls" id="rec-controls-${p}">
                                ${this.renderRecordingButtons(p)}
                            </div>
                        </div>
                    `;
        }
      });
    });
    let s = `
      <style>${this.getBaseStyles()}</style>
      <div class="container">
        <div class="header-row">
            <div class="header-info">
                <h2>${e.topic} - Player ${t}</h2>
                <div class="mode-badge">${this.isSinglePlayer ? "Single Player" : "Collaborative"}</div>
            </div>
            <div class="header-controls">
                ${this.isSinglePlayer ? `
                    <button id="voice-btn" class="icon-btn" title="Choose Voice">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z"/>
                        </svg>
                    </button>
                ` : ""}
                <div class="progress-info">${this.answeredCount} / ${this.totalQuestions} Answered</div>
            </div>
        </div>
        <div class="${this.isSinglePlayer ? "single-player-layout" : ""}">
            <div class="info-column">
                <div class="section-title">Your partner will ask you questions about this passage.</div>
                ${o || '<p class="empty-state">You have no texts to read. Listen to your partners.</p>'}
            </div>

            ${this.isSinglePlayer && i ? `
                <div class="partner-column">
                    <div class="section-title">Partner's Questions (For you)</div>
                    <div class="instruction-banner">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                        Listen and record your answer.
                    </div>
                    ${i}
                </div>
            ` : ""}
        </div>

        <div class="section-title">Your partner has the answer to these questions.</div>
        ${r || '<p class="empty-state">You have no questions to ask right now.</p>'}

        <div id="footer-actions" class="footer-actions" style="display: ${this.answeredCount === this.totalQuestions && this.totalQuestions > 0 ? "flex" : "none"}">
            <button id="complete-btn" class="complete-btn">Complete & Show Score</button>
        </div>
      </div>

      <div class="voice-overlay" id="voice-overlay" style="display: none;">
        <div class="voice-card">
            <div class="voice-card-header">
                <h3>Choose Voice</h3>
                <button class="close-voice-btn" id="close-voice-btn">×</button>
            </div>
            <div class="voice-list" id="voice-list"></div>
        </div>
      </div>
    `;
    this.shadowRoot.innerHTML = s, this.attachValidationListeners(), this.isSinglePlayer && (this.shadowRoot.getElementById("voice-btn").onclick = () => this._showVoiceOverlay(), this.shadowRoot.getElementById("close-voice-btn").onclick = () => this._hideVoiceOverlay(), this.shadowRoot.getElementById("voice-overlay").onclick = (a) => {
      a.target.id === "voice-overlay" && this._hideVoiceOverlay();
    }, this.shadowRoot.querySelectorAll(".tts-btn").forEach((a) => {
      a.onclick = () => this._playTTS(a.getAttribute("data-text"));
    }));
    const n = this.shadowRoot.getElementById("complete-btn");
    n && n.addEventListener("click", () => {
      this.isCompleted = !0, this.render();
    });
  }
  _isLastInstance() {
    const e = h._instances;
    return e.length > 1 && e[e.length - 1] === this;
  }
  _getCombinedScore() {
    const e = h._instances;
    let t = 0, o = 0, r = !0;
    return e.forEach((i) => {
      t += i.score, o += i.totalQuestions, i.isCompleted || (r = !1);
    }), { totalScore: t, totalQuestions: o, allDone: r, count: e.length };
  }
  renderScoreScreen() {
    const e = Math.round(this.score / this.totalQuestions * 100) || 0;
    let t = "🎉";
    e < 50 ? t = "💪" : e < 80 && (t = "👍");
    let o = "";
    if (this._isLastInstance()) {
      const s = this._getCombinedScore();
      if (s.allDone) {
        const n = Math.round(s.totalScore / s.totalQuestions * 100) || 0;
        let a = "🏆";
        n < 50 ? a = "💪" : n < 80 && (a = "⭐"), o = `
                    <div class="combined-score">
                        <div class="combined-header">${a} Combined Score — All ${s.count} Activities</div>
                        <div class="combined-stats">
                            <div class="combined-value">${s.totalScore} / ${s.totalQuestions}</div>
                            <div class="combined-percent">${n}%</div>
                        </div>
                        <div class="combined-bar-track">
                            <div class="combined-bar-fill" style="width: ${n}%"></div>
                        </div>
                    </div>
                `;
      } else
        o = `
                    <div class="combined-score combined-pending">
                        <div class="combined-header">📋 Activity Progress</div>
                        <p class="combined-note">${h._instances.filter((a) => a.isCompleted).length} of ${s.count} activities completed. Finish all to see your combined score.</p>
                    </div>
                `;
    }
    const r = this._isLastInstance();
    let i = `
      <style>${this.getBaseStyles()}</style>
      <div class="container score-screen">
        <div class="score-circle">
            <div class="score-value">${this.score}/${this.totalQuestions}</div>
            <div class="score-percent">${e}%</div>
        </div>
        <h2>${t} ${e >= 80 ? "Excellent!" : e >= 50 ? "Good effort!" : "Keep practicing!"}</h2>
        <p>You completed the "${this.activityData.topic}" activity as Player ${this.currentPlayerId}.</p>
        <div class="score-actions">
            <button class="role-btn" id="restart-btn">Try Again / Switch Player</button>
            ${r ? '<button class="report-btn" id="report-btn">📄 See Report Card</button>' : ""}
        </div>
        ${o}
      </div>

      ${r ? `
      <div class="report-overlay" id="report-overlay" style="display:none;">
        <div class="report-modal">
          <div class="initial-form" id="initial-form">
            <div class="report-icon">📄</div>
            <h2>Report Card</h2>
            <p>Enter your details to generate your report.</p>
            <input type="text" id="nickname-input" placeholder="Your Nickname" autocomplete="off">
            <input type="text" id="number-input" placeholder="Student Number" autocomplete="off" inputmode="numeric">
            <button class="generate-btn" id="generate-btn">Generate Report Card</button>
            <button class="cancel-btn" id="cancel-btn">Cancel</button>
          </div>
          <div class="report-area" id="report-area" style="display:none;"></div>
        </div>
      </div>
      ` : ""}
`;
    this.shadowRoot.innerHTML = i, this.scrollIntoView({ behavior: "smooth", block: "start" }), this.shadowRoot.getElementById("restart-btn").addEventListener("click", () => {
      this.score = 0, this.answeredCount = 0, this.isCompleted = !1, this.currentPlayerId = null, this.render();
    }), r && (this.shadowRoot.getElementById("report-btn").addEventListener("click", () => {
      this._showReportOverlay();
    }), this.shadowRoot.getElementById("generate-btn").addEventListener("click", () => {
      this._generateReport();
    }), this.shadowRoot.getElementById("cancel-btn").addEventListener("click", () => {
      this.shadowRoot.getElementById("report-overlay").style.display = "none";
    }), this.shadowRoot.getElementById("report-overlay").addEventListener("click", (s) => {
      s.target.id === "report-overlay" && (this.shadowRoot.getElementById("report-overlay").style.display = "none");
    }));
  }
  _showReportOverlay() {
    const e = this.shadowRoot.getElementById("report-overlay");
    if (e.style.display = "flex", this.studentInfo.nickname) {
      const t = this.shadowRoot.getElementById("nickname-input"), o = this.shadowRoot.getElementById("number-input");
      t && (t.value = this.studentInfo.nickname), o && (o.value = this.studentInfo.number), this._generateReport();
    } else {
      const t = this.shadowRoot.getElementById("initial-form"), o = this.shadowRoot.getElementById("report-area");
      t && (t.style.display = "block"), o && (o.style.display = "none");
    }
  }
  _generateReport() {
    const e = this.shadowRoot.getElementById("nickname-input"), t = this.shadowRoot.getElementById("number-input"), o = e ? e.value.trim() : this.studentInfo.nickname, r = t ? t.value.trim() : this.studentInfo.number;
    if (!o || !r) {
      alert("Please enter both nickname and student number.");
      return;
    }
    this.studentInfo = { nickname: o, number: r };
    const i = this._getCombinedScore(), s = Math.round(i.totalScore / i.totalQuestions * 100) || 0, n = (/* @__PURE__ */ new Date()).toLocaleString();
    let a = "🏆";
    s < 50 ? a = "💪" : s < 80 && (a = "⭐");
    const d = `
            <div class="rc-header">
                <div class="rc-icon">📄</div>
                <div class="rc-title">Report Card</div>
                <div class="rc-activity">Info Gap — All ${i.count} Activities</div>
            </div>
            <div class="rc-student">
                <span class="rc-label">Student</span>
                <span class="rc-value">${o} <span class="rc-number">(${r})</span></span>
            </div>
            <div class="rc-score-row">
                <div class="rc-score-circle">
                    <div class="rc-score-val">${i.totalScore}/${i.totalQuestions}</div>
                    <div class="rc-score-pct">${s}%</div>
                </div>
                <div class="rc-score-label">${a} ${s >= 80 ? "Excellent!" : s >= 50 ? "Good effort!" : "Keep practicing!"}</div>
            </div>
            <div class="rc-bar-track" style="margin: 0 0 16px 0;"><div class="rc-bar-fill" style="width:${s}%"></div></div>
            <div class="rc-details">
                <div class="rc-detail-row"><span>Total Correct</span><span>${i.totalScore} / ${i.totalQuestions}</span></div>
                <div class="rc-detail-row"><span>Completed On</span><span>${n}</span></div>
            </div>
            <div class="rc-actions">
                <button class="rc-close-btn" id="rc-close-btn">↩ Return to Activity</button>
            </div>
        `, c = this.shadowRoot.getElementById("initial-form"), l = this.shadowRoot.getElementById("report-area");
    c && (c.style.display = "none"), l && (l.style.display = "block", l.innerHTML = d), this.shadowRoot.getElementById("rc-close-btn").addEventListener("click", () => {
      this.shadowRoot.getElementById("report-overlay").style.display = "none";
    });
  }
  attachValidationListeners() {
    this.shadowRoot.querySelectorAll('input[type="radio"]').forEach((t) => {
      t.addEventListener("change", (o) => {
        const r = o.target.value, i = o.target.getAttribute("data-correct"), s = o.target.getAttribute("data-label-id"), n = this.shadowRoot.getElementById(s), a = o.target.name, d = this.shadowRoot.querySelectorAll(`input[name="${a}"]`);
        d.forEach((c) => {
          c.disabled = !0;
        }), r === i ? (n.classList.add("correct"), this.score++) : (n.classList.add("incorrect"), d.forEach((c) => {
          if (c.getAttribute("data-correct") === c.value) {
            const l = c.getAttribute("data-label-id");
            this.shadowRoot.getElementById(l).classList.add("correct-highlight");
          }
        })), this.answeredCount++, this.updateProgressDisplay(), this._checkCompletion();
      });
    });
  }
  renderRecordingButtons(e) {
    const t = this.isRecordingId === e, o = this.recordedBlobs.has(e), r = this.isPlayingRecordingId === e;
    let i = `
            <div class="btn-group">
                <button class="record-btn ${t ? "recording" : ""} ${o ? "has-recording" : ""}" 
                        onclick="this.getRootNode().host.${t ? "stopRecording" : "startRecording"}('${e}')"
                        title="${t ? "Stop Recording" : "Record Answer"}">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        ${t ? '<rect x="6" y="6" width="12" height="12"/>' : '<path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>'}
                    </svg>
                    ${t ? "Stop" : o ? "Re-record" : "Record"}
                </button>
        `;
    return o && !t && (i += `
                <button class="play-recorded-btn ${r ? "playing" : ""}" 
                        onclick="this.getRootNode().host.playRecordedAudio('${e}')"
                        title="${r ? "Stop Playback" : "Play Recording"}">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        ${r ? '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>' : '<path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>'}
                    </svg>
                    ${r ? "Playing..." : "Play"}
                </button>
            `), i += "</div>", i;
  }
  async startRecording(e) {
    if (this.isRecordingId === null)
      try {
        const t = await navigator.mediaDevices.getUserMedia({ audio: !0 });
        let o = "audio/webm";
        typeof MediaRecorder.isTypeSupported == "function" && (MediaRecorder.isTypeSupported(o) || (o = "audio/mp4", MediaRecorder.isTypeSupported(o) || (o = "")));
        const r = o ? { mimeType: o } : {};
        this.mediaRecorder = new MediaRecorder(t, r), this._recordingMimeType = this.mediaRecorder.mimeType || o || "audio/webm";
        let i = [];
        this.mediaRecorder.ondataavailable = (s) => {
          s.data.size > 0 && i.push(s.data);
        }, this.mediaRecorder.onstop = () => {
          const s = new Blob(i, { type: this._recordingMimeType });
          if (Date.now() - this.recordingStartTime > 600) {
            const a = !this.recordedBlobs.has(e);
            this.recordedBlobs.set(e, s), a && (this.score++, this.answeredCount++, this.updateProgressDisplay(), this._checkCompletion());
          }
          t.getTracks().forEach((a) => a.stop()), this.isRecordingId = null, this.refreshRecordingUI(e);
        }, this.recordingStartTime = Date.now(), this.isRecordingId = e, this.mediaRecorder.start(1e3), this.refreshRecordingUI(e);
      } catch (t) {
        console.error("Error starting recording:", t), alert("Could not access microphone. Please check permissions.");
      }
  }
  stopRecording() {
    this.mediaRecorder && this.mediaRecorder.state === "recording" && this.mediaRecorder.stop();
  }
  playRecordedAudio(e) {
    const t = this.recordedBlobs.get(e);
    if (!t) return;
    if (this._currentAudio && (this._currentAudio.pause(), this._currentAudio = null), this.isPlayingRecordingId === e) {
      this.isPlayingRecordingId = null, this.refreshRecordingUI(e);
      return;
    }
    const o = URL.createObjectURL(t), r = new Audio(o);
    this._currentAudio = r, this.isPlayingRecordingId = e, this.refreshRecordingUI(e), r.play(), r.onended = () => {
      this.isPlayingRecordingId = null, this.refreshRecordingUI(e), URL.revokeObjectURL(o);
    };
  }
  refreshRecordingUI(e) {
    const t = this.shadowRoot.getElementById(`rec-controls-${e}`);
    t && (t.innerHTML = this.renderRecordingButtons(e));
  }
  _checkCompletion() {
    if (this.answeredCount === this.totalQuestions && this.totalQuestions > 0) {
      const e = this.shadowRoot.getElementById("footer-actions");
      e && (e.style.display = "flex");
    }
  }
  updateProgressDisplay() {
    const e = this.shadowRoot.querySelector(".progress-info");
    e && (e.textContent = `${this.answeredCount} / ${this.totalQuestions} Answered`);
  }
  // TTS LOGIC
  _getBestVoice(e) {
    if (!window.speechSynthesis) return null;
    const t = window.speechSynthesis.getVoices();
    if (t.length === 0) return null;
    const o = e.split(/[-_]/)[0].toLowerCase();
    let r = t.filter((n) => n.lang.toLowerCase() === e.toLowerCase());
    if (r.length === 0 && (r = t.filter((n) => n.lang.split(/[-_]/)[0].toLowerCase() === o)), r.length === 0) return null;
    const i = ["natural", "google", "premium", "siri"];
    for (const n of i) {
      const a = r.find((d) => d.name.toLowerCase().includes(n));
      if (a) return a;
    }
    return r.find((n) => !n.name.toLowerCase().includes("microsoft")) || r[0];
  }
  _playTTS(e) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const t = new SpeechSynthesisUtterance(e), o = "en-US";
    t.lang = o;
    let i = window.speechSynthesis.getVoices().find((s) => s.name === this.selectedVoiceName);
    i || (i = this._getBestVoice(o)), i && (t.voice = i), t.onstart = () => {
      this.isPlaying = !0;
    }, t.onend = () => {
      this.isPlaying = !1;
    }, window.speechSynthesis.speak(t);
  }
  _showVoiceOverlay() {
    const e = this.shadowRoot.getElementById("voice-overlay");
    e.style.display = "flex", this._updateVoiceList();
  }
  _hideVoiceOverlay() {
    const e = this.shadowRoot.getElementById("voice-overlay");
    e.style.display = "none";
  }
  _updateVoiceList() {
    const e = this.shadowRoot.getElementById("voice-list");
    if (!e) return;
    const t = window.speechSynthesis.getVoices(), o = "en-US", r = t.filter((s) => s.lang.startsWith(o.split("-")[0])), i = this._getBestVoice(o);
    e.innerHTML = "", r.sort((s, n) => s.name.localeCompare(n.name)), r.forEach((s) => {
      const n = document.createElement("button");
      n.classList.add("voice-option-btn"), (this.selectedVoiceName === s.name || !this.selectedVoiceName && i && s.name === i.name) && n.classList.add("active"), n.innerHTML = `<span>${s.name}</span>`, i && s.name === i.name && (n.innerHTML += '<span class="badge">Best</span>'), n.onclick = () => {
        this.selectedVoiceName = s.name, this._updateVoiceList(), this._hideVoiceOverlay();
      }, e.appendChild(n);
    });
  }
  getBaseStyles() {
    return `
      :host { display: block; font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; margin-bottom: 2rem; }
      .container { border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      
      .header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; margin-bottom: 10px; padding-bottom: 10px; }
      .header-info h2 { margin: 0; color: #1e293b; }
      .mode-badge { font-size: 0.8em; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 4px; }
      
      .header-controls { display: flex; align-items: center; gap: 12px; }
      .progress-info { background: #f1f5f9; padding: 6px 14px; border-radius: 12px; font-size: 0.9em; font-weight: 600; color: #64748b; white-space: nowrap; }
      
      .icon-btn { background: none; border: 1px solid #e2e8f0; padding: 8px; border-radius: 8px; cursor: pointer; color: #475569; transition: all 0.2s; }
      .icon-btn:hover { background-color: #f1f5f9; color: #2563eb; border-color: #2563eb; }

      .scenario { color: #475569; font-style: italic; margin-bottom: 24px; }
      .section-title { font-size: 1.1em; font-weight: bold; color: #0f172a; margin: 24px 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
      
      .mode-selection { margin-bottom: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
      .mode-buttons { display: flex; gap: 12px; margin-top: 10px; }
      .mode-btn { flex: 1; padding: 12px; border: 2px solid #cbd5e1; border-radius: 6px; background: white; cursor: pointer; font-weight: 600; transition: all 0.2s; }
      .mode-btn.active { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; }

      .info-card { background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 4px 4px 0; color: #0369a1; font-weight: 500;}
      
      .question-card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 16px; border-radius: 6px; }
      .question-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 10px; }
      .question-text { margin: 0; color: #1e293b; line-height: 1.4; }
      
      .tts-btn { display: flex; align-items: center; gap: 6px; background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
      .tts-btn:hover { background: #1d4ed8; }
      .tts-btn svg { width: 16px; height: 16px; }

      .options-group { display: flex; flex-direction: column; gap: 8px; }
      .mc-option { display: flex; align-items: center; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer; transition: all 0.2s; background-color: white; }
      .mc-option:hover:not(.correct):not(.incorrect):not(.correct-highlight) { background-color: #f1f5f9; }
      .mc-option input { margin-right: 12px; cursor: pointer; }
      
      .mc-option.correct { background-color: #dcfce7; border-color: #22c55e; color: #166534; font-weight: bold; }
      .mc-option.correct-highlight { border: 2px dashed #22c55e; background-color: #f0fdf4; }
      .mc-option.incorrect { background-color: #fee2e2; border-color: #ef4444; color: #991b1b; }
      .mc-option[disabled], .mc-option input[disabled], .verbal-check[disabled] { cursor: default; }

      .partner-question { border-left: 4px solid #8b5cf6; }
      .recording-controls { margin-top: 12px; }
      
      .btn-group { display: flex; gap: 10px; }
      
      .record-btn, .play-recorded-btn { 
        display: flex; align-items: center; gap: 8px; 
        padding: 8px 16px; border-radius: 8px; border: 1px solid #e2e8f0;
        font-weight: 600; cursor: pointer; transition: all 0.2s;
        font-size: 0.9em;
      }
      
      .record-btn { background: white; color: #475569; }
      .record-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
      .record-btn.recording { background: #fee2e2; border-color: #ef4444; color: #dc2626; animation: pulse 1.5s infinite; }
      .record-btn.has-recording { border-color: #8b5cf6; color: #7c3aed; }
      
      .play-recorded-btn { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; }
      .play-recorded-btn:hover { background: #ede9fe; }
      .play-recorded-btn.playing { background: #7c3aed; color: white; }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
      }
      
      .instruction-banner { display: flex; align-items: center; gap: 8px; background: #f5f3ff; color: #5b21b6; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 0.9em; font-weight: 500; border: 1px solid #ddd6fe; }
      .instruction-banner svg { flex-shrink: 0; }

      .footer-actions { margin-top: 30px; display: none; justify-content: center; padding-top: 20px; border-top: 1px solid #f1f5f9; }
      .complete-btn { background-color: #2563eb; color: white; border: none; padding: 12px 32px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1.1em; transition: background 0.2s; }
      .complete-btn:hover { background-color: #1d4ed8; }

      .score-screen { text-align: center; padding: 40px; }
      .score-circle { width: 150px; height: 150px; border-radius: 50%; background: #f1f5f9; border: 8px solid #2563eb; margin: 0 auto 30px auto; display: flex; flex-direction: column; justify-content: center; align-items: center; }
      .score-value { font-size: 2em; font-weight: 800; color: #1e293b; }
      .score-percent { font-size: 1.2em; font-weight: 600; color: #2563eb; }
      .score-actions { display: flex; flex-direction: column; gap: 12px; align-items: center; margin-top: 8px; }
      
      .empty-state { color: #94a3b8; font-style: italic; }
      
      .role-grid { display: flex; gap: 12px; margin-top: 15px; }
      .role-btn { flex: 1; padding: 16px; font-size: 16px; font-weight: bold; cursor: pointer; background-color: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 8px; transition: all 0.2s; }
      .role-btn:hover { background-color: #e2e8f0; border-color: #94a3b8; }
      .report-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 700; cursor: pointer; transition: background 0.2s; }
      .report-btn:hover { background: #1d4ed8; }

      /* Report Overlay */
      .report-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
      .report-modal { background: white; width: 92%; max-width: 420px; padding: 28px 24px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); text-align: center; max-height: 90vh; overflow-y: auto; }
      .report-modal h2 { margin: 8px 0 4px; color: #1e293b; }
      .report-modal p { color: #64748b; margin: 0 0 16px; font-size: 0.95em; }
      .report-icon { font-size: 2.5em; margin-bottom: 4px; }
      .report-modal input { display: block; width: 100%; box-sizing: border-box; padding: 12px 14px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1em; outline: none; transition: border-color 0.2s; }
      .report-modal input:focus { border-color: #2563eb; }
      .generate-btn { width: 100%; padding: 13px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 700; cursor: pointer; transition: background 0.2s; margin-bottom: 8px; }
      .generate-btn:hover { background: #1d4ed8; }
      .cancel-btn { background: none; border: none; color: #94a3b8; font-size: 0.9em; cursor: pointer; text-decoration: underline; }

      /* Report Card */
      .report-area { text-align: left; }
      .rc-header { text-align: center; margin-bottom: 16px; }
      .rc-icon { font-size: 2em; }
      .rc-title { font-size: 1.3em; font-weight: 800; color: #1e293b; margin: 4px 0 2px; }
      .rc-activity { font-size: 0.9em; color: #64748b; }
      .rc-student { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; }
      .rc-label { font-size: 0.8em; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
      .rc-value { font-weight: 700; color: #1e293b; }
      .rc-number { color: #64748b; font-weight: 400; }
      .rc-score-row { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
      .rc-score-circle { width: 80px; height: 80px; border-radius: 50%; background: #f1f5f9; border: 6px solid #2563eb; display: flex; flex-direction: column; justify-content: center; align-items: center; flex-shrink: 0; }
      .rc-score-val { font-size: 1.1em; font-weight: 800; color: #1e293b; line-height: 1.1; }
      .rc-score-pct { font-size: 0.85em; font-weight: 700; color: #2563eb; }
      .rc-score-label { font-size: 1.1em; font-weight: 700; color: #1e293b; }
      .rc-bar-track { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
      .rc-bar-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #22c55e); border-radius: 4px; transition: width 0.6s ease; }
      .rc-details { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
      .rc-detail-row { display: flex; justify-content: space-between; padding: 9px 14px; font-size: 0.9em; border-bottom: 1px solid #f1f5f9; }
      .rc-detail-row:last-child { border-bottom: none; }
      .rc-detail-row span:first-child { color: #64748b; }
      .rc-detail-row span:last-child { font-weight: 600; color: #1e293b; }
      .rc-combined { background: linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%); border: 1px solid #bae6fd; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; text-align: center; }
      .rc-combined-title { font-size: 0.95em; font-weight: 700; color: #0c4a6e; margin-bottom: 8px; }
      .rc-combined-score { font-size: 1.4em; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
      .rc-combined-pct { color: #2563eb; }
      .rc-actions { margin-top: 16px; }
      .rc-close-btn { width: 100%; padding: 12px; background: #22c55e; color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 700; cursor: pointer; transition: background 0.2s; }
      .rc-close-btn:hover { background: #16a34a; }

      .single-player-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
      @media (max-width: 768px) {
        .single-player-layout { grid-template-columns: 1fr; gap: 0; }
        .single-player-layout .section-title:first-child { margin-top: 12px; }
      }

      /* Voice Overlay Styles */
      .voice-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
      .voice-card { background: white; width: 90%; max-width: 400px; max-height: 80vh; border-radius: 1.2em; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; overflow: hidden; }
      .voice-card-header { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
      .voice-card-header h3 { margin: 0; font-size: 1.2em; color: #1e293b; }
      .close-voice-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b; }
      .voice-list { padding: 10px; overflow-y: auto; flex: 1; }
      .voice-option-btn { width: 100%; text-align: left; padding: 12px 16px; margin-bottom: 6px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
      .voice-option-btn:hover { background-color: #f8fafc; border-color: #cbd5e1; }
      .voice-option-btn.active { background: #eff6ff; border-color: #3b82f6; color: #2563eb; font-weight: 600; }
      .badge { background: #dcfce7; color: #166534; font-size: 0.7em; padding: 2px 8px; border-radius: 10px; font-weight: bold; }

      /* Combined Score */
      .combined-score { margin-top: 30px; padding: 20px 24px; background: linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%); border: 1px solid #bae6fd; border-radius: 12px; text-align: center; }
      .combined-header { font-size: 1.1em; font-weight: 700; color: #0c4a6e; margin-bottom: 12px; }
      .combined-stats { display: flex; justify-content: center; gap: 24px; margin-bottom: 12px; }
      .combined-value { font-size: 1.8em; font-weight: 800; color: #1e293b; }
      .combined-percent { font-size: 1.8em; font-weight: 800; color: #2563eb; }
      .combined-bar-track { height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden; }
      .combined-bar-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #22c55e); border-radius: 5px; transition: width 0.6s ease; }
      .combined-pending { background: #f8fafc; border-color: #e2e8f0; }
      .combined-note { color: #64748b; font-size: 0.9em; margin: 0; }
    `;
  }
};
// Static registry of all instances on the page
v(h, "_instances", []);
let g = h;
customElements.define("tj-info-gap", g);
