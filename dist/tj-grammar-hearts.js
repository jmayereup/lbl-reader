class n extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.questions = [], this.currentPool = [], this.currentIndex = 0, this.hearts = 0, this.maxHearts = 3, this.questionsPerRound = 5, this.score = 0, this.grammarHint = { summary: "", content: "" }, this.studentInfo = { nickname: "", number: "" }, this.title = "Grammar Practice", this.gameState = "hint", this.isHintOpen = !1, this.isAnswered = !1, this.isCorrect = !1, this.answerFeedback = "", this.answerExplanation = "", this.userAnswer = "", this.scrambledWords = [], this.selectedScrambleIndices = [];
  }
  connectedCallback() {
    if (this.maxHearts = parseInt(this.getAttribute("hearts")) || 3, this.questionsPerRound = parseInt(this.getAttribute("round-size")) || 5, this.hearts = this.maxHearts, typeof window.marked > "u") {
      const e = document.createElement("script");
      e.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js", e.async = !0, document.head.appendChild(e);
    }
    requestAnimationFrame(() => {
      this.loadData(), this.ensureMarked(), this.render();
    });
  }
  ensureMarked() {
    if (!window.marked) {
      const e = document.createElement("script");
      e.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js", e.onload = () => this.render(), document.head.appendChild(e);
    }
  }
  loadData() {
    try {
      const e = this.querySelector('script[type="application/json"]');
      let t = e ? e.textContent : this.textContent.trim();
      if (!t)
        return;
      const r = t.replace(/"((?:\\.|[^"\\])*)"/gs, (i, o) => '"' + o.replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"');
      let s = JSON.parse(r);
      Array.isArray(s) && (s = s[0]), s.title && (this.title = s.title), s.hint && (this.grammarHint = s.hint), s.questions && Array.isArray(s.questions) && (this.questions = s.questions), this.prepRound(), this.innerHTML = "";
    } catch (e) {
      console.error("Failed to parse JSON for grammar-hearts", e), this.shadowRoot.innerHTML = '<div class="error-msg">Error loading grammar data. Please ensure your JSON is correctly formatted.</div>';
    }
  }
  // Simple Markdown-to-HTML helper (or use a library)
  // Since the user asked for a 3rd party tool, I'll use Marked.js
  parseMD(e) {
    return typeof window.marked < "u" ? window.marked.parse(e) : e.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  }
  prepRound() {
    const e = [...this.questions].sort(() => 0.5 - Math.random());
    this.currentPool = e.slice(0, Math.min(this.questionsPerRound, this.questions.length)), this.currentIndex = 0, this.hearts = this.maxHearts, this.score = 0, this.gameState = "hint", this.resetQuestionState();
  }
  resetQuestionState() {
    this.isAnswered = !1, this.isCorrect = !1, this.answerFeedback = "", this.answerExplanation = "", this.userAnswer = "", this.selectedScrambleIndices = [], this.scrambledWords = [];
  }
  _normalizeText(e) {
    return typeof e != "string" ? String(e || "") : e.trim().toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ");
  }
  handleAnswer(e) {
    if (this.isAnswered) return;
    const t = this.currentPool[this.currentIndex];
    let r = !1;
    if (t.type === "multiple-choice")
      r = e === t.correctIndex;
    else if (t.type === "fill-in-the-blank") {
      const s = this._normalizeText(e);
      Array.isArray(t.answer) ? r = t.answer.some((i) => this._normalizeText(i) === s) : typeof t.answer == "string" && (r = s === this._normalizeText(t.answer));
    } else if (t.type === "scramble") {
      const s = this._normalizeText(t.sentence);
      r = this._normalizeText(e) === s;
    }
    if (this.isAnswered = !0, this.isCorrect = r, r)
      this.score++, this.answerFeedback = "Correct!", this.answerExplanation = t.explanation || "Great job!";
    else {
      this.hearts--, this.answerFeedback = "Oops!", this.answerExplanation = t.explanation || "Not quite right.", this.hearts <= 0;
      const s = this.shadowRoot.querySelector(".card");
      s && (s.classList.add("shake"), setTimeout(() => s.classList.remove("shake"), 500));
    }
    this.render();
  }
  nextQuestion() {
    if (this.hearts <= 0) {
      this.gameState = "gameover", this.render();
      return;
    }
    this.currentIndex++, this.currentIndex >= this.currentPool.length ? this.gameState = "form" : this.resetQuestionState(), this.render();
  }
  startPlaying() {
    this.gameState = "playing", this.render();
  }
  restart() {
    this.prepRound(), this.gameState = "playing", this.render();
  }
  showReport() {
    const e = this.shadowRoot.querySelector("#nickname").value, t = this.shadowRoot.querySelector("#student-number").value;
    if (!e || !t) {
      alert("Please enter both nickname and student number.");
      return;
    }
    this.studentInfo = { nickname: e, number: t }, this.gameState = "report", this.render();
  }
  getInstruction(e) {
    if (e.instruction) return e.instruction;
    switch (e.type) {
      case "multiple-choice":
        return "Choose the correct form:";
      case "fill-in-the-blank":
        return "Fill in the blank:";
      case "scramble":
        return "Unscramble the sentence:";
      default:
        return "Practice:";
    }
  }
  render() {
    const e = `
      <style>
        :host {
          display: block;
          font-family: 'Outfit', 'Inter', sans-serif;
          max-width: 600px;
          margin: 2em auto;
          color: #1e293b;
        }

        .container {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-radius: 2em;
          padding: 2em;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2em;
        }

        .hearts {
          display: flex;
          gap: 0.3em;
        }

        .heart {
          font-size: 1.5em;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .heart.lost {
          filter: grayscale(1) opacity(0.3);
          transform: scale(0.8);
        }

        .progress-dots {
          display: flex;
          gap: 0.5em;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e2e8f0;
        }

        .dot.active {
          background: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .dot.completed {
          background: #10b981;
        }

        .card {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }

        h2 {
          margin: 0 0 0.5em 0;
          font-size: 1.5em;
          background: linear-gradient(135deg, #1e293b, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .instruction {
          font-size: 0.9em;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.5em;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hint-content {
          line-height: 1.6;
          color: #475569;
          margin-bottom: 2em;
        }

        .btn {
          padding: 1em 2em;
          border-radius: 1em;
          border: none;
          background: #3b82f6;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
        }

        .btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }

        .btn:active {
          transform: translateY(0);
        }

        .option-btn {
          display: block;
          width: 100%;
          padding: 1em;
          margin-bottom: 0.8em;
          text-align: left;
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 1em;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1em;
          color: #334155;
        }

        .option-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          background: #f8fafc;
        }

        .option-btn:disabled {
          cursor: default;
          opacity: 0.7;
        }

        .option-btn.success {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
        }

        .option-btn.error {
          background: #fef2f2;
          border-color: #ef4444;
          color: #991b1b;
        }

        .scramble-pool, .scramble-target {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          min-height: 3em;
          padding: 1em;
          background: #f8fafc;
          border-radius: 1em;
          margin-bottom: 1em;
          border: 2px dashed #e2e8f0;
        }

        .scramble-token {
          padding: 0.5em 1em;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.6em;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .scramble-token:hover {
          transform: scale(1.05);
          border-color: #3b82f6;
        }

        .input-field {
          width: 100%;
          padding: 1em;
          border: 2px solid #e2e8f0;
          border-radius: 1em;
          font-size: 1em;
          margin-bottom: 1.5em;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-field:focus {
          border-color: #3b82f6;
        }

        .report-card {
          text-align: center;
          background: white;
          padding: 2em;
          border-radius: 1.5em;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .report-stat {
          font-size: 2em;
          font-weight: 800;
          color: #3b82f6;
          margin: 0.5em 0;
        }

        .error-msg {
          color: #ef4444;
          font-weight: 600;
          text-align: center;
          margin-top: 1em;
        }

        .hint-collapsible {
          margin-top: 1.5em;
          border: 1px solid #e2e8f0;
          border-radius: 1em;
          overflow: hidden;
          background: rgba(248, 250, 252, 0.5);
          transition: all 0.3s ease;
        }

        .hint-toggle {
          width: 100%;
          padding: 1em;
          background: #f1f5f9;
          border: none;
          text-align: left;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }

        .hint-toggle:hover {
          background: #e2e8f0;
        }

        .hint-toggle-icon {
          transition: transform 0.3s;
        }

        .hint-toggle.open .hint-toggle-icon {
          transform: rotate(180deg);
        }

        .hint-drawer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, padding 0.3s;
          padding: 0 1em;
        }

        .hint-drawer.open {
          max-height: 500px;
          padding: 1em;
          border-top: 1px solid #e2e8f0;
        }
        .feedback-box {
          margin-top: 1.5em;
          padding: 1.25em;
          border-radius: 1em;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .feedback-box.success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .feedback-box.error {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .feedback-title {
          font-weight: 800;
          font-size: 1.1em;
          margin-bottom: 0.25em;
        }

        .success .feedback-title { color: #166534; }
        .error .feedback-title { color: #991b1b; }

        .feedback-explanation {
          font-size: 0.95em;
          line-height: 1.5;
          color: #475569;
        }

        .next-btn {
          margin-top: 1.5em;
          width: 100%;
        }

        .score-display {
          font-weight: 700;
          color: #3b82f6;
        }
      </style>
    `;
    let t = "";
    if (this.gameState === "hint")
      t = `
        <div class="card">
          <h2>Grammar Focus: ${this.grammarHint.summary}</h2>
          <div class="hint-content">${this.parseMD(this.grammarHint.content)}</div>
          <button class="btn" onclick="this.getRootNode().host.startPlaying()">Start Game!</button>
        </div>
      `;
    else if (this.gameState === "playing") {
      const r = this.currentPool[this.currentIndex];
      t = `
        <div class="header">
          <div style="font-weight: 600; color: #64748b;">
            Question: ${this.currentIndex + 1} / ${this.currentPool.length}
          </div>
          <div class="score-display">Score: ${this.score}</div>
          <div class="hearts">
            ${Array.from({ length: this.maxHearts }).map((s, i) => `
              <span class="heart ${i < this.maxHearts - this.hearts ? "lost" : ""}">❤️</span>
            `).join("")}
          </div>
        </div>

        <div class="card ${this.isAnswered ? "answered" : ""}">
          <div class="instruction">${this.getInstruction(r)}</div>
          ${this.renderMainText(r)}
          ${this.renderQuestion(r)}
          
          ${this.isAnswered ? `
            <div class="feedback-box ${this.isCorrect ? "success" : "error"}">
              <div class="feedback-title">${this.answerFeedback}</div>
              <div class="feedback-explanation">${this.parseMD(this.answerExplanation)}</div>
            </div>
            <button class="btn next-btn" onclick="this.getRootNode().host.nextQuestion()">
              ${this.currentIndex === this.currentPool.length - 1 ? "Finish" : "Next Question"}
            </button>
          ` : ""}
        </div>
        
        <div class="hint-collapsible">
          <button class="hint-toggle ${this.isHintOpen ? "open" : ""}" onclick="this.getRootNode().host.toggleHint()">
            <span>💡 Grammar Guide</span>
            <span class="hint-toggle-icon">▼</span>
          </button>
          <div class="hint-drawer ${this.isHintOpen ? "open" : ""}">
            <div class="hint-content" style="margin-bottom: 0;">
              ${this.parseMD(this.grammarHint.content)}
            </div>
          </div>
        </div>
      `;
    } else this.gameState === "gameover" ? t = `
        <div class="card" style="text-align: center;">
          <h2 style="color: #ef4444; background: none; -webkit-text-fill-color: initial;">Out of Hearts!</h2>
          <p>Don't worry! Practice makes perfect. Try again with new questions.</p>
          <button class="btn" onclick="this.getRootNode().host.restart()">Try Again</button>
        </div>
      ` : this.gameState === "form" ? t = `
        <div class="card">
          <h2>Great Job!</h2>
          <p>You've finished the round. Enter your details to get your report card.</p>
          <input type="text" id="nickname" class="input-field" placeholder="Enter Nickname" value="${this.studentInfo.nickname}">
          <input type="text" id="student-number" class="input-field" placeholder="Enter Student Number" value="${this.studentInfo.number}">
          <button class="btn" onclick="this.getRootNode().host.showReport()">Generate Report</button>
        </div>
      ` : this.gameState === "report" && (t = `
        <div class="report-card">
          <h2>${this.title}</h2>
          <p><strong>Student:</strong> ${this.studentInfo.nickname} (${this.studentInfo.number})</p>
          <div class="report-stat">${this.score} / ${this.currentPool.length}</div>
          <p>Take a screenshot and send it to your teacher!</p>
          <p style="font-size: 0.8em; color: #94a3b8; margin-top: 1em;">${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
          <button class="btn" style="margin-top: 1em;" onclick="this.getRootNode().host.restart()">Play Again</button>
        </div>
      `);
    this.shadowRoot.innerHTML = `
      ${e}
      <div class="container">
        ${t}
      </div>
    `, setTimeout(() => {
      const r = this.shadowRoot.querySelector("#fib-answer");
      r && r.focus();
    }, 0);
  }
  renderMainText(e) {
    let t = e.question || (e.type === "multiple-choice" || e.type === "scramble" ? "" : "___");
    if (e.type === "scramble" && this.isAnswered ? t = e.sentence : e.type !== "scramble" && (t = e.question || e.sentence || (e.type === "multiple-choice" ? "" : "___")), !t) return "";
    const r = e.type === "fill-in-the-blank" ? t.replace("___", '<span style="text-decoration: underline; font-weight: 700;">' + (this.isAnswered ? Array.isArray(e.answer) ? e.answer.join(" / ") : e.answer : "______") + "</span>") : t;
    return `<h2>${this.parseMD(r)}</h2>`;
  }
  renderQuestion(e) {
    if (!e) return '<div class="error-msg">Missing question data.</div>';
    if (e.type === "multiple-choice")
      return e.options.map((t, r) => {
        let s = "option-btn";
        return this.isAnswered && (r === e.correctIndex ? s += " success" : this.userAnswer === r && !this.isCorrect && (s += " error")), `<button class="${s}" ${this.isAnswered ? "disabled" : ""} onclick="this.getRootNode().host.handleMultipleChoice(${r})">${t}</button>`;
      }).join("");
    if (e.type === "fill-in-the-blank")
      return `
        <input type="text" class="input-field" id="fib-answer" placeholder="Type your answer here..." 
          ${this.isAnswered ? "readonly" : ""} 
          value="${this.isAnswered ? this.userAnswer : ""}"
          onkeydown="if(event.key === 'Enter') { 
            const host = this.getRootNode().host;
            if (host.isAnswered) host.nextQuestion();
            else host.handleAnswer(this.value);
          }">
        ${this.isAnswered ? "" : `<button class="btn" onclick="this.getRootNode().host.handleAnswer(this.parentElement.querySelector('#fib-answer').value)">Submit</button>`}
      `;
    if (e.type === "scramble") {
      const r = (e.sentence || e.question || "").trim().split(/\s+/);
      return this.scrambledWords.length === 0 && (this.scrambledWords = [...r].sort(() => 0.5 - Math.random())), `
        <div class="scramble-target" style="${this.isAnswered ? "border-style: solid; border-color: " + (this.isCorrect ? "#10b981" : "#ef4444") : ""}">
          ${this.selectedScrambleIndices.map((s, i) => `
            <button class="scramble-token" ${this.isAnswered ? "disabled" : ""} onclick="this.getRootNode().host.unpickWord(${i})">${this.scrambledWords[s]}</button>
          `).join("")}
        </div>
        ${this.isAnswered ? "" : `
          <div class="scramble-pool">
            ${this.scrambledWords.map((s, i) => this.selectedScrambleIndices.includes(i) ? "" : `<button class="scramble-token" onclick="this.getRootNode().host.pickWord(${i})">${s}</button>`).join("")}
          </div>
          <div style="display: flex; gap: 0.5em;">
              <button class="btn" style="flex: 1; background: #64748b;" onclick="this.getRootNode().host.resetScramble()">Reset</button>
              <button class="btn" style="flex: 2;" onclick="this.getRootNode().host.handleScrambleSubmit()">Check Answer</button>
          </div>
        `}
      `;
    }
    return "Unknown question type";
  }
  handleMultipleChoice(e) {
    this.userAnswer = e, this.handleAnswer(e);
  }
  handleScrambleSubmit() {
    const e = this.selectedScrambleIndices.map((t) => this.scrambledWords[t]).join(" ");
    this.userAnswer = e, this.handleAnswer(e);
  }
  pickWord(e) {
    this.selectedScrambleIndices.push(e), this.render();
  }
  unpickWord(e) {
    this.selectedScrambleIndices.splice(e, 1), this.render();
  }
  resetScramble() {
    this.selectedScrambleIndices = [], this.render();
  }
  toggleHint() {
    this.isHintOpen = !this.isHintOpen, this.render();
  }
}
customElements.get("tj-grammar-hearts") || customElements.define("tj-grammar-hearts", n);
customElements.get("grammar-hearts") || customElements.define("grammar-hearts", class extends n {
});
