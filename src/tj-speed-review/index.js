class TjSpeedReview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Core state
    this.questions = [];
    this.currentPool = [];
    this.currentIndex = 0;
    this.score = 0;
    this.bestScore = 0;
    this.timeLeft = 15;
    this.timeLimit = 15;
    this.timerInterval = null;
    this.title = 'Speed Review';
    this.questionsPerRound = 10;

    // Identity state
    this.nickname = '';
    this.studentNumber = '';
    this.identityLocked = false;

    // Activity state
    this.gameState = 'start'; // start, playing, gameover
    this.isAnswered = false;
    this.isCorrect = false;
    this.userAnswer = null;
    this.feedbackText = '';
    this.feedbackExplanation = '';
    this.shuffledOptions = [];

    // Audio
    this.synthCorrect = null;
    this.synthIncorrect = null;
    this.audioInitialized = false;
  }

  connectedCallback() {
    this.timeLimit = parseInt(this.getAttribute('time-limit')) || 15;
    this.questionsPerRound = parseInt(this.getAttribute('round-size')) || 10;
    this.bestScore = 0; // Always start fresh

    // Load external libraries
    this.loadLibrary('marked', 'https://cdn.jsdelivr.net/npm/marked/marked.min.js');
    this.loadLibrary('Tone', 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js', () => {
      this.initAudio();
    });

    // Use setTimeout to ensure children are parsed
    setTimeout(() => {
      this.loadData();
      this.render();
    }, 0);
  }

  loadLibrary(name, src, callback) {
    if (window[name]) {
      if (callback) callback();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      if (callback) callback();
      this.render(); // Re-render to ensure markdown works
    };
    document.head.appendChild(script);
  }

  initAudio() {
    if (window.Tone && !this.audioInitialized) {
      this.synthCorrect = new window.Tone.Synth().toDestination();
      this.synthIncorrect = new window.Tone.Synth({ oscillator: { type: "square" } }).toDestination();
      this.audioInitialized = true;
    }
  }

  async playSound(type) {
    if (!this.audioInitialized) return;
    await window.Tone.start();
    if (type === 'correct') {
      this.synthCorrect.triggerAttackRelease("C5", "8n");
    } else {
      this.synthIncorrect.triggerAttackRelease("G2", "8n");
    }
  }

  loadData() {
    try {
      const scriptTag = this.querySelector('script[type="application/json"]');
      let jsonText = scriptTag ? scriptTag.textContent : this.textContent.trim();

      if (!jsonText) return;

      // Pre-process: escape literal newlines inside JSON strings
      const sanitized = jsonText.replace(/"((?:\\.|[^"\\])*)"/gs, (match, p1) => {
        return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
      });

      let data = JSON.parse(sanitized);
      if (Array.isArray(data)) data = data[0];

      if (data.title) this.title = data.title;
      if (data.questions) this.questions = data.questions;

      this.innerHTML = '';
    } catch (e) {
      console.error('Failed to parse JSON for tj-speed-review', e);
      this.shadowRoot.innerHTML = `<div class="error-msg">Error loading quiz data. Check console.</div>`;
    }
  }

  parseMD(text) {
    if (window.marked && text) {
      return window.marked.parse(text);
    }
    return text || '';
  }

  startGame() {
    if (!this.identityLocked) {
      const nickInput = this.shadowRoot.querySelector('#nickname');
      const idInput = this.shadowRoot.querySelector('#student-number');

      const nickname = nickInput ? nickInput.value.trim() : '';
      const studentNumber = idInput ? idInput.value.trim() : '';

      if (!nickname || !studentNumber) {
        alert('Please enter both nickname and student number to begin.');
        return;
      }

      this.nickname = nickname;
      this.studentNumber = studentNumber;
      this.identityLocked = true;
    }

    this.score = 0;
    this.currentIndex = 0;
    const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
    this.currentPool = shuffled.slice(0, Math.min(this.questionsPerRound, this.questions.length));
    this.gameState = 'playing';
    this.loadQuestion();
  }

  loadQuestion() {
    this.isAnswered = false;
    this.userAnswer = null;
    this.feedbackText = '';
    this.feedbackExplanation = '';
    this.timeLeft = this.timeLimit;
    const q = this.currentPool[this.currentIndex];
    this.shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
    this.startTimer();
    this.render();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft -= 0.1;
      this.updateTimerBar();
      if (this.timeLeft <= 0) {
        this.handleTimeout();
      }
    }, 100);
  }

  updateTimerBar() {
    const bar = this.shadowRoot.querySelector('.timer-inner');
    if (bar) {
      const percentage = (this.timeLeft / this.timeLimit) * 100;
      bar.style.width = `${percentage}%`;
      if (this.timeLeft < 5) {
        bar.style.background = '#ef4444';
      } else {
        bar.style.background = '#22d3ee';
      }
    }
  }

  handleTimeout() {
    clearInterval(this.timerInterval);
    this.isAnswered = true;
    this.isCorrect = false;
    this.playSound('incorrect');
    this.feedbackText = "Time's Up!";
    const q = this.currentPool[this.currentIndex];
    this.feedbackExplanation = q.explanation || `The correct answer was **${q.answer}**.`;
    this.render();
  }

  async selectAnswer(option) {
    if (this.isAnswered) return;
    clearInterval(this.timerInterval);
    this.isAnswered = true;
    this.userAnswer = option;
    const q = this.currentPool[this.currentIndex];

    if (option === q.answer) {
      this.isCorrect = true;
      const points = Math.max(10, Math.round(this.timeLeft * 10));
      this.score += points;
      this.feedbackText = `+${points} points!`;
      this.feedbackExplanation = q.explanation || 'Perfect!';
      this.playSound('correct');
    } else {
      this.isCorrect = false;
      this.feedbackText = "Not quite!";
      this.feedbackExplanation = q.explanation || `The correct answer was **${q.answer}**.`;
      this.playSound('incorrect');
    }
    this.render();
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex >= this.currentPool.length) {
      this.endGame();
    } else {
      this.loadQuestion();
    }
  }

  endGame() {
    this.gameState = 'gameover';
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
    this.render();
  }

  render() {
    const styles = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          max-width: 600px;
          margin: 2em auto;
          color: #f1f5f9;
        }
        .container {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border-radius: 1.5em;
          padding: 2em;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2em;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 1em;
          gap: 1em;
        }
        .title-area {
          flex: 1;
          min-width: 0;
        }
        .title-area h1 {
          margin: 0;
          font-size: 1.5em;
          color: #e2e8f0;
          overflow-wrap: break-word;
        }
        .best-score {
          font-size: 0.7em;
          color: #94a3b8;
          text-transform: uppercase;
        }
        .score-display {
          text-align: right;
          flex-shrink: 0;
        }
        .score-val {
          font-size: 2em;
          font-weight: 800;
          color: #22d3ee;
          white-space: nowrap;
          line-height: 1;
        }
        .timer-bar {
          width: 100%;
          height: 6px;
          background: #334155;
          border-radius: 3px;
          margin-bottom: 2em;
          overflow: hidden;
        }
        .timer-inner {
          height: 100%;
          background: #22d3ee;
          width: 100%;
          transition: width 0.1s linear, background 0.3s;
        }
        .question-meta {
          color: #94a3b8;
          font-size: 0.9em;
          margin-bottom: 0.5em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .question-text {
          font-size: 1.4em;
          font-weight: 600;
          margin-bottom: 1.5em;
          line-height: 1.4;
          min-height: 3em;
        }
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1em;
        }
        @media (max-width: 480px) {
          .options-grid { grid-template-columns: 1fr; }
        }
        .option-btn {
          background: #334155;
          border: 2px solid #475569;
          color: white;
          padding: 1em;
          border-radius: 0.8em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .option-btn:hover:not(:disabled) {
          background: #475569;
          transform: translateY(-2px);
          border-color: #22d3ee;
        }
        .option-btn:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .option-btn.correct {
          background: #10b981;
          border-color: #059669;
        }
        .option-btn.incorrect {
          background: #ef4444;
          border-color: #dc2626;
        }
        .feedback-area {
          margin-top: 2em;
          text-align: center;
          padding: 1.5em;
          background: rgba(255,255,255,0.05);
          border-radius: 1em;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feedback-status {
          font-weight: 800;
          font-size: 1.2em;
          margin-bottom: 0.5em;
        }
        .feedback-status.correct { color: #10b981; }
        .feedback-status.incorrect { color: #ef4444; }
        .explanation {
          font-size: 0.95em;
          color: #cbd5e1;
          line-height: 1.5;
        }
        .btn-large {
          display: block;
          width: 100%;
          padding: 1.2em;
          background: #22d3ee;
          color: #0f172a;
          border: none;
          border-radius: 0.8em;
          font-weight: 800;
          font-size: 1.1em;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 2em;
        }
        .btn-large:hover {
          background: #06b6d4;
          transform: scale(1.02);
        }
        .start-screen, .end-screen {
          text-align: center;
          padding: 2em 0;
        }
        .start-screen h1, .end-screen h1 {
          font-size: 2.5em;
          margin-bottom: 0.5em;
        }
        .final-score {
          font-size: 4em;
          font-weight: 900;
          color: #22d3ee;
          margin: 0.5em 0;
        }
        .best-score-badge {
          background: #334155;
          padding: 0.5em 1em;
          border-radius: 2em;
          display: inline-block;
          font-size: 0.9em;
          color: #94a3b8;
        }
        .error-msg { color: #ef4444; text-align: center; padding: 2em; }
        
        /* Identity Form Styles */
        .identity-form {
          margin: 1.5em 0;
          text-align: left;
          background: rgba(255,255,255,0.05);
          padding: 1.5em;
          border-radius: 1em;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .input-group {
          margin-bottom: 1em;
        }
        .input-group:last-child {
          margin-bottom: 0;
        }
        .input-group label {
          display: block;
          font-size: 0.8em;
          color: #94a3b8;
          margin-bottom: 0.4em;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input-field {
          width: 100%;
          background: #334155;
          border: 1px solid #475569;
          color: white;
          padding: 0.8em;
          border-radius: 0.5em;
          font-size: 1em;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #22d3ee;
        }
        .locked-identity {
          margin: 1.5em 0;
          padding: 1em;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 1em;
          color: #10b981;
          font-size: 0.95em;
        }
        .locked-identity strong {
          color: #34d399;
        }
        .player-tag {
          font-size: 0.8em;
          color: #22d3ee;
          background: rgba(34, 211, 238, 0.1);
          padding: 0.2em 0.6em;
          border-radius: 4px;
          display: inline-block;
          margin-top: 0.4em;
          font-weight: 600;
        }
        .result-identity {
          font-size: 1.1em;
          color: #94a3b8;
          margin-bottom: 0.5em;
        }
        .result-identity strong {
          color: #f1f5f9;
        }
      </style>
    `;

    let content = '';

    if (this.gameState === 'start') {
      content = `
        <div class="start-screen">
          <h1>${this.title} 🏎️</h1>
          <p>Think fast! Points based on speed.</p>
          <div class="best-score-badge">Best Score: ${this.bestScore}</div>
          
          ${!this.identityLocked ? `
            <div class="identity-form">
              <div class="input-group">
                <label for="nickname">Nickname</label>
                <input type="text" id="nickname" class="input-field" placeholder="e.g. Jake">
              </div>
              <div class="input-group">
                <label for="student-number">Student Number</label>
                <input type="text" id="student-number" class="input-field" placeholder="e.g. 01">
              </div>
            </div>
          ` : `
            <div class="locked-identity">
              Playing as: <strong>${this.nickname}</strong> (${this.studentNumber})
            </div>
          `}

          <button class="btn-large" onclick="this.getRootNode().host.startGame()">Start Game!</button>
        </div>
      `;
    } else if (this.gameState === 'playing') {
      const q = this.currentPool[this.currentIndex];
      content = `
        <div class="header">
          <div class="title-area">
            <h1>${this.title}</h1>
            <div class="player-tag">${this.nickname} — ${this.studentNumber}</div>
            <div class="best-score">Best: ${this.bestScore}</div>
          </div>
          <div class="score-display">
            <div class="best-score">Score</div>
            <div class="score-val">${this.score}</div>
          </div>
        </div>

        <div class="timer-bar">
          <div class="timer-inner" style="width: ${(this.timeLeft / this.timeLimit) * 100}%"></div>
        </div>

        <div class="question-meta">Question ${this.currentIndex + 1} / ${this.currentPool.length} — ${q.category || ''}</div>
        <div class="question-text">${q.question}</div>

        <div class="options-grid">
          ${this.shuffledOptions.map(opt => {
        let className = 'option-btn';
        if (this.isAnswered) {
          if (opt === q.answer) className += ' correct';
          else if (opt === this.userAnswer) className += ' incorrect';
        }
        return `<button class="${className}" ${this.isAnswered ? 'disabled' : ''} onclick="this.getRootNode().host.selectAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</button>`;
      }).join('')}
        </div>

        ${this.isAnswered ? `
          <div class="feedback-area">
            <div class="feedback-status ${this.isCorrect ? 'correct' : 'incorrect'}">${this.feedbackText}</div>
            <div class="explanation">${this.parseMD(this.feedbackExplanation)}</div>
            <button class="btn-large" onclick="this.getRootNode().host.nextQuestion()">
              ${this.currentIndex === this.currentPool.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
        ` : ''}
      `;
    } else if (this.gameState === 'gameover') {
      content = `
        <div class="end-screen">
          <h1>Quiz Complete!</h1>
          <div class="result-identity">
            Player: <strong>${this.nickname}</strong> (${this.studentNumber})
          </div>
          <p>Your final score:</p>
          <div class="final-score">${this.score}</div>
          ${this.score >= this.bestScore && this.score > 0 ? `<p style="color: #fbbf24; font-weight: 800;">🎉 NEW HIGH SCORE! 🎉</p>` : ''}
          <div class="best-score-badge">Personal Best: ${this.bestScore}</div>
          <button class="btn-large" onclick="this.getRootNode().host.startGame()">Play Again</button>
        </div>
      `;
    }

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="container">
        ${content}
      </div>
    `;
  }
}

if (!customElements.get('tj-speed-review')) {
  customElements.define('tj-speed-review', TjSpeedReview);
}
if (!customElements.get('speed-review')) {
  customElements.define('speed-review', class extends TjSpeedReview {});
}
