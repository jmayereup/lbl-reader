class LblReader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [];
    this.studentInfo = { nickname: '', number: '' };
    this.score = 0;
    this.answeredCount = 0;
  }

  connectedCallback() {
    this.render();
    this.loadData();
  }

  loadData() {
    try {
      if (!this.rawJson) {
        this.rawJson = this.innerHTML.trim();
        this.innerHTML = '';
      }

      const jsonText = this.rawJson;
      if (jsonText) {
        this.data = JSON.parse(jsonText).map(item => {
          const options = [...item.translationOptions];
          const correctWord = item.translationOptions[item.correctTranslationIndex];
          // Shuffle options
          for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
          }
          return {
            ...item,
            shuffledOptions: options,
            newCorrectIndex: options.indexOf(correctWord)
          };
        });
        this.displayAllLines();
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
        if (wIdx === lineData.highlightIndex) {
          span.classList.add('highlight');
        }
        span.onclick = (e) => {
          e.stopPropagation();
          this._speak(word.replace(/[.,!?;:]/g, ''), langOrg);
        };
        originalText.appendChild(span);
      });

      const playBtn = document.createElement('button');
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      playBtn.classList.add('voice-btn');
      playBtn.onclick = () => {
        this._speak(lineData.original, langOrg);
      };

      header.appendChild(originalText);
      header.appendChild(playBtn);

      const fullTranslation = document.createElement('div');
      fullTranslation.classList.add('full-translation');
      fullTranslation.textContent = lineData.fullTranslation;

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
    finishBtn.textContent = 'Submit';
    finishBtn.classList.add('finish-btn');
    finishBtn.onclick = () => this.showFinalForm();
    finishBtnContainer.appendChild(finishBtn);
    container.appendChild(finishBtnContainer);

    this.updateProgress();
  }

  _speak(text, lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }

  handleSelection(cardIndex, selectedIndex, correctIndex, button, card) {
    if (card.classList.contains('answered')) return;

    card.classList.add('answered');
    this.answeredCount++;

    const buttons = card.querySelectorAll('.translation-options button');
    buttons.forEach(b => {
      b.disabled = true;
      if (b !== button) b.style.opacity = '0.5';
    });

    if (selectedIndex === correctIndex) {
      this.score++;
      button.classList.add('success');
      card.classList.add('completed');
    } else {
      button.classList.add('error');
      card.classList.add('failed');
      // Highlight the correct word briefly so they know the answer?
      // The user didn't ask for it, but "incorrect answers to stay marked incorrect"
    }

    this.updateProgress();

    const nextCard = card.nextElementSibling;
    if (nextCard && !nextCard.classList.contains('finish-container')) {
      setTimeout(() => {
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  }

  updateProgress() {
    const progressText = this.shadowRoot.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `Results: ${this.score} / ${this.data.length}`;
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
        <h3>📄 Report Card: ${storyTitle}</h3>
        <p><strong>Student:</strong> ${nickname} (${number})</p>
        <p><strong>Final Score:</strong> ${this.score} / ${this.data.length} Correct</p>
        <p><strong>Attempted:</strong> ${this.answeredCount} / ${this.data.length} cards</p>
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

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: inherit;
          max-width: 60em;
          margin: 2em auto;
          color: #333;
          position: relative;
        }

        .progress-text {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.5em 1em;
          border-radius: 0.5em;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          z-index: 10;
          margin-bottom: 1em;
          text-align: right;
          font-weight: 600;
          color: #2563eb;
        }

        .story-container {
          display: flex;
          flex-direction: column;
          gap: 2em;
          padding: 1em;
          max-height: 70vh;
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
          padding: 2.5em;
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
      </style>
      <div class="progress-text">Progress: 0 / 0</div>
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
    `;

    this.shadowRoot.querySelector('.generate-btn').onclick = () => this.generateReport();
  }
}

customElements.define('lbl-reader', LblReader);
