import stylesText from "./styles.css?inline";
import templateHtml from "./template.html?raw";

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
        this.skippedRecordings = new Set(); // questionId -> skipped
        this.mediaRecorder = null;
        this.isRecordingId = null; // null or questionId
        this.recordingStartTime = 0;
        this.isPlayingRecordingId = null; // null or questionId

        // Initial shadow DOM setup
        this.shadowRoot.innerHTML = `
          <style>${stylesText}</style>
          ${templateHtml}
        `;
    }

    connectedCallback() {
        // Use setTimeout to ensure children (JSON content) are parsed by the browser
        requestAnimationFrame(() => {
            const rawJson = this.textContent.trim();
            this.textContent = '';

            try {
                this.activityData = JSON.parse(rawJson);
                this.render();
            } catch (error) {
                this.shadowRoot.innerHTML = `<p style="color: red;">Error parsing JSON: ${error.message}</p>`;
            }
        });
    }

    render() {
        // Hide all screens initially
        this.shadowRoot.getElementById('selection-screen').style.display = 'none';
        this.shadowRoot.getElementById('game-screen').style.display = 'none';
        this.shadowRoot.getElementById('score-screen').style.display = 'none';

        if (this.currentPlayerId === null) {
            this.renderSelectionScreen();
        } else if (this.isCompleted) {
            this.renderScoreScreen();
        } else {
            this.renderGameScreen();
        }
    }

    renderSelectionScreen() {
        const data = this.activityData;
        const screen = this.shadowRoot.getElementById('selection-screen');
        screen.style.display = 'block';

        this.shadowRoot.getElementById('topic-title').textContent = data.topic;
        this.shadowRoot.getElementById('scenario-desc').textContent = data.scenario_description;

        const modeMulti = this.shadowRoot.getElementById('mode-multi');
        const modeSingle = this.shadowRoot.getElementById('mode-single');

        modeMulti.classList.toggle('active', !this.isSinglePlayer);
        modeSingle.classList.toggle('active', this.isSinglePlayer);

        modeMulti.onclick = () => {
            this.isSinglePlayer = false;
            this.render();
        };
        modeSingle.onclick = () => {
            this.isSinglePlayer = true;
            this.render();
        };

        const container = this.shadowRoot.getElementById('button-container');
        container.innerHTML = '';
        for (let i = 1; i <= data.player_count; i++) {
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
        const screen = this.shadowRoot.getElementById('game-screen');
        screen.style.display = 'block';

        this.shadowRoot.getElementById('game-topic').textContent = `${data.topic} - Player ${playerId}`;
        this.shadowRoot.getElementById('mode-badge').textContent = this.isSinglePlayer ? 'Single Player' : 'Collaborative';
        this.shadowRoot.getElementById('progress-info').textContent = `${this.answeredCount} / ${this.totalQuestions} Answered`;

        const voiceBtn = this.shadowRoot.getElementById('voice-btn');
        if (this.isSinglePlayer) {
            voiceBtn.style.display = 'block';
            voiceBtn.onclick = () => this._showVoiceOverlay();
        } else {
            voiceBtn.style.display = 'none';
        }

        let myTextsHtml = '';
        let myQuestionsHtml = '';
        let partnerQuestionsHtml = '';

        data.blocks.forEach((block, blockIndex) => {
            if (block.text_holder_id === playerId) {
                myTextsHtml += `<div class="info-card"><p>${block.text}</p></div>`;
            }

            block.questions.forEach((q, qIndex) => {
                const questionId = `q_${blockIndex}_${qIndex}`;
                if (q.asker_id === playerId) {
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
                    const verbalId = `q_verbal_${blockIndex}_${qIndex}`;
                    partnerQuestionsHtml += `
                        <div class="question-card partner-question" data-qid="${verbalId}">
                            <div class="question-header">
                                <p class="question-text"><strong>Partner asks:</strong> (Answer out loud)</p>
                                <button class="tts-btn" data-text="${q.question}" title="Hear Question">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                    </svg>
                                    Listen
                                </button>
                            </div>
                            <div class="recording-controls" id="rec-controls-${verbalId}">
                                ${this.renderRecordingButtons(verbalId)}
                            </div>
                        </div>
                    `;
                }
            });
        });

        this.shadowRoot.getElementById('my-texts').innerHTML = myTextsHtml || '<p class="empty-state">You have no texts to read. Listen to your partners.</p>';
        this.shadowRoot.getElementById('my-questions').innerHTML = myQuestionsHtml || '<p class="empty-state">You have no questions to ask right now.</p>';

        const partnerColumn = this.shadowRoot.getElementById('partner-column');
        const layoutContainer = this.shadowRoot.getElementById('layout-container');
        if (this.isSinglePlayer && partnerQuestionsHtml) {
            partnerColumn.style.display = 'block';
            this.shadowRoot.getElementById('partner-questions').innerHTML = partnerQuestionsHtml;
            layoutContainer.classList.add('single-player-layout');
        } else {
            partnerColumn.style.display = 'none';
            layoutContainer.classList.remove('single-player-layout');
        }

        this.shadowRoot.getElementById('footer-actions').style.display = (this.answeredCount === this.totalQuestions && this.totalQuestions > 0) ? 'flex' : 'none';

        // Re-attach listeners because we replaced innerHTML of sub-containers
        this.attachValidationListeners();

        // TTS Buttons
        this.shadowRoot.querySelectorAll('.tts-btn').forEach(btn => {
            btn.onclick = () => this._playTTS(btn.getAttribute('data-text'));
        });

        // Complete btn
        this.shadowRoot.getElementById('complete-btn').onclick = () => {
            this.isCompleted = true;
            this.render();
        };

        // Voice selection overlay listeners
        this.shadowRoot.getElementById('close-voice-btn').onclick = () => this._hideVoiceOverlay();
        this.shadowRoot.getElementById('voice-overlay').onclick = (e) => {
            if (e.target.id === 'voice-overlay') this._hideVoiceOverlay();
        };
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
        const screen = this.shadowRoot.getElementById('score-screen');
        screen.style.display = 'block';

        const percentage = Math.round((this.score / this.totalQuestions) * 100) || 0;
        let emoji = '🎉';
        if (percentage < 50) emoji = '💪';
        else if (percentage < 80) emoji = '👍';

        this.shadowRoot.getElementById('final-score').textContent = `${this.score}/${this.totalQuestions}`;
        this.shadowRoot.getElementById('final-percent').textContent = `${percentage}%`;
        this.shadowRoot.getElementById('score-msg').textContent = `${emoji} ${percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}`;
        this.shadowRoot.getElementById('score-details').textContent = `You completed the "${this.activityData.topic}" activity as Player ${this.currentPlayerId}.`;

        const isLast = this._isLastInstance();
        const reportBtn = this.shadowRoot.getElementById('report-btn');
        if (isLast) {
            reportBtn.style.display = 'inline-flex';
            reportBtn.onclick = () => this._showReportOverlay();
        } else {
            reportBtn.style.display = 'none';
        }

        // Combined score for last instance
        const combinedArea = this.shadowRoot.getElementById('combined-score-area');
        combinedArea.innerHTML = '';
        if (isLast) {
            const combined = this._getCombinedScore();
            if (combined.allDone) {
                const combinedPct = Math.round((combined.totalScore / combined.totalQuestions) * 100) || 0;
                let combinedEmoji = '🏆';
                if (combinedPct < 50) combinedEmoji = '💪';
                else if (combinedPct < 80) combinedEmoji = '⭐';
                combinedArea.innerHTML = `
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
                combinedArea.innerHTML = `
                    <div class="combined-score combined-pending">
                        <div class="combined-header">📋 Activity Progress</div>
                        <p class="combined-note">${done} of ${combined.count} activities completed. Finish all to see your combined score.</p>
                    </div>
                `;
            }
        }

        this.scrollIntoView({ behavior: 'smooth', block: 'start' });

        this.shadowRoot.getElementById('restart-btn').onclick = () => {
            this.score = 0;
            this.answeredCount = 0;
            this.isCompleted = false;
            this.currentPlayerId = null;
            this.render();
        };

        if (isLast) {
            this.shadowRoot.getElementById('generate-btn').onclick = () => this._generateReport();
            this.shadowRoot.getElementById('cancel-btn').onclick = () => {
                this.shadowRoot.getElementById('report-overlay').style.display = 'none';
            };
            this.shadowRoot.getElementById('report-overlay').onclick = (e) => {
                if (e.target.id === 'report-overlay') {
                    this.shadowRoot.getElementById('report-overlay').style.display = 'none';
                }
            };
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
        const isSkipped = this.skippedRecordings.has(questionId);
        const isPlaying = this.isPlayingRecordingId === questionId;

        if (isSkipped) {
            return `
                <div class="btn-group">
                    <span class="skipped-label">Skipped (No Mic)</span>
                </div>
            `;
        }

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

        if (!hasRecording && !isRecording) {
            html += `
                <button class="skip-btn" onclick="this.getRootNode().host.skipRecording('${questionId}')" title="Skip Recording">
                    Skip
                </button>
            `;
        }


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

    skipRecording(id) {
        if (!this.recordedBlobs.has(id) && !this.skippedRecordings.has(id)) {
            this.skippedRecordings.add(id);
            this.answeredCount++;
            this.updateProgressDisplay();
            this._checkCompletion();
            this.refreshRecordingUI(id);
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

}

customElements.define('tj-info-gap', TjInfoGap);