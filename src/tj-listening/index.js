class TjListening extends HTMLElement {
    // Static registry of all instances on the page
    static _instances = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.lessonData = null;
        this.currentPhase = 0; // 0=intro, 1=vocab, 2=listening
        this.score = 0;
        this.answeredCount = 0;
        this.totalQuestions = 0;
        this.isCompleted = false;

        // Student info for report card
        this.studentInfo = { nickname: '', number: '' };

        // TTS State
        this.selectedVoiceName = null;
        this.isPlaying = false;

        // Audio element references
        this._currentAudioEl = null;

        // Quiz mode — hides transcript when ?quiz=1 is in URL
        const params = new URLSearchParams(window.location.search);
        this.isQuizMode = params.get('quiz') === '1';

        // Register this instance
        TjListening._instances.push(this);

        // Use addEventListener so multiple instances don't clobber each other
        if (window.speechSynthesis) {
            window.speechSynthesis.addEventListener('voiceschanged', () => this._updateVoiceList());
        }
    }

    connectedCallback() {
        // Use setTimeout to ensure children (JSON content) are parsed by the browser
        requestAnimationFrame(() => {
            const rawJson = this.textContent.trim();
            this.textContent = '';

            try {
                this.lessonData = JSON.parse(rawJson);
                this.totalQuestions = this.lessonData.listening?.questions?.length || 0;
                this.render();

                // Retry voice list population for mobile
                this._updateVoiceList();
                setTimeout(() => this._updateVoiceList(), 500);
                setTimeout(() => this._updateVoiceList(), 1500);
            } catch (error) {
                this.shadowRoot.innerHTML = `<p style="color: red;">Error parsing JSON: ${error.message}</p>`;
            }
        });
    }

    _getLang() {
        return this.lessonData?.lang || 'en-US';
    }

    render() {
        if (this.isCompleted) {
            this.renderScoreScreen();
        } else {
            this.renderLesson();
        }
    }

    renderLesson() {
        const data = this.lessonData;
        const phaseLabels = ['Introduction', 'Vocabulary', 'Listening'];

        let phaseContent = '';
        if (this.currentPhase === 0) {
            phaseContent = this._renderIntroPhase();
        } else if (this.currentPhase === 1) {
            phaseContent = this._renderVocabPhase();
        } else {
            phaseContent = this._renderListeningPhase();
        }

        const html = `
      <style>${this.getBaseStyles()}</style>
      <div class="container">
        <div class="header-row">
            <div class="header-info">
                <h2>${data.title || 'Listening Lesson'}</h2>
                <div class="phase-badge">${phaseLabels[this.currentPhase]}</div>
            </div>
            <div class="header-controls">
                <button id="share-quiz-btn" class="icon-btn" title="Share as Quiz (no transcript)">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                    </svg>
                </button>
                <button id="voice-btn" class="icon-btn" title="Choose Voice">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z"/>
                    </svg>
                </button>
                ${this.currentPhase === 2 ? `<div class="progress-info">${this.answeredCount} / ${this.totalQuestions} Answered</div>` : ''}
            </div>
        </div>

        <!-- Phase Progress Dots -->
        <div class="phase-dots">
            ${phaseLabels.map((label, i) => `
                <div class="phase-dot-group ${i === this.currentPhase ? 'active' : ''} ${i < this.currentPhase ? 'completed' : ''}">
                    <div class="phase-dot">${i < this.currentPhase ? '✓' : i + 1}</div>
                    <span class="phase-dot-label">${label}</span>
                </div>
                ${i < phaseLabels.length - 1 ? '<div class="phase-dot-line"></div>' : ''}
            `).join('')}
        </div>

        <div class="phase-content">
            ${phaseContent}
        </div>

        <div class="phase-nav">
            <button class="nav-btn" id="prev-btn" ${this.currentPhase === 0 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                Back
            </button>
            ${this.currentPhase < 2 ? `
                <button class="nav-btn nav-btn-primary" id="next-btn">
                    Next
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
            ` : ''}
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

        this.shadowRoot.innerHTML = html;
        this._attachListeners();
    }

    // ─── PHASE RENDERERS ───────────────────────────────────

    _renderIntroPhase() {
        const intro = this.lessonData.intro || {};

        return `
            <div class="intro-section">
                ${intro.context ? `<div class="context-card">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    <span>${intro.context}</span>
                </div>` : ''}
                <div class="intro-text">
                    <p>${intro.text || 'Welcome to this listening lesson.'}</p>
                </div>
            </div>
        `;
    }

    _renderVocabPhase() {
        const vocab = this.lessonData.vocab || [];

        if (vocab.length === 0) {
            return '<p class="empty-state">No vocabulary items for this lesson.</p>';
        }

        const cardsHtml = vocab.map((item, i) => `
            <div class="vocab-card">
                <div class="vocab-header">
                    <h3 class="vocab-word">${item.word}</h3>
                    <button class="tts-btn vocab-play-btn" data-text="${item.word}. ${item.example || ''}" title="Listen">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                    </button>
                </div>
                <p class="vocab-definition">${item.definition}</p>
                ${item.example ? `<p class="vocab-example">"${item.example}"</p>` : ''}
            </div>
        `).join('');

        return `
            <div class="instruction-banner">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                Review the vocabulary before listening. Tap the speaker to hear each word.
            </div>
            <div class="vocab-grid">
                ${cardsHtml}
            </div>
        `;
    }

    _renderListeningPhase() {
        const listening = this.lessonData.listening || {};
        const audioListening = this.getAttribute('audio-listening');

        let audioHtml = '';
        if (audioListening) {
            audioHtml = `
                <div class="audio-player">
                    <audio controls preload="metadata" class="audio-el">
                        <source src="${audioListening}" type="audio/mpeg">
                        Your browser does not support audio playback.
                    </audio>
                </div>
            `;
        } else {
            audioHtml = `
                <button class="tts-play-btn" id="listening-play-btn" title="Listen to dialogue">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    <span>Play Dialogue</span>
                </button>
            `;
        }

        // Build transcript display (hidden in quiz mode)
        let transcriptHtml = '';
        if (listening.transcript && !this.isQuizMode) {
            const lines = listening.transcript.split('\n').filter(l => l.trim());
            transcriptHtml = `
                <div class="transcript-box">
                    <div class="transcript-header">
                        <span class="transcript-label">Transcript</span>
                        <button class="transcript-toggle" id="transcript-toggle">Show</button>
                    </div>
                    <div class="transcript-body" id="transcript-body" style="display: none;">
                        ${lines.map(line => `<p class="transcript-line">${line}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        // Build comprehension questions
        let questionsHtml = '';
        if (listening.questions && listening.questions.length > 0) {
            questionsHtml = listening.questions.map((q, qIndex) => {
                const questionId = `q_${qIndex}`;
                const optionsHtml = q.options.map((opt, optIndex) => `
                    <label class="mc-option" id="label_${questionId}_${optIndex}">
                        <input type="radio" name="${questionId}" value="${opt}" data-correct="${q.correct}" data-label-id="label_${questionId}_${optIndex}">
                        ${opt}
                    </label>
                `).join('');

                return `
                    <div class="question-card">
                        <div class="question-header">
                            <p class="question-text"><strong>Q${qIndex + 1}.</strong> ${q.question}</p>
                            <button class="tts-btn" data-text="${q.question}" title="Listen to question">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="options-group">
                            ${optionsHtml}
                        </div>
                    </div>
                `;
            }).join('');
        }

        return `
            <div class="listening-section">
                <div class="instruction-banner">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                    Listen to the dialogue, then answer the comprehension questions below.
                </div>
                ${audioHtml}
                ${transcriptHtml}
                <div class="section-title">Comprehension Questions</div>
                ${questionsHtml}
                <div id="footer-actions" class="footer-actions" style="display: ${this.answeredCount === this.totalQuestions && this.totalQuestions > 0 ? 'flex' : 'none'}">
                    <button id="complete-btn" class="complete-btn">See My Score</button>
                </div>
            </div>
        `;
    }

    // ─── EVENT LISTENERS ───────────────────────────────────

    _attachListeners() {
        // Navigation
        const prevBtn = this.shadowRoot.getElementById('prev-btn');
        const nextBtn = this.shadowRoot.getElementById('next-btn');
        if (prevBtn) prevBtn.onclick = () => this._navigatePhase(-1);
        if (nextBtn) nextBtn.onclick = () => this._navigatePhase(1);

        // Share as Quiz button
        const shareBtn = this.shadowRoot.getElementById('share-quiz-btn');
        if (shareBtn) shareBtn.onclick = () => this._shareAsQuiz();

        // Voice overlay
        this.shadowRoot.getElementById('voice-btn').onclick = () => this._showVoiceOverlay();
        this.shadowRoot.getElementById('close-voice-btn').onclick = () => this._hideVoiceOverlay();
        this.shadowRoot.getElementById('voice-overlay').onclick = (e) => {
            if (e.target.id === 'voice-overlay') this._hideVoiceOverlay();
        };

        // TTS buttons (vocab + question play buttons)
        this.shadowRoot.querySelectorAll('.tts-btn, .vocab-play-btn').forEach(btn => {
            btn.onclick = () => this._playTTS(btn.getAttribute('data-text'));
        });

        // Listening play button (TTS)
        const listeningPlayBtn = this.shadowRoot.getElementById('listening-play-btn');
        if (listeningPlayBtn) {
            listeningPlayBtn.onclick = () => {
                const text = this.lessonData.listening?.transcript || '';
                this._playTTS(text);
            };
        }

        // Transcript toggle
        const transcriptToggle = this.shadowRoot.getElementById('transcript-toggle');
        if (transcriptToggle) {
            transcriptToggle.onclick = () => {
                const body = this.shadowRoot.getElementById('transcript-body');
                if (body.style.display === 'none') {
                    body.style.display = 'block';
                    transcriptToggle.textContent = 'Hide';
                } else {
                    body.style.display = 'none';
                    transcriptToggle.textContent = 'Show';
                }
            };
        }

        // MC validation
        this._attachValidationListeners();

        // Complete button
        const completeBtn = this.shadowRoot.getElementById('complete-btn');
        if (completeBtn) {
            completeBtn.onclick = () => {
                this.isCompleted = true;
                this.render();
            };
        }
    }

    _navigatePhase(direction) {
        const newPhase = this.currentPhase + direction;
        if (newPhase >= 0 && newPhase <= 2) {
            // Stop any TTS playback when switching phases
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            this.currentPhase = newPhase;
            this.render();
            this.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    _attachValidationListeners() {
        const radios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const selectedValue = e.target.value;
                const correctAnswer = e.target.getAttribute('data-correct');
                const labelId = e.target.getAttribute('data-label-id');
                const parentLabel = this.shadowRoot.getElementById(labelId);

                const groupName = e.target.name;
                const groupRadios = this.shadowRoot.querySelectorAll(`input[name="${groupName}"]`);

                // Disable all radios in this group
                groupRadios.forEach(r => { r.disabled = true; });

                if (selectedValue === correctAnswer) {
                    parentLabel.classList.add('correct');
                    this.score++;
                } else {
                    parentLabel.classList.add('incorrect');
                    // Highlight the correct answer
                    groupRadios.forEach(r => {
                        if (r.value === r.getAttribute('data-correct')) {
                            const correctLabelId = r.getAttribute('data-label-id');
                            this.shadowRoot.getElementById(correctLabelId).classList.add('correct-highlight');
                        }
                    });
                }

                this.answeredCount++;
                this._updateProgress();
                this._checkCompletion();
            });
        });
    }

    _updateProgress() {
        const display = this.shadowRoot.querySelector('.progress-info');
        if (display) {
            display.textContent = `${this.answeredCount} / ${this.totalQuestions} Answered`;
        }
    }

    _checkCompletion() {
        if (this.answeredCount === this.totalQuestions && this.totalQuestions > 0) {
            const footer = this.shadowRoot.getElementById('footer-actions');
            if (footer) footer.style.display = 'flex';
        }
    }

    _isLastInstance() {
        const all = TjListening._instances;
        return all.length > 1 && all[all.length - 1] === this;
    }

    _getCombinedScore() {
        const all = TjListening._instances;
        let totalScore = 0, totalQuestions = 0, allDone = true;
        all.forEach(inst => {
            totalScore += inst.score;
            totalQuestions += inst.totalQuestions;
            if (!inst.isCompleted) allDone = false;
        });
        return { totalScore, totalQuestions, allDone, count: all.length };
    }

    renderScoreScreen() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100) || 0;
        let emoji = '🎉';
        if (percentage < 50) emoji = '💪';
        else if (percentage < 80) emoji = '👍';

        // Combined score for last instance
        let combinedHtml = '';
        if (this._isLastInstance()) {
            const combined = this._getCombinedScore();
            if (combined.allDone) {
                const combinedPct = Math.round((combined.totalScore / combined.totalQuestions) * 100) || 0;
                let combinedEmoji = '🏆';
                if (combinedPct < 50) combinedEmoji = '💪';
                else if (combinedPct < 80) combinedEmoji = '⭐';
                combinedHtml = `
                    <div class="combined-score">
                        <div class="combined-header">${combinedEmoji} Combined Score — All ${combined.count} Lessons</div>
                        <div class="combined-stats">
                            <div class="combined-value">${combined.totalScore} / ${combined.totalQuestions}</div>
                            <div class="combined-percent">${combinedPct}%</div>
                        </div>
                        <div class="combined-bar-track">
                            <div class="combined-bar-fill" style="width: ${combinedPct}%"></div>
                        </div>
                    </div>
                `;
            } else {
                const done = TjListening._instances.filter(i => i.isCompleted).length;
                combinedHtml = `
                    <div class="combined-score combined-pending">
                        <div class="combined-header">📋 Lesson Progress</div>
                        <p class="combined-note">${done} of ${combined.count} lessons completed. Finish all to see your combined score.</p>
                    </div>
                `;
            }
        }

        const isLast = this._isLastInstance();

        const html = `
  <style>${this.getBaseStyles()}</style>
  <div class="container score-screen">
    <div class="score-circle">
        <div class="score-value">${this.score}/${this.totalQuestions}</div>
        <div class="score-percent">${percentage}%</div>
    </div>
    <h2>${emoji} ${percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}</h2>
    <p>You completed the "${this.lessonData.title || 'Listening Lesson'}" activity.</p>
    <div class="score-actions">
        <button class="role-btn" id="restart-btn">Try Again</button>
        ${isLast ? `<button class="report-btn" id="report-btn">📄 See Report Card</button>` : ''}
    </div>
    ${combinedHtml}
  </div>

  ${isLast ? `
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
  ` : ''}
`;

        this.shadowRoot.innerHTML = html;
        this.scrollIntoView({ behavior: 'smooth', block: 'start' });

        this.shadowRoot.getElementById('restart-btn').addEventListener('click', () => {
            this.score = 0;
            this.answeredCount = 0;
            this.isCompleted = false;
            this.currentPhase = 0;
            this.render();
        });

        if (isLast) {
            this.shadowRoot.getElementById('report-btn').addEventListener('click', () => {
                this._showReportOverlay();
            });

            this.shadowRoot.getElementById('generate-btn').addEventListener('click', () => {
                this._generateReport();
            });

            this.shadowRoot.getElementById('cancel-btn').addEventListener('click', () => {
                this.shadowRoot.getElementById('report-overlay').style.display = 'none';
            });

            this.shadowRoot.getElementById('report-overlay').addEventListener('click', (e) => {
                if (e.target.id === 'report-overlay') {
                    this.shadowRoot.getElementById('report-overlay').style.display = 'none';
                }
            });
        }
    }

    _showReportOverlay() {
        const overlay = this.shadowRoot.getElementById('report-overlay');
        overlay.style.display = 'flex';

        // Pre-fill and re-generate if already entered
        if (this.studentInfo.nickname) {
            const nicknameInput = this.shadowRoot.getElementById('nickname-input');
            const numberInput = this.shadowRoot.getElementById('number-input');
            if (nicknameInput) nicknameInput.value = this.studentInfo.nickname;
            if (numberInput) numberInput.value = this.studentInfo.number;
            this._generateReport();
        } else {
            const initialForm = this.shadowRoot.getElementById('initial-form');
            const reportArea = this.shadowRoot.getElementById('report-area');
            if (initialForm) initialForm.style.display = 'block';
            if (reportArea) reportArea.style.display = 'none';
        }
    }

    _generateReport() {
        const nicknameInput = this.shadowRoot.getElementById('nickname-input');
        const numberInput = this.shadowRoot.getElementById('number-input');
        const nickname = nicknameInput ? nicknameInput.value.trim() : this.studentInfo.nickname;
        const number = numberInput ? numberInput.value.trim() : this.studentInfo.number;

        if (!nickname || !number) {
            alert('Please enter both nickname and student number.');
            return;
        }

        this.studentInfo = { nickname, number };

        const combined = this._getCombinedScore();
        const combinedPct = Math.round((combined.totalScore / combined.totalQuestions) * 100) || 0;
        const timestamp = new Date().toLocaleString();

        let combinedEmoji = '🏆';
        if (combinedPct < 50) combinedEmoji = '💪';
        else if (combinedPct < 80) combinedEmoji = '⭐';

        const reportHtml = `
            <div class="rc-header">
                <div class="rc-icon">📄</div>
                <div class="rc-title">Report Card</div>
                <div class="rc-activity">Listening — All ${combined.count} Lessons</div>
            </div>
            <div class="rc-student">
                <span class="rc-label">Student</span>
                <span class="rc-value">${nickname} <span class="rc-number">(${number})</span></span>
            </div>
            <div class="rc-score-row">
                <div class="rc-score-circle">
                    <div class="rc-score-val">${combined.totalScore}/${combined.totalQuestions}</div>
                    <div class="rc-score-pct">${combinedPct}%</div>
                </div>
                <div class="rc-score-label">${combinedEmoji} ${combinedPct >= 80 ? 'Excellent!' : combinedPct >= 50 ? 'Good effort!' : 'Keep practicing!'}</div>
            </div>
            <div class="rc-bar-track" style="margin: 0 0 16px 0;"><div class="rc-bar-fill" style="width:${combinedPct}%"></div></div>
            <div class="rc-details">
                <div class="rc-detail-row"><span>Total Correct</span><span>${combined.totalScore} / ${combined.totalQuestions}</span></div>
                <div class="rc-detail-row"><span>Completed On</span><span>${timestamp}</span></div>
            </div>
            <div class="rc-actions">
                <button class="rc-close-btn" id="rc-close-btn">↩ Return to Activity</button>
            </div>
        `;

        const initialForm = this.shadowRoot.getElementById('initial-form');
        const reportArea = this.shadowRoot.getElementById('report-area');
        if (initialForm) initialForm.style.display = 'none';
        if (reportArea) {
            reportArea.style.display = 'block';
            reportArea.innerHTML = reportHtml;
        }

        this.shadowRoot.getElementById('rc-close-btn').addEventListener('click', () => {
            this.shadowRoot.getElementById('report-overlay').style.display = 'none';
        });
    }

    // ─── TTS LOGIC ─────────────────────────────────────────

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

    _playTTS(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const lang = this._getLang();
        utterance.lang = lang;
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        let voice = voices.find(v => v.name === this.selectedVoiceName);
        if (!voice) {
            voice = this._getBestVoice(lang);
        }

        if (voice) utterance.voice = voice;

        utterance.onstart = () => { this.isPlaying = true; };
        utterance.onend = () => { this.isPlaying = false; };

        window.speechSynthesis.speak(utterance);
    }

    _shareAsQuiz() {
        const url = new URL(window.location.href);
        url.searchParams.set('quiz', '1');
        const quizUrl = url.toString();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(quizUrl).then(() => {
                this._showToast('Quiz link copied!');
            }).catch(() => {
                this._showToast(quizUrl, true);
            });
        } else {
            this._showToast(quizUrl, true);
        }
    }

    _showToast(message, isUrl = false) {
        // Remove existing toast
        const existing = this.shadowRoot.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        if (isUrl) {
            toast.innerHTML = `<span>Quiz link:</span><input type="text" value="${message}" readonly class="toast-url" />`;
            toast.querySelector('.toast-url').onclick = function () { this.select(); };
        } else {
            toast.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><span>${message}</span>`;
        }
        this.shadowRoot.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
    }

    _showVoiceOverlay() {
        const overlay = this.shadowRoot.getElementById('voice-overlay');
        overlay.style.display = 'flex';
        this._updateVoiceList();
    }

    _hideVoiceOverlay() {
        const overlay = this.shadowRoot.getElementById('voice-overlay');
        overlay.style.display = 'none';
    }

    _updateVoiceList() {
        const voiceList = this.shadowRoot.getElementById('voice-list');
        if (!voiceList) return;

        const voices = window.speechSynthesis.getVoices();
        const lang = this._getLang();
        const langPrefix = lang.split(/[-_]/)[0].toLowerCase();
        // Always use prefix-based matching so all variants (e.g. en-US, en-GB) appear
        let langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
        const bestVoice = this._getBestVoice(lang);

        voiceList.innerHTML = '';
        langVoices.sort((a, b) => a.name.localeCompare(b.name));

        langVoices.forEach(voice => {
            const btn = document.createElement('button');
            btn.classList.add('voice-option-btn');
            if (this.selectedVoiceName === voice.name || (!this.selectedVoiceName && bestVoice && voice.name === bestVoice.name)) {
                btn.classList.add('active');
            }

            btn.innerHTML = `<span>${voice.name}</span>`;
            if (bestVoice && voice.name === bestVoice.name) {
                btn.innerHTML += `<span class="badge">Best</span>`;
            }

            btn.onclick = () => {
                this.selectedVoiceName = voice.name;
                this._updateVoiceList();
                this._hideVoiceOverlay();
            };
            voiceList.appendChild(btn);
        });
    }

    // ─── STYLES ────────────────────────────────────────────

    getBaseStyles() {
        return `
      :host { display: block; font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; margin-bottom: 2rem; }
      .container { border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }

      /* Header */
      .header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; margin-bottom: 10px; padding-bottom: 10px; }
      .header-info h2 { margin: 0; color: #1e293b; }
      .phase-badge { font-size: 0.8em; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 4px; }
      .header-controls { display: flex; align-items: center; gap: 12px; }
      .progress-info { background: #f1f5f9; padding: 6px 14px; border-radius: 12px; font-size: 0.9em; font-weight: 600; color: #64748b; white-space: nowrap; }
      .icon-btn { background: none; border: 1px solid #e2e8f0; padding: 8px; border-radius: 8px; cursor: pointer; color: #475569; transition: all 0.2s; }
      .icon-btn:hover { background-color: #f1f5f9; color: #2563eb; border-color: #2563eb; }

      /* Phase Progress Dots */
      .phase-dots { display: flex; align-items: center; justify-content: center; gap: 0; margin: 20px 0; }
      .phase-dot-group { display: flex; flex-direction: column; align-items: center; gap: 6px; }
      .phase-dot { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85em; color: #94a3b8; transition: all 0.3s; }
      .phase-dot-group.active .phase-dot { background: #2563eb; border-color: #2563eb; color: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15); }
      .phase-dot-group.completed .phase-dot { background: #dcfce7; border-color: #22c55e; color: #166534; }
      .phase-dot-label { font-size: 0.7em; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
      .phase-dot-group.active .phase-dot-label { color: #2563eb; }
      .phase-dot-group.completed .phase-dot-label { color: #22c55e; }
      .phase-dot-line { width: 48px; height: 2px; background: #e2e8f0; margin: 0 4px; margin-bottom: 20px; }

      /* Phase Navigation */
      .phase-nav { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
      .nav-btn { display: flex; align-items: center; gap: 6px; padding: 10px 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; color: #475569; transition: all 0.2s; font-size: 0.95em; }
      .nav-btn:hover:not([disabled]) { background-color: #f1f5f9; border-color: #cbd5e1; }
      .nav-btn:disabled { opacity: 0.4; cursor: default; }
      .nav-btn-primary { background: #2563eb; color: white; border-color: #2563eb; }
      .nav-btn-primary:hover { background: #1d4ed8; }

      /* Intro Phase */
      .intro-section { text-align: center; }
      .context-card { display: flex; align-items: center; gap: 10px; background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95em; text-align: left; }
      .context-card svg { flex-shrink: 0; color: #0284c7; }
      .intro-text { font-size: 1.1em; line-height: 1.7; color: #334155; margin-bottom: 24px; padding: 0 8px; }
      .intro-text p { margin: 0; }

      .tts-play-btn { display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border: none; padding: 14px 28px; border-radius: 12px; font-size: 1em; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
      .tts-play-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4); }
      .tts-play-btn:active { transform: translateY(0); }

      /* Audio Player */
      .audio-player { margin: 16px 0; display: flex; justify-content: center; }
      .audio-el { width: 100%; max-width: 500px; border-radius: 8px; }

      /* Vocab Phase */
      .vocab-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
      .vocab-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; transition: all 0.2s; }
      .vocab-card:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
      .vocab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .vocab-word { margin: 0; font-size: 1.15em; color: #1e293b; }
      .vocab-definition { color: #475569; margin: 0 0 8px 0; line-height: 1.5; }
      .vocab-example { color: #64748b; font-style: italic; margin: 0; font-size: 0.9em; line-height: 1.5; }

      /* Listening Phase */
      .listening-section { }
      .transcript-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0; overflow: hidden; }
      .transcript-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
      .transcript-label { font-weight: 600; color: #475569; font-size: 0.9em; }
      .transcript-toggle { background: none; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 12px; font-size: 0.85em; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; }
      .transcript-toggle:hover { background: #f1f5f9; }
      .transcript-body { padding: 0 16px 16px 16px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      .transcript-line { margin: 0 0 8px 0; color: #334155; line-height: 1.6; font-size: 0.95em; }
      .transcript-line:last-child { margin-bottom: 0; }

      /* Shared: Instruction Banner */
      .instruction-banner { display: flex; align-items: center; gap: 8px; background: #f5f3ff; color: #5b21b6; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 0.9em; font-weight: 500; border: 1px solid #ddd6fe; }
      .instruction-banner svg { flex-shrink: 0; }

      /* Shared: Section Title */
      .section-title { font-size: 1.1em; font-weight: bold; color: #0f172a; margin: 24px 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }

      /* Shared: TTS Button */
      .tts-btn { display: flex; align-items: center; gap: 6px; background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; flex-shrink: 0; }
      .tts-btn:hover { background: #1d4ed8; }
      .tts-btn svg { width: 16px; height: 16px; }

      /* MC Questions */
      .question-card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 16px; border-radius: 6px; }
      .question-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 10px; }
      .question-text { margin: 0; color: #1e293b; line-height: 1.4; }
      .options-group { display: flex; flex-direction: column; gap: 8px; }
      .mc-option { display: flex; align-items: center; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer; transition: all 0.2s; background-color: white; }
      .mc-option:hover:not(.correct):not(.incorrect):not(.correct-highlight) { background-color: #f1f5f9; }
      .mc-option input { margin-right: 12px; cursor: pointer; }
      .mc-option.correct { background-color: #dcfce7; border-color: #22c55e; color: #166534; font-weight: bold; }
      .mc-option.correct-highlight { border: 2px dashed #22c55e; background-color: #f0fdf4; }
      .mc-option.incorrect { background-color: #fee2e2; border-color: #ef4444; color: #991b1b; }

      /* Score Screen */
      .score-screen { text-align: center; padding: 40px 24px; }
  .score-circle { width: 150px; height: 150px; border-radius: 50%; background: #f1f5f9; border: 8px solid #2563eb; margin: 0 auto 24px auto; display: flex; flex-direction: column; justify-content: center; align-items: center; }
  .score-value { font-size: 2em; font-weight: 800; color: #1e293b; }
  .score-percent { font-size: 1.2em; font-weight: 600; color: #2563eb; }
  .score-actions { display: flex; flex-direction: column; gap: 12px; align-items: center; margin-top: 8px; }
  .role-btn { padding: 12px 28px; font-size: 1em; font-weight: bold; cursor: pointer; background-color: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 8px; transition: all 0.2s; }
  .role-btn:hover { background-color: #e2e8f0; border-color: #94a3b8; }
  .report-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 1em; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .report-btn:hover { background: #1d4ed8; }
  .share-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #475569; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9em; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .share-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

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

      /* Footer Actions */
      .footer-actions { margin-top: 30px; display: none; justify-content: center; padding-top: 20px; border-top: 1px solid #f1f5f9; }
      .complete-btn { background-color: #2563eb; color: white; border: none; padding: 12px 32px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1.1em; transition: background 0.2s; }
      .complete-btn:hover { background-color: #1d4ed8; }

      .role-btn { padding: 16px; font-size: 16px; font-weight: bold; cursor: pointer; background-color: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 8px; transition: all 0.2s; }
      .role-btn:hover { background-color: #e2e8f0; border-color: #94a3b8; }

      .score-actions { display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
      .share-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; font-size: 15px; font-weight: 600; cursor: pointer; background: #2563eb; color: white; border: none; border-radius: 8px; transition: all 0.2s; }
      .share-btn:hover { background: #1d4ed8; }

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

      /* Toast notification */
      .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1e293b; color: white; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-size: 0.9em; font-weight: 600; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); z-index: 2000; animation: toastIn 0.3s ease; }
      .toast-url { background: #334155; border: none; color: white; padding: 6px 10px; border-radius: 6px; font-size: 0.85em; width: 260px; max-width: 60vw; }
      @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

      .empty-state { color: #94a3b8; font-style: italic; }

      /* Voice Overlay */
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

      /* Responsive */
      @media (max-width: 600px) {
        .container { padding: 16px; }
        .vocab-grid { grid-template-columns: 1fr; }
        .phase-dots { gap: 0; }
        .phase-dot-line { width: 24px; }
        .phase-dot-label { font-size: 0.6em; }
        .nav-btn { padding: 8px 14px; font-size: 0.85em; }
      }
    `;
    }
}

customElements.define('tj-listening', TjListening);
