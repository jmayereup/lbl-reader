class TjGrammarHearts extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Core state
    this.questions = [];
    this.currentPool = [];
    this.currentIndex = 0;
    this.hearts = 0;
    this.maxHearts = 3;
    this.questionsPerRound = 5;
    this.score = 0;
    this.grammarHint = { summary: '', content: '' };
    this.studentInfo = { nickname: '', number: '' };
    this.title = 'Grammar Practice';

    // Activity state
    this.gameState = 'hint'; // hint, playing, gameover, report
    this.isHintOpen = false;
    this.isAnswered = false;
    this.isCorrect = false;
    this.answerFeedback = '';
    this.answerExplanation = '';
    this.userAnswer = ''; // For fill-in-the-blank
    this.scrambledWords = []; // For scramble
    this.selectedScrambleIndices = [];
  }

  connectedCallback() {
    this.maxHearts = parseInt(this.getAttribute('hearts')) || 3;
    this.questionsPerRound = parseInt(this.getAttribute('round-size')) || 5;
    this.hearts = this.maxHearts;

    // Load marked.js if not already present
    if (typeof window.marked === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Use setTimeout to ensure children are parsed
    requestAnimationFrame(() => {
      this.loadData();
      this.ensureMarked();
      this.render();
    });
  }

  ensureMarked() {
    if (!window.marked) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
      script.onload = () => this.render();
      document.head.appendChild(script);
    }
  }

  loadData() {
    try {
      // Look for JSON in a script tag first (best practice)
      const scriptTag = this.querySelector('script[type="application/json"]');
      let jsonText = scriptTag ? scriptTag.textContent : this.textContent.trim();

      if (!jsonText) {
        // If empty, maybe it's not ready yet or really empty
        return;
      }

      // Pre-process: escape literal newlines inside JSON strings
      // This happens when CMS/Blog platforms wrap long JSON text
      const sanitized = jsonText.replace(/"((?:\\.|[^"\\])*)"/gs, (match, p1) => {
        return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
      });

      let data = JSON.parse(sanitized);

      // If data is an array, take the first element (common format for other extensions)
      if (Array.isArray(data)) {
        data = data[0];
      }

      if (data.title) {
        this.title = data.title;
      }

      if (data.hint) {
        this.grammarHint = data.hint;
      }

      if (data.questions && Array.isArray(data.questions)) {
        this.questions = data.questions;
      }

      this.prepRound();
      this.innerHTML = ''; // Only clear after successful parse
    } catch (e) {
      console.error('Failed to parse JSON for grammar-hearts', e);
      this.shadowRoot.innerHTML = `<div class="error-msg">Error loading grammar data. Please ensure your JSON is correctly formatted.</div>`;
    }
  }

  // Simple Markdown-to-HTML helper (or use a library)
  // Since the user asked for a 3rd party tool, I'll use Marked.js
  parseMD(text) {
    if (typeof window.marked !== 'undefined') {
      return window.marked.parse(text);
    }
    // Fallback if marked isn't loaded yet
    return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
  }

  prepRound() {
    // Pick unique questions for the round
    const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
    this.currentPool = shuffled.slice(0, Math.min(this.questionsPerRound, this.questions.length));
    this.currentIndex = 0;
    this.hearts = this.maxHearts;
    this.score = 0;
    this.gameState = 'hint';
    this.resetQuestionState();
  }

  resetQuestionState() {
    this.isAnswered = false;
    this.isCorrect = false;
    this.answerFeedback = '';
    this.answerExplanation = '';
    this.userAnswer = '';
    this.selectedScrambleIndices = [];
    this.scrambledWords = [];
  }

  _normalizeText(text) {
    if (typeof text !== 'string') return String(text || '');
    return text
      .trim()
      .toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ');
  }

  handleAnswer(answer) {
    if (this.isAnswered) return;

    const q = this.currentPool[this.currentIndex];
    let correct = false;

    if (q.type === 'multiple-choice') {
      correct = (answer === q.correctIndex);
    } else if (q.type === 'fill-in-the-blank') {
      const userAnswer = this._normalizeText(answer);
      if (Array.isArray(q.answer)) {
        correct = q.answer.some(a => this._normalizeText(a) === userAnswer);
      } else if (typeof q.answer === 'string') {
        correct = (userAnswer === this._normalizeText(q.answer));
      }
    } else if (q.type === 'scramble') {
      const canonicalTarget = this._normalizeText(q.sentence);
      const canonicalUser = this._normalizeText(answer);
      correct = (canonicalUser === canonicalTarget);
    }

    this.isAnswered = true;
    this.isCorrect = correct;

    if (correct) {
      this.score++;
      this.answerFeedback = 'Correct!';
      this.answerExplanation = q.explanation || 'Great job!';
    } else {
      this.hearts--;
      this.answerFeedback = 'Oops!';
      this.answerExplanation = q.explanation || 'Not quite right.';

      if (this.hearts <= 0) {
        // Game over will happen when they click "Next" or we can trigger it now
        // Reference app shows the explanation then game over
      }

      // Visual feedback for error
      const card = this.shadowRoot.querySelector('.card');
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
    }
    this.render();
  }

  nextQuestion() {
    if (this.hearts <= 0) {
      this.gameState = 'gameover';
      this.render();
      return;
    }

    this.currentIndex++;
    if (this.currentIndex >= this.currentPool.length) {
      this.gameState = 'form';
    } else {
      this.resetQuestionState();
    }
    this.render();
  }

  startPlaying() {
    this.gameState = 'playing';
    this.render();
  }

  restart() {
    this.prepRound();
    this.gameState = 'playing';
    this.render();
  }

  showReport() {
    const nickname = this.shadowRoot.querySelector('#nickname').value;
    const number = this.shadowRoot.querySelector('#student-number').value;

    if (!nickname || !number) {
      alert('Please enter both nickname and student number.');
      return;
    }

    this.studentInfo = { nickname, number };
    this.gameState = 'report';
    this.render();
  }

  getInstruction(q) {
    if (q.instruction) return q.instruction;
    switch (q.type) {
      case 'multiple-choice': return 'Choose the correct form:';
      case 'fill-in-the-blank': return 'Fill in the blank:';
      case 'scramble': return 'Unscramble the sentence:';
      default: return 'Practice:';
    }
  }

  render() {
    const styles = `
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

    let content = '';

    if (this.gameState === 'hint') {
      content = `
        <div class="card">
          <h2>Grammar Focus: ${this.grammarHint.summary}</h2>
          <div class="hint-content">${this.parseMD(this.grammarHint.content)}</div>
          <button class="btn" onclick="this.getRootNode().host.startPlaying()">Start Game!</button>
        </div>
      `;
    } else if (this.gameState === 'playing') {
      const q = this.currentPool[this.currentIndex];
      content = `
        <div class="header">
          <div style="font-weight: 600; color: #64748b;">
            Question: ${this.currentIndex + 1} / ${this.currentPool.length}
          </div>
          <div class="score-display">Score: ${this.score}</div>
          <div class="hearts">
            ${Array.from({ length: this.maxHearts }).map((_, i) => `
              <span class="heart ${i < (this.maxHearts - this.hearts) ? 'lost' : ''}">❤️</span>
            `).join('')}
          </div>
        </div>

        <div class="card ${this.isAnswered ? 'answered' : ''}">
          <div class="instruction">${this.getInstruction(q)}</div>
          ${this.renderMainText(q)}
          ${this.renderQuestion(q)}
          
          ${this.isAnswered ? `
            <div class="feedback-box ${this.isCorrect ? 'success' : 'error'}">
              <div class="feedback-title">${this.answerFeedback}</div>
              <div class="feedback-explanation">${this.parseMD(this.answerExplanation)}</div>
            </div>
            <button class="btn next-btn" onclick="this.getRootNode().host.nextQuestion()">
              ${this.currentIndex === this.currentPool.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          ` : ''}
        </div>
        
        <div class="hint-collapsible">
          <button class="hint-toggle ${this.isHintOpen ? 'open' : ''}" onclick="this.getRootNode().host.toggleHint()">
            <span>💡 Grammar Guide</span>
            <span class="hint-toggle-icon">▼</span>
          </button>
          <div class="hint-drawer ${this.isHintOpen ? 'open' : ''}">
            <div class="hint-content" style="margin-bottom: 0;">
              ${this.parseMD(this.grammarHint.content)}
            </div>
          </div>
        </div>
      `;
    } else if (this.gameState === 'gameover') {
      content = `
        <div class="card" style="text-align: center;">
          <h2 style="color: #ef4444; background: none; -webkit-text-fill-color: initial;">Out of Hearts!</h2>
          <p>Don't worry! Practice makes perfect. Try again with new questions.</p>
          <button class="btn" onclick="this.getRootNode().host.restart()">Try Again</button>
        </div>
      `;
    } else if (this.gameState === 'form') {
      content = `
        <div class="card">
          <h2>Great Job!</h2>
          <p>You've finished the round. Enter your details to get your report card.</p>
          <input type="text" id="nickname" class="input-field" placeholder="Enter Nickname" value="${this.studentInfo.nickname}">
          <input type="text" id="student-number" class="input-field" placeholder="Enter Student Number" value="${this.studentInfo.number}">
          <button class="btn" onclick="this.getRootNode().host.showReport()">Generate Report</button>
        </div>
      `;
    } else if (this.gameState === 'report') {
      content = `
        <div class="report-card">
          <h2>${this.title}</h2>
          <p><strong>Student:</strong> ${this.studentInfo.nickname} (${this.studentInfo.number})</p>
          <div class="report-stat">${this.score} / ${this.currentPool.length}</div>
          <p>Take a screenshot and send it to your teacher!</p>
          <p style="font-size: 0.8em; color: #94a3b8; margin-top: 1em;">${new Date().toLocaleString()}</p>
          <button class="btn" style="margin-top: 1em;" onclick="this.getRootNode().host.restart()">Play Again</button>
        </div>
      `;
    }

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="container">
        ${content}
      </div>
    `;

    // Auto-focus the input field if it's a fill-in-the-blank question
    setTimeout(() => {
      const input = this.shadowRoot.querySelector('#fib-answer');
      if (input) input.focus();
    }, 0);
  }

  renderMainText(q) {
    let text = q.question || (q.type === 'multiple-choice' ? '' : (q.type === 'scramble' ? '' : '___'));

    // For scramble, if we're answered, show the target sentence
    if (q.type === 'scramble' && this.isAnswered) {
      text = q.sentence;
    } else if (q.type !== 'scramble') {
      text = q.question || q.sentence || (q.type === 'multiple-choice' ? '' : '___');
    }

    if (!text) return '';

    const processedText = q.type === 'fill-in-the-blank'
      ? text.replace('___', '<span style="text-decoration: underline; font-weight: 700;">' + (this.isAnswered ? (Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer) : '______') + '</span>')
      : text;

    return `<h2>${this.parseMD(processedText)}</h2>`;
  }

  renderQuestion(q) {
    if (!q) return '<div class="error-msg">Missing question data.</div>';

    if (q.type === 'multiple-choice') {
      return q.options.map((opt, i) => {
        let className = 'option-btn';
        if (this.isAnswered) {
          if (i === q.correctIndex) className += ' success';
          else if (this.userAnswer === i && !this.isCorrect) className += ' error';
        }
        return `<button class="${className}" ${this.isAnswered ? 'disabled' : ''} onclick="this.getRootNode().host.handleMultipleChoice(${i})">${opt}</button>`;
      }).join('');
    } else if (q.type === 'fill-in-the-blank') {
      return `
        <input type="text" class="input-field" id="fib-answer" placeholder="Type your answer here..." 
          ${this.isAnswered ? 'readonly' : ''} 
          value="${this.isAnswered ? this.userAnswer : ''}"
          onkeydown="if(event.key === 'Enter') { 
            const host = this.getRootNode().host;
            if (host.isAnswered) host.nextQuestion();
            else host.handleAnswer(this.value);
          }">
        ${!this.isAnswered ? `<button class="btn" onclick="this.getRootNode().host.handleAnswer(this.parentElement.querySelector('#fib-answer').value)">Submit</button>` : ''}
      `;
    } else if (q.type === 'scramble') {
      const sentence = q.sentence || q.question || '';
      const words = sentence.trim().split(/\s+/);
      if (this.scrambledWords.length === 0) {
        this.scrambledWords = [...words].sort(() => 0.5 - Math.random());
      }

      return `
        <div class="scramble-target" style="${this.isAnswered ? 'border-style: solid; border-color: ' + (this.isCorrect ? '#10b981' : '#ef4444') : ''}">
          ${this.selectedScrambleIndices.map((idx, i) => `
            <button class="scramble-token" ${this.isAnswered ? 'disabled' : ''} onclick="this.getRootNode().host.unpickWord(${i})">${this.scrambledWords[idx]}</button>
          `).join('')}
        </div>
        ${!this.isAnswered ? `
          <div class="scramble-pool">
            ${this.scrambledWords.map((word, i) => {
        if (this.selectedScrambleIndices.includes(i)) return '';
        return `<button class="scramble-token" onclick="this.getRootNode().host.pickWord(${i})">${word}</button>`;
      }).join('')}
          </div>
          <div style="display: flex; gap: 0.5em;">
              <button class="btn" style="flex: 1; background: #64748b;" onclick="this.getRootNode().host.resetScramble()">Reset</button>
              <button class="btn" style="flex: 2;" onclick="this.getRootNode().host.handleScrambleSubmit()">Check Answer</button>
          </div>
        ` : ''}
      `;
    }
    return 'Unknown question type';
  }

  handleMultipleChoice(index) {
    this.userAnswer = index;
    this.handleAnswer(index);
  }

  handleScrambleSubmit() {
    const answer = this.selectedScrambleIndices.map(i => this.scrambledWords[i]).join(' ');
    this.userAnswer = answer;
    this.handleAnswer(answer);
  }

  pickWord(idx) {
    this.selectedScrambleIndices.push(idx);
    this.render();
  }

  unpickWord(idx) {
    this.selectedScrambleIndices.splice(idx, 1);
    this.render();
  }

  resetScramble() {
    this.selectedScrambleIndices = [];
    this.render();
  }

  toggleHint() {
    this.isHintOpen = !this.isHintOpen;
    this.render();
  }
}

if (!customElements.get('tj-grammar-hearts')) {
  customElements.define('tj-grammar-hearts', TjGrammarHearts);
}
if (!customElements.get('grammar-hearts')) {
  customElements.define('grammar-hearts', class extends TjGrammarHearts {});
}
