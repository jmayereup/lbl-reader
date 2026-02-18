class TjInfoGap extends HTMLElement {
    // Static registry of all instances on the page
    static _instances = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activityData = null;
        this.currentPlayerId = null;
        this.score = 0;
        this.answeredCount = 0;
        this.totalQuestions = 0;
        this.isCompleted = false;

        // Student info for report card
        this.studentInfo = { nickname: '', number: '' };

        // TTS State
        this.isSinglePlayer = false;
        this.selectedVoiceName = null;
        this.isPlaying = false;

        // Register this instance
        TjInfoGap._instances.push(this);

        // Use addEventListener so multiple instances don't clobber each other
        if (window.speechSynthesis) {
            window.speechSynthesis.addEventListener('voiceschanged', () => this._updateVoiceList());
        }

        // Recording state
        this.recordedBlobs = new Map(); // questionId -> Blob
        this.mediaRecorder = null;
        this.isRecordingId = null; // null or questionId
        this.recordingStartTime = 0;
        this.isPlayingRecordingId = null; // null or questionId
    }

    connectedCallback() {
        const rawJson = this.textContent.trim();
        this.textContent = '';

        try {
            this.activityData = JSON.parse(rawJson);
        } catch (error) {
            this.shadowRoot.innerHTML = `<p style="color: red;">Error parsing JSON: ${error.message}</p>`;
            return;
        }

        this.render();
    }

    render() {
        if (this.currentPlayerId === null) {
            this.renderSelectionScreen();
        } else if (this.isCompleted) {
            this.renderScoreScreen();
        } else {
            this.renderGameScreen();
        }
    }

    renderSelectionScreen() {
        const playerCount = this.activityData.player_count;
        let html = `
      <style>${this.getBaseStyles()}</style>
      <div class="container">
        <h2>${this.activityData.topic}</h2>
        <p class="scenario">${this.activityData.scenario_description}</p>
        
        <div class="mode-selection">
            <p><strong>Step 1: Choose Game Mode</strong></p>
            <div class="mode-buttons">
                <button class="mode-btn ${!this.isSinglePlayer ? 'active' : ''}" id="mode-multi">
                    Collaborative (Multi-device)
                </button>
                <button class="mode-btn ${this.isSinglePlayer ? 'active' : ''}" id="mode-single">
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

        this.shadowRoot.innerHTML = html;

        // Mode listeners
        this.shadowRoot.getElementById('mode-multi').onclick = () => {
            this.isSinglePlayer = false;
            this.render();
        };
        this.shadowRoot.getElementById('mode-single').onclick = () => {
            this.isSinglePlayer = true;
            this.render();
        };

        const container = this.shadowRoot.getElementById('button-container');
        for (let i = 1; i <= playerCount; i++) {
            const btn = document.createElement('button');
            btn.className = 'role-btn';
            btn.textContent = `Player ${i}`;
            btn.onclick = () => {
                this.currentPlayerId = i;
                this.calculateTotalQuestions();
                this.render();
            };
            container.appendChild(btn);
        }
    }

    calculateTotalQuestions() {
        this.totalQuestions = 0;
        this.activityData.blocks.forEach(block => {
            block.questions.forEach(q => {
                if (q.asker_id === this.currentPlayerId || this.isSinglePlayer) {
                    this.totalQuestions++;
                }
            });
        });
    }

    renderGameScreen() {
        const data = this.activityData;
        const playerId = this.currentPlayerId;

        let myTextsHtml = '';
        let myQuestionsHtml = '';
        let partnerQuestionsHtml = '';

        // Parse the blocks to separate what the player reads vs. what they ask
        data.blocks.forEach((block, blockIndex) => {
            // 1. Check if this player holds the text
            if (block.text_holder_id === playerId) {
                myTextsHtml += `<div class="info-card"><p>${block.text}</p></div>`;
            }

            // 2. Separate questions
            block.questions.forEach((q, qIndex) => {
                if (q.asker_id === playerId) {
                    const questionId = `q_${blockIndex}_${qIndex}`;
                    let optionsHtml = q.options.map((opt, optIndex) => `
            <label class="mc-option" id="label_${questionId}_${optIndex}">
              <input type="radio" name="${questionId}" value="${opt}" data-correct="${q.correct_answer}" data-label-id="label_${questionId}_${optIndex}">
              ${opt}
            </label>
          `).join('');

                    let partnerAudioHtml = '';
                    if (this.isSinglePlayer) {
                        partnerAudioHtml = `
                            <button class="tts-btn" data-text="${block.text}" title="Listen to Partner">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                                Info
                            </button>
                        `;
                    }

                    myQuestionsHtml += `
            <div class="question-card">
              <div class="question-header">
                <p class="question-text"><strong>Ask:</strong> "${q.question}"</p>
                ${partnerAudioHtml}
              </div>
              <div class="options-group">
                ${optionsHtml}
              </div>
            </div>
          `;
                } else if (this.isSinglePlayer) {
                    // This is a question the partner (Computer) is asking the human player
                    const questionId = `q_verbal_${blockIndex}_${qIndex}`;
                    partnerQuestionsHtml += `
                        <div class="question-card partner-question" data-qid="${questionId}">
                            <div class="question-header">
                                <p class="question-text"><strong>Partner asks:</strong> (Answer out loud)</p>
                                <button class="tts-btn" data-text="${q.question}" title="Hear Question">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                    </svg>
                                    Listen
                                </button>
                            </div>
                            <div class="recording-controls" id="rec-controls-${questionId}">
                                ${this.renderRecordingButtons(questionId)}
                            </div>
                        </div>
                    `;
                }
            });
        });

        let html = `
      <style>${this.getBaseStyles()}</style>
      <div class="container">
        <div class="header-row">
            <div class="header-info">
                <h2>${data.topic} - Player ${playerId}</h2>
                <div class="mode-badge">${this.isSinglePlayer ? 'Single Player' : 'Collaborative'}</div>
            </div>
            <div class="header-controls">
                ${this.isSinglePlayer ? `
                    <button id="voice-btn" class="icon-btn" title="Choose Voice">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z"/>
                        </svg>
                    </button>
                ` : ''}
                <div class="progress-info">${this.answeredCount} / ${this.totalQuestions} Answered</div>
            </div>
        </div>
        <div class="${this.isSinglePlayer ? 'single-player-layout' : ''}">
            <div class="info-column">
                <div class="section-title">Your partner will ask you questions about this passage.</div>
                ${myTextsHtml || '<p class="empty-state">You have no texts to read. Listen to your partners.</p>'}
            </div>

            ${this.isSinglePlayer && partnerQuestionsHtml ? `
                <div class="partner-column">
                    <div class="section-title">Partner's Questions (For you)</div>
                    <div class="instruction-banner">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                        Listen and record your answer.
                    </div>
                    ${partnerQuestionsHtml}
                </div>
            ` : ''}
        </div>

        <div class="section-title">Your partner has the answer to these questions.</div>
        ${myQuestionsHtml || '<p class="empty-state">You have no questions to ask right now.</p>'}

        <div id="footer-actions" class="footer-actions" style="display: ${this.answeredCount === this.totalQuestions && this.totalQuestions > 0 ? 'flex' : 'none'}">
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

        this.shadowRoot.innerHTML = html;
        this.attachValidationListeners();

        // Voice selection listeners
        if (this.isSinglePlayer) {
            this.shadowRoot.getElementById('voice-btn').onclick = () => this._showVoiceOverlay();
            this.shadowRoot.getElementById('close-voice-btn').onclick = () => this._hideVoiceOverlay();
            this.shadowRoot.getElementById('voice-overlay').onclick = (e) => {
                if (e.target.id === 'voice-overlay') this._hideVoiceOverlay();
            };

            // TTS Play buttons
            this.shadowRoot.querySelectorAll('.tts-btn').forEach(btn => {
                btn.onclick = () => this._playTTS(btn.getAttribute('data-text'));
            });
        }

        const completeBtn = this.shadowRoot.getElementById('complete-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                this.isCompleted = true;
                this.render();
            });
        }
    }

    _isLastInstance() {
        const all = TjInfoGap._instances;
        return all.length > 1 && all[all.length - 1] === this;
    }

    _getCombinedScore() {
        const all = TjInfoGap._instances;
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
                        <div class="combined-header">${combinedEmoji} Combined Score — All ${combined.count} Activities</div>
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
                const done = TjInfoGap._instances.filter(i => i.isCompleted).length;
                combinedHtml = `
                    <div class="combined-score combined-pending">
                        <div class="combined-header">📋 Activity Progress</div>
                        <p class="combined-note">${done} of ${combined.count} activities completed. Finish all to see your combined score.</p>
                    </div>
                `;
            }
        }

        const isLast = this._isLastInstance();

        let html = `
      <style>${this.getBaseStyles()}</style>
      <div class="container score-screen">
        <div class="score-circle">
            <div class="score-value">${this.score}/${this.totalQuestions}</div>
            <div class="score-percent">${percentage}%</div>
        </div>
        <h2>${emoji} ${percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}</h2>
        <p>You completed the "${this.activityData.topic}" activity as Player ${this.currentPlayerId}.</p>
        <div class="score-actions">
            <button class="role-btn" id="restart-btn">Try Again / Switch Player</button>
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
            this.currentPlayerId = null;
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

        // Pre-fill if already entered
        if (this.studentInfo.nickname) {
            const nicknameInput = this.shadowRoot.getElementById('nickname-input');
            const numberInput = this.shadowRoot.getElementById('number-input');
            if (nicknameInput) nicknameInput.value = this.studentInfo.nickname;
            if (numberInput) numberInput.value = this.studentInfo.number;
            // Re-generate report immediately
            this._generateReport();
        } else {
            // Show initial form if no info
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
                <div class="rc-activity">Info Gap — All ${combined.count} Activities</div>
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

    attachValidationListeners() {
        const radios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const selectedValue = e.target.value;
                const correctAnswer = e.target.getAttribute('data-correct');
                const labelId = e.target.getAttribute('data-label-id');
                const parentLabel = this.shadowRoot.getElementById(labelId);

                // Find all labels in this specific question group to reset their styling
                const groupName = e.target.name;
                const groupRadios = this.shadowRoot.querySelectorAll(`input[name="${groupName}"]`);

                // One attempt limit: disable all radios in this group immediately
                groupRadios.forEach(r => {
                    r.disabled = true;
                });

                if (selectedValue === correctAnswer) {
                    parentLabel.classList.add('correct');
                    this.score++;
                } else {
                    parentLabel.classList.add('incorrect');
                    // Find and highlight the correct answer
                    groupRadios.forEach(r => {
                        if (r.getAttribute('data-correct') === r.value) {
                            const correctLabelId = r.getAttribute('data-label-id');
                            this.shadowRoot.getElementById(correctLabelId).classList.add('correct-highlight');
                        }
                    });
                }

                this.answeredCount++;
                this.updateProgressDisplay();
                this._checkCompletion();
            });
        });
    }

    renderRecordingButtons(questionId) {
        const isRecording = this.isRecordingId === questionId;
        const hasRecording = this.recordedBlobs.has(questionId);
        const isPlaying = this.isPlayingRecordingId === questionId;

        let html = `
            <div class="btn-group">
                <button class="record-btn ${isRecording ? 'recording' : ''} ${hasRecording ? 'has-recording' : ''}" 
                        onclick="this.getRootNode().host.${isRecording ? 'stopRecording' : 'startRecording'}('${questionId}')"
                        title="${isRecording ? 'Stop Recording' : 'Record Answer'}">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        ${isRecording ?
                '<rect x="6" y="6" width="12" height="12"/>' :
                '<path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>'
            }
                    </svg>
                    ${isRecording ? 'Stop' : (hasRecording ? 'Re-record' : 'Record')}
                </button>
        `;

        if (hasRecording && !isRecording) {
            html += `
                <button class="play-recorded-btn ${isPlaying ? 'playing' : ''}" 
                        onclick="this.getRootNode().host.playRecordedAudio('${questionId}')"
                        title="${isPlaying ? 'Stop Playback' : 'Play Recording'}">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        ${isPlaying ?
                    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>' :
                    '<path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>'
                }
                    </svg>
                    ${isPlaying ? 'Playing...' : 'Play'}
                </button>
            `;
        }

        html += '</div>';
        return html;
    }

    async startRecording(id) {
        if (this.isRecordingId !== null) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            let mimeType = 'audio/webm';
            if (typeof MediaRecorder.isTypeSupported === 'function') {
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'audio/mp4';
                    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';
                }
            }

            const options = mimeType ? { mimeType } : {};
            this.mediaRecorder = new MediaRecorder(stream, options);
            this._recordingMimeType = this.mediaRecorder.mimeType || mimeType || 'audio/webm';

            let chunks = [];
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: this._recordingMimeType });
                const duration = Date.now() - this.recordingStartTime;

                if (duration > 600) {
                    const isNew = !this.recordedBlobs.has(id);
                    this.recordedBlobs.set(id, blob);

                    if (isNew) {
                        this.score++;
                        this.answeredCount++;
                        this.updateProgressDisplay();
                        this._checkCompletion();
                    }
                }

                stream.getTracks().forEach(track => track.stop());
                this.isRecordingId = null;
                this.refreshRecordingUI(id);
            };

            this.recordingStartTime = Date.now();
            this.isRecordingId = id;
            this.mediaRecorder.start(1000);
            this.refreshRecordingUI(id);
        } catch (err) {
            console.error('Error starting recording:', err);
            alert('Could not access microphone. Please check permissions.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
    }

    playRecordedAudio(id) {
        const blob = this.recordedBlobs.get(id);
        if (!blob) return;

        if (this._currentAudio) {
            this._currentAudio.pause();
            this._currentAudio = null;
        }

        if (this.isPlayingRecordingId === id) {
            this.isPlayingRecordingId = null;
            this.refreshRecordingUI(id);
            return;
        }

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        this._currentAudio = audio;
        this.isPlayingRecordingId = id;
        this.refreshRecordingUI(id);

        audio.play();
        audio.onended = () => {
            this.isPlayingRecordingId = null;
            this.refreshRecordingUI(id);
            URL.revokeObjectURL(url);
        };
    }

    refreshRecordingUI(id) {
        const container = this.shadowRoot.getElementById(`rec-controls-${id}`);
        if (container) {
            container.innerHTML = this.renderRecordingButtons(id);
        }
    }

    _checkCompletion() {
        if (this.answeredCount === this.totalQuestions && this.totalQuestions > 0) {
            const footer = this.shadowRoot.getElementById('footer-actions');
            if (footer) footer.style.display = 'flex';
        }
    }

    updateProgressDisplay() {
        const display = this.shadowRoot.querySelector('.progress-info');
        if (display) {
            display.textContent = `${this.answeredCount} / ${this.totalQuestions} Answered`;
        }
    }

    // TTS LOGIC
    _getBestVoice(lang) {
        if (!window.speechSynthesis) return null;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return null;

        const langPrefix = lang.split(/[-_]/)[0].toLowerCase();

        // 1. Filter by language
        let langVoices = voices.filter(v => v.lang.toLowerCase() === lang.toLowerCase());
        if (langVoices.length === 0) {
            langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
        }

        if (langVoices.length === 0) return null;

        // 2. Priority list
        const priorities = ["natural", "google", "premium", "siri"];
        for (const p of priorities) {
            const found = langVoices.find(v => v.name.toLowerCase().includes(p));
            if (found) return found;
        }

        // 3. Fallback
        const nonRobotic = langVoices.find(v => !v.name.toLowerCase().includes("microsoft"));
        return nonRobotic || langVoices[0];
    }

    _playTTS(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const lang = "en-US";
        utterance.lang = lang;

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
        const lang = "en-US";
        const langVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
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
}

customElements.define('tj-info-gap', TjInfoGap);