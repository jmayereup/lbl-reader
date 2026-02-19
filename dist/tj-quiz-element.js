const z = {
  submissionUrl: "https://script.google.com/macros/s/AKfycbxDI_qYNK5NOfUCN7iN-1ebmwRapBcDzptYDEPKLdZh_vGuCb-UB6EsSgdEbSFAFuIekw/exec"
  // Replace with your actual submission endpoint
}, C = `<div class="quiz-wrapper" translate="no">
    <div class="container" id="mainContainer">
        <div class="quiz-header">
            <span class="theme-toggle" title="Toggle Light/Dark Mode">
                <span class="light-icon">☀️</span>
                <span class="dark-icon hidden">🌙</span>
            </span>
            <button type="button" id="voice-btn" title="Choose Voice">
                <!-- Speaking Head Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z" />
                </svg>
            </button>
            <h1 id="quizTitle">Interactive Reading</h1>
            <p id="quizDescription">Read the passage, then answer the questions below.</p>
        </div>

        <form id="quizForm">
            <div id="studentInfoSection" class="section-card">
                <div class="section-card-header">Student Information</div>
                <p class="student-instructions instruction">Please enter your Nickname, Homeroom, and Student ID
                    before starting the quiz. / กรุณากรอกชื่อเล่น ห้องเรียน และรหัสนักเรียนของคุณก่อนเริ่มทำแบบทดสอบ
                </p>
                <div class="input-group">
                    <label for="nickname" class="input-label">Nickname</label>
                    <input type="text" id="nickname" name="nickname" class="form-input" placeholder="Jake">
                </div>
                <div class="grid-container" style="margin-top: 1rem;">
                    <div>
                        <label for="homeroom" class="input-label">Homeroom</label>
                        <input type="text" id="homeroom" name="homeroom" class="form-input" placeholder="1/1">
                    </div>
                    <div>
                        <label for="studentId" class="input-label">Student ID</label>
                        <input type="text" id="studentId" name="studentId" class="form-input" placeholder="01">
                    </div>
                </div>
                <div class="prequiz-actions">
                    <button type="button" id="startQuizButton" class="button button-primary mt-4">Start
                        Quiz</button>
                    <p id="studentInfoAlert"></p>
                </div>
            </div>

            <div id="quizContent" class="hidden">
                <div id="resultArea" class="result-area section-card hidden">
                    <div id="resultScore"></div>
                </div>

                <div id="postScoreActions" class="post-score-section hidden">
                    <p id="validationMessage"></p>
                    <div class="post-score-actions">
                        <button type="button" id="sendButton" class="button button-green hidden">
                            Resend Score to Teacher
                        </button>
                        <button type="button" id="tryAgainButton" class="button button-slate">
                            Try Again
                        </button>
                    </div>
                </div>

                <!-- Dynamic sections will be appended here as .section-card elements -->
                <div id="dynamicContent"></div>

                <div id="checkScoreContainer" class="actions-container">
                    <button type="submit" id="checkScoreButton" class="button button-primary">
                        Check My Score
                    </button>
                </div>
            </div>
        </form>
    </div>

    <div class="voice-overlay hidden">
        <div class="voice-card">
            <div class="voice-card-header">
                <h3>Choose Voice</h3>
                <button type="button" class="close-voice-btn">×</button>
            </div>
            <div class="voice-list"></div>
        </div>
    </div>
</div>`, I = ':host{display:block;--bg-light: #f1f5f9;--text-light: #1e293b;--card-bg-light: #ffffff;--card-shadow-light: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);--border-light: #e2e8f0;--input-bg-light: #f8fafc;--input-border-light: #cbd5e1;--subtle-text-light: #475569;--primary-color: #4f46e5;--primary-hover: #4338ca;--primary-text: #ffffff;--green-color: #16a34a;--green-hover: #15803d;--green-light-bg: #dcfce7;--red-color: #ef4444;--red-light-bg: #fee2e2;--yellow-color: #eab308;--slate-color: #64748b;--slate-hover: #475569;--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif}:host(.dark){--bg-light: #0f172a;--text-light: #e2e8f0;--card-bg-light: #1e293b;--card-shadow-light: 0 10px 15px -3px rgba(0, 0, 0, .3), 0 4px 6px -2px rgba(0, 0, 0, .2);--border-light: #334155;--input-bg-light: #334155;--input-border-light: #475569;--subtle-text-light: #87abdd;--green-light-bg: #14532d;--red-light-bg: #7f1d1d}.quiz-wrapper *{box-sizing:border-box}.quiz-wrapper{font-family:var(--font-sans);background-color:var(--bg-light);color:var(--text-light);line-height:1.6;transition:background-color .3s,color .3s;padding:1rem 0}.quiz-wrapper p{font-size:1em;margin-bottom:1rem}.container{max-width:800px;margin-left:auto;margin-right:auto;padding:0 1rem}.quiz-header{background-color:var(--primary-color);color:var(--primary-text);padding:1.5rem;position:relative;border-radius:.75rem;margin-bottom:1.25rem;box-shadow:var(--card-shadow-light)}.quiz-header h1{font-size:1.5em;font-weight:700;margin:0}.quiz-header p{margin-top:.5rem;color:#e0e7ff;opacity:.9;font-size:.9375em}.theme-toggle{position:absolute;top:1rem;right:1rem;cursor:pointer;width:2.5rem;height:2.5rem;padding:0;border-radius:9999px;background-color:#ffffff1a;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem;transition:background-color .2s,transform .2s}.theme-toggle:hover,#voice-btn:hover{background-color:#fff3;transform:scale(1.05)}form{padding:0}@media (min-width: 640px){form{padding:2rem}}fieldset{border:none;padding:0;margin:0;margin-bottom:2rem}.legend-container{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-light);padding-bottom:.5rem;margin-bottom:1rem;width:100%}legend{font-size:1.125em;font-weight:600;color:var(--text-light);border-bottom:none;padding-bottom:0;margin-bottom:0;width:auto}fieldset>legend{display:block;font-size:1.125em;font-weight:700;margin-bottom:.5rem;padding-bottom:.5rem;color:var(--text-light);border-bottom:1px solid var(--border-light)}#vocabSection .vocab-grid-table,#clozeSection .cloze-word-bank,#clozeSection .cloze-text{margin-top:1rem}.reading-instructions{font-size:.9em;font-style:italic;margin-bottom:1rem;margin-top:1rem}.instruction{font-size:.9em;color:var(--subtle-text-light);font-style:italic;margin-top:.25rem;margin-bottom:1rem;line-height:1.45}.audio-toggle{cursor:pointer;padding:.75rem;border-radius:9999px;background-color:var(--primary-color);border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;color:var(--primary-text);transition:background-color .2s}.audio-toggle:hover{background-color:var(--primary-hover)}.audio-toggle svg{width:1.5em;height:1.5em}.passage-audio-toggle{cursor:pointer;padding:.5rem .6rem;border-radius:.5rem;background-color:#fff;border:1px solid var(--border-light);color:var(--text-light);display:inline-flex;align-items:center;justify-content:center;margin-left:.5rem;box-shadow:0 2px 6px #0000000f;transition:transform .12s,box-shadow .12s}.passage-audio-toggle:hover{transform:translateY(-2px);box-shadow:0 6px 16px #0000001f}.passage-audio-toggle .play-icon,.passage-audio-toggle .pause-icon{width:1.1rem;height:1.1rem}.passage-wrapper{padding:1rem 1.25rem;border-radius:.5rem;background:transparent;margin-bottom:1rem}.passage-wrapper{position:relative}.passage-header{display:flex;align-items:center;gap:.5rem}.passage-text{margin-top:.75rem}.listening-hidden{position:absolute!important;clip:rect(1px,1px,1px,1px);clip-path:inset(50%);height:1px;width:1px;overflow:hidden;white-space:nowrap}.passage-content{background-color:var(--input-bg-light);border-radius:.5rem;padding:1.5rem;margin-bottom:1.5rem;border:1px solid var(--border-light);line-height:1.7}.section-card{background-color:var(--card-bg-light);border:1px solid var(--border-light);border-radius:.75rem;padding:1.5rem;margin-bottom:1.25rem;box-shadow:var(--card-shadow-light)}.section-card-header{font-size:1.05em;font-weight:600;color:var(--text-light);margin:0 0 .5rem;border-bottom:1px solid var(--border-light);padding-bottom:.4rem}.section-card-description{font-size:.95em;color:var(--subtle-text-light);line-height:1.6;margin-bottom:.75rem}.section-card-content{display:block}.instruction-card .section-card-content{margin-top:.25rem}.instruction-questions{margin-top:.75rem}.question-block{padding-top:1.5rem;border-top:1px solid var(--border-light)}.question-block:first-of-type{border-top:none;padding-top:0}.question-block p.question-text{font-weight:600;margin-bottom:1rem;font-size:1em}.options-group{display:flex;flex-direction:column;gap:.5rem}.option-label{display:flex;align-items:center;padding:.5rem .75rem;background-color:var(--input-bg-light);border-radius:.5rem;cursor:pointer;transition:background-color .18s,border-color .18s;border:1px solid transparent;font-size:.95em}.option-label:hover{background-color:#eef4ff}:host(.dark) .option-label:hover{background-color:#2b3440}.option-label.correct{background-color:var(--green-light-bg);border-color:var(--green-color)}.option-label.incorrect{background-color:var(--red-light-bg);border-color:var(--red-color)}.feedback-icon{margin-left:auto;font-size:1.25em}.explanation{margin-top:1rem;padding:1rem;background-color:var(--input-bg-light);border-radius:.5rem;border-left:4px solid var(--primary-color);font-size:.9em;line-height:1.5}.explanation-content strong{color:var(--primary-color)}.form-radio{width:1.125em;height:1.125em;margin-right:.75em;accent-color:var(--primary-color);flex-shrink:0}.form-radio:disabled{cursor:not-allowed}.form-input{width:100%;padding:.75rem;background-color:var(--input-bg-light);border:1px solid var(--input-border-light);border-radius:.5rem;color:var(--text-light);font-size:1em}.form-input.invalid{border-color:var(--red-color)}.form-input:disabled{background-color:#e2e8f0;cursor:not-allowed}:host(.dark) .form-input:disabled{background-color:#334155}.input-label{display:block;font-size:.875em;font-weight:500;color:var(--subtle-text-light);margin-bottom:.25rem}.grid-container{display:grid;grid-template-columns:1fr;gap:1rem}@media (min-width: 768px){.grid-container{grid-template-columns:repeat(2,1fr)}}.actions-container{padding-top:1.5rem;border-top:1px solid var(--border-light);margin-top:2rem}.button{width:100%;font-weight:600;padding:.875rem 1.5rem;border-radius:.5rem;font-size:1em;transition:all .2s ease-in-out;border:none;cursor:pointer}.button:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 4px 10px #0000001a}.button:disabled{background-color:#94a3b8;cursor:not-allowed;transform:none;box-shadow:none}.button-primary{background-color:var(--primary-color);color:var(--primary-text)}.button-primary:hover:not(:disabled){background-color:var(--primary-hover)}.button-green{background-color:var(--green-color);color:var(--primary-text)}.button-green:hover:not(:disabled){background-color:var(--green-hover)}.button-slate{background-color:var(--slate-color);color:var(--primary-text)}.button-slate:hover:not(:disabled){background-color:var(--slate-hover)}.post-score-actions{display:flex;flex-direction:column;gap:1rem}@media (min-width: 768px){.post-score-actions{flex-direction:row-reverse}}.prequiz-actions{margin-top:1.5rem;display:flex;flex-direction:column;gap:.75rem;align-items:flex-start}#studentInfoAlert{font-size:.9em;font-weight:500;min-height:1.5rem}#studentInfoAlert.success{color:var(--green-color)}#studentInfoAlert.error{color:var(--red-color)}.result-area{padding:2rem;text-align:center;border-bottom:1px solid var(--border-light);margin-bottom:2rem}.result-area h2{font-size:1.25em;font-weight:600;margin:0}#resultScore{text-align:center;margin:1.5rem 0}.score-main{font-size:3em;font-weight:700;line-height:1;margin-bottom:.5rem}.score-percentage{font-size:1.5em;font-weight:600;opacity:.8;margin-bottom:1rem}.score-breakdown{display:flex;justify-content:center;gap:2rem;margin-top:1rem}.score-section{display:flex;flex-direction:column;align-items:center;gap:.25rem}.score-label{font-size:.9em;font-weight:500;opacity:.7;text-transform:uppercase;letter-spacing:.05em}.score-value{font-size:1.25em;font-weight:600}@media (max-width: 768px){.score-main{font-size:2.5em}.score-percentage{font-size:1.25em}.score-breakdown{flex-direction:column;gap:1rem}.score-section{flex-direction:row;justify-content:space-between;align-items:center;padding:.5rem 1rem;background-color:var(--input-bg-light);border-radius:.5rem}}#resultScore.high .score-main{color:var(--green-color)}#resultScore.medium .score-main{color:var(--yellow-color)}#resultScore.low .score-main{color:var(--red-color)}#validationMessage{text-align:center;margin-bottom:1rem;font-weight:500;min-height:1.5rem;font-size:.9em}#validationMessage.success{color:var(--green-color)}#validationMessage.error{color:var(--red-color)}.hidden{display:none!important}.vocab-word-bank{background-color:var(--input-bg-light);border:1px solid var(--border-light);border-radius:.5rem;padding:1rem;margin-bottom:1.25rem}:host(.dark) .vocab-word-bank{background-color:var(--input-bg-dark)}.vocab-bank-title{font-weight:600;margin-bottom:.75rem;color:var(--subtle-text-light);font-size:.9em;text-transform:uppercase;letter-spacing:.05em}.vocab-bank-items{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}.vocab-bank-item{background-color:var(--card-bg-light);color:var(--text-light);padding:.45rem .75rem;border-radius:.375rem;border:1px solid var(--border-light);font-size:.9em;font-weight:600;cursor:default;-webkit-user-select:none;user-select:none;box-shadow:0 1px 2px #0000000d}.vocab-matching-container{display:flex;flex-direction:column;gap:.5rem}.vocab-matching-row{display:flex;align-items:center;gap:1rem;padding:.5rem .75rem;border-radius:.5rem;transition:background-color .2s}.vocab-matching-input{width:2.5rem;height:2.5rem;padding:0;text-align:center;font-weight:700;font-size:1.125rem;line-height:normal;border:2px solid var(--input-border-light);border-radius:.4rem;background-color:var(--card-bg-light);color:var(--text-light);text-transform:uppercase;flex-shrink:0;box-sizing:border-box}:host(.dark) .vocab-matching-input{background-color:var(--input-bg-light)}.vocab-matching-input:focus{border-color:var(--primary-color);outline:none;box-shadow:0 0 0 3px #4f46e51a}.vocab-matching-input:disabled{background-color:#f1f5f9;cursor:not-allowed}:host(.dark) .vocab-matching-input:disabled{background-color:#1e293b}.vocab-definition-text{flex:1;font-size:1em;color:var(--text-light)}.vocab-matching-row.correct{background-color:var(--green-light-bg)}.vocab-matching-row.incorrect{background-color:var(--red-light-bg)}.vocab-matching-row.correct .vocab-matching-input{border-color:var(--green-color)}.vocab-matching-row.incorrect .vocab-matching-input{border-color:var(--red-color)}.vocab-matching-row .feedback-icon{font-weight:600;font-size:.9em;white-space:nowrap}@media (max-width: 768px){.vocab-def-label{display:inline-block;white-space:normal;max-width:60%}}.cloze-word-bank{background-color:var(--input-bg-light);border:1px solid var(--border-light);border-radius:.5rem;padding:1rem;margin-bottom:1.25rem}:host(.dark) .cloze-word-bank{background-color:var(--input-bg-dark)}.cloze-bank-title{font-weight:600;margin-bottom:.75rem;color:var(--subtle-text-light);font-size:.9em;text-transform:uppercase;letter-spacing:.05em}.cloze-bank-words{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}.cloze-bank-word{background-color:var(--card-bg-light);color:var(--text-light);padding:.45rem .75rem;border-radius:.375rem;border:1px solid var(--border-light);font-size:.9em;font-weight:600;cursor:default;-webkit-user-select:none;user-select:none;box-shadow:0 1px 2px #0000000d}.cloze-text{line-height:1.8;font-size:1.05em;color:var(--text-light)}.cloze-blank{display:inline-block;min-width:6.5ch;max-width:12ch;margin:0 .35rem;padding:.15rem .4rem;border:none;border-bottom:2px solid var(--border-light);background:transparent;font-size:inherit;font-family:inherit;color:var(--text-light);text-align:center;vertical-align:baseline;transition:border-color .18s,background-color .18s}.cloze-blank:focus{outline:none;border-bottom-color:var(--primary-color);background:#4f46e508;border-radius:.25rem}.cloze-blank.correct{border-bottom-color:var(--green-color);background-color:var(--green-light-bg)}.cloze-blank.correct{border-bottom-color:var(--green-color);background-color:var(--green-light-bg);border-radius:.25rem}.cloze-blank.incorrect{border-bottom-color:var(--red-color);background-color:var(--red-light-bg);border-radius:.25rem}.cloze-score{text-align:center;font-weight:600;margin-top:1rem;font-size:1.1em}@media (max-width: 768px){.cloze-bank-words{gap:.375rem}.cloze-bank-word{padding:.375rem .5rem;font-size:.8em}.cloze-blank{min-width:5.5ch}.cloze-text{font-size:1em}.cloze-blank{min-width:80px;padding:.25em .375em}}.vocab-section-header,.cloze-section-header{margin:1.5rem 0 1rem;font-size:1.1em;font-weight:600;color:var(--primary-color);border-bottom:2px solid var(--primary-color);padding-bottom:.5rem}.cloze-section-wrapper{margin-bottom:2rem}.cloze-section-wrapper:last-child{margin-bottom:0}.score-report-card{background-color:var(--card-bg-light);border:2px solid var(--primary-color);border-radius:1rem;padding:2rem;margin:1rem 0;text-align:center;box-shadow:0 4px 20px #4f46e526;position:relative;overflow:hidden}.score-report-card:before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,var(--primary-color),var(--primary-hover))}.result-title{font-size:1.5em;font-weight:800;color:var(--primary-color);margin-bottom:1.5rem;text-transform:uppercase;letter-spacing:.1em}.student-details{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:2rem;font-size:1.1em;border:1px solid var(--border-light);padding:1.25rem;border-radius:.5rem;background-color:var(--input-bg-light);text-align:left}.student-details strong{color:var(--primary-color)}.score-summary{margin-bottom:2rem}.score-main-compact{font-size:2.5em;font-weight:800;color:var(--primary-color);margin-bottom:.25rem}.score-percentage{font-size:1.2em;color:var(--slate-color);font-weight:600}.score-breakdown-compact{display:flex;flex-direction:column;gap:.75rem;max-width:300px;margin:0 auto;padding:1rem;border-top:1px dashed var(--border-light)}.score-section{display:flex;justify-content:space-between;align-items:center;font-weight:600}.score-label{color:var(--subtle-text-light)}.score-value{color:var(--text-light)}.post-score-section{text-align:center;margin:2rem 0}.post-score-actions{display:flex;justify-content:center;gap:1rem;margin-top:1.5rem}#validationMessage.success{display:inline-flex;align-items:center;gap:.5rem;background-color:var(--green-light-bg);color:var(--green-color);padding:.75rem 1.5rem;border-radius:2rem;font-weight:600;font-size:.95rem;margin-bottom:0}#validationMessage.error{color:var(--red-color);background-color:var(--red-light-bg);padding:.75rem 1.5rem;border-radius:2rem;font-weight:600;font-size:.95rem;display:inline-flex;margin-bottom:0}.voice-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#0f172ab3;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:2000}.voice-card{background:var(--card-bg-light);width:90%;max-width:400px;max-height:80vh;border-radius:1.25rem;box-shadow:0 25px 50px -12px #00000040;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--border-light)}.voice-card-header{padding:1.25rem;background:var(--primary-color);color:#fff;display:flex;justify-content:space-between;align-items:center}.voice-card-header h3{margin:0;font-size:1.25rem;font-weight:700}.close-voice-btn{background:#fff3;border:none;color:#fff;width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.5rem;transition:background .2s}.close-voice-btn:hover{background:#ffffff4d}.voice-list{padding:1rem;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:.5rem}.voice-option-btn{padding:.875rem 1rem;background:var(--input-bg-light);border:1px solid var(--border-light);border-radius:.75rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all .2s;color:var(--text-light);font-family:var(--font-sans)}.voice-option-btn:hover{border-color:var(--primary-color);background:#eff6ff}:host(.dark) .voice-option-btn:hover{background:#1e293b}.voice-option-btn.active{background:#eff6ff;border-color:var(--primary-color);color:var(--primary-color);font-weight:600;box-shadow:0 0 0 1px var(--primary-color)}:host(.dark) .voice-option-btn.active{background:#1e293b}.voice-option-btn .badge{background:var(--green-color);color:#fff;padding:.2rem .5rem;border-radius:2rem;font-size:.75rem;font-weight:700;text-transform:uppercase}#voice-btn{position:absolute;top:1rem;right:4rem;cursor:pointer;width:2.5rem;height:2.5rem;padding:0;border-radius:9999px;background-color:#ffffff1a;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;color:#fff;transition:background-color .2s,transform .2s}#voice-btn svg{width:1.25rem;height:1.25rem}';
class A extends HTMLElement {
  static get observedAttributes() {
    return ["submission-url"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.questionBank = [], this.passages = [], this.selectedVoiceName = null, this.isPlayingAll = !1, this.instructions = [], this.questionGroups = [], this.orderedSections = [], this.currentQuestions = [], this.score = 0, this.questionsAnswered = 0, this.questionsToDisplay = 5, this.totalQuestions = 0, this.audioPlayer = null, this.utterance = null, this.audioSrc = "", this.currentAudioButton = null, this.submissionUrl = z.submissionUrl, this.title = "", this.passage = "", this.vocabularySections = [], this.vocabUserChoices = {}, this.vocabScore = 0, this.vocabSubmitted = !1, this.clozeSections = [], this.clozeAnswers = {}, this.clozeScore = 0, this.clozeSubmitted = !1, this.userQuestionAnswers = {}, this.quizUnlocked = !1, this.autoSubmissionInProgress = !1, this.scoreSubmitted = !1, this.ttsPaused = !1;
  }
  attributeChangedCallback(e, t) {
    e === "submission-url" && (this.submissionUrl = t);
  }
  connectedCallback() {
    setTimeout(() => {
      if (this.originalContent = this.textContent, this.hasAttribute("submission-url") && (this.submissionUrl = this.getAttribute("submission-url")), this.loadTemplate(), this.setAttribute("translate", "no"), !this._shouldShowAudioControls()) {
        const e = this.shadowRoot.getElementById("voice-btn");
        e && e.classList.add("hidden");
      }
      window.speechSynthesis && (window.speechSynthesis.onvoiceschanged = () => this._updateVoiceList(), this._updateVoiceList()), this.parseContent(), this.setupEventListeners(), this.generateQuiz(), this.lockQuizContent();
    }, 0);
  }
  loadTemplate() {
    try {
      const e = document.createElement("template");
      e.innerHTML = `<style>${I}</style>${C}`, this.shadowRoot.firstChild && (this.shadowRoot.innerHTML = ""), this.shadowRoot.appendChild(e.content.cloneNode(!0)), console.log("Inlined template applied successfully");
    } catch (e) {
      console.error("Failed to apply inlined template:", e), this.shadowRoot.innerHTML = `
                <div style="padding: 2rem; text-align: center; font-family: Arial, sans-serif; background: #fee2e2; color: #dc2626; border-radius: 0.5rem; margin: 1rem;">
                    <h2>⚠️ Template Load Error</h2>
                    <p>Could not apply inlined template files.</p>
                    <details style="margin-top: 1rem; text-align: left;">
                        <summary style="cursor: pointer; font-weight: bold;">Error Details:</summary>
                        <pre style="background: white; padding: 1rem; border-radius: 0.25rem; margin-top: 0.5rem; overflow: auto;">${e.message}</pre>
                    </details>
                </div>
            `;
    }
  }
  _getBestVoice(e = "en-US") {
    if (!window.speechSynthesis) return null;
    const t = window.speechSynthesis.getVoices();
    if (t.length === 0) return null;
    const o = e.split(/[-_]/)[0].toLowerCase();
    let i = t.filter((n) => n.lang.toLowerCase() === e.toLowerCase());
    if (i.length === 0 && (i = t.filter((n) => n.lang.split(/[-_]/)[0].toLowerCase() === o)), i.length === 0) return null;
    const a = ["natural", "google", "premium", "siri"];
    for (const n of a) {
      const r = i.find((l) => l.name.toLowerCase().includes(n));
      if (r) return r;
    }
    return i.find((n) => !n.name.toLowerCase().includes("microsoft")) || i[0];
  }
  _updateVoiceList() {
    if (!window.speechSynthesis) return;
    const e = window.speechSynthesis.getVoices(), t = this.shadowRoot.querySelector(".voice-list");
    if (!t) return;
    const o = "en-US", i = e.filter((s) => s.lang.split(/[-_]/)[0].toLowerCase() === o.split("-")[0]), a = this._getBestVoice(o);
    t.innerHTML = "", i.sort((s, n) => s.name.localeCompare(n.name)), i.forEach((s) => {
      const n = document.createElement("button");
      n.type = "button", n.classList.add("voice-option-btn"), this.selectedVoiceName === s.name && n.classList.add("active");
      let r = `<span>${s.name}</span>`;
      a && s.name === a.name && (r += '<span class="badge">Best</span>'), n.innerHTML = r, n.onclick = () => {
        this.selectedVoiceName = s.name, this._updateVoiceList(), this._hideVoiceOverlay();
      }, t.appendChild(n);
    });
  }
  _showVoiceOverlay() {
    const e = this.shadowRoot.querySelector(".voice-overlay");
    e && (e.classList.remove("hidden"), this._updateVoiceList());
  }
  _hideVoiceOverlay() {
    const e = this.shadowRoot.querySelector(".voice-overlay");
    e && e.classList.add("hidden");
  }
  _shouldShowAudioControls() {
    const e = navigator.userAgent.toLowerCase();
    return e.includes("instagram") || e.includes("facebook") || e.includes("line") ? !1 : !!window.speechSynthesis;
  }
  parseContent() {
    const e = this.originalContent || this.textContent;
    console.log("Parsing content:", e.substring(0, 200) + "...");
    const t = e.split("---").map((s) => s.trim());
    if (t.length >= 1) {
      const n = t[0].trim().split(`
`).map((r) => r.trim()).filter((r) => r.length > 0);
      n.length > 0 && (this.title = n[0]);
    }
    let o = null, i = null;
    for (let s = 1; s < t.length; s++) {
      const r = t[s].split(`
`);
      if (r.length === 0) continue;
      const m = (r[0] || "").trim().toLowerCase(), d = r.slice(1).join(`
`);
      if (m.startsWith("vocab")) {
        const c = m.match(/vocab(?:-(\d+))?/), u = c && c[1] ? parseInt(c[1]) : null;
        this.parseVocabulary(d, u), this.orderedSections.push({ type: "vocab", data: { vocabCount: u } }), o = "vocab";
      } else if (m.startsWith("cloze")) {
        const c = m.match(/cloze(?:-(\d+))?/), u = c && c[1] ? parseInt(c[1]) : null;
        this.parseCloze(d, u), this.orderedSections.push({ type: "cloze", data: { clozeCount: u, text: d } }), o = "cloze";
      } else if (m.startsWith("instructions")) {
        const c = this.passages.length, { heading: u, body: h } = this.extractHeadingAndBody(d, `Instructions ${this.instructions.length + 1}`);
        this.instructions.push({ sectionId: c, heading: u, body: h }), this.passages.push({ text: h || u, sectionId: c, listening: !1, isInstruction: !0 }), this.orderedSections.push({ type: "instructions", sectionId: c, heading: u, body: h }), i = c, o = "instructions";
      } else if (m.startsWith("questions")) {
        const c = m.match(/questions(?:-(\d+))?/), u = c && c[1] ? parseInt(c[1]) : null, h = this.parseQuestions(d), g = o === "text" || o === "instructions" || o === "questions" && this.orderedSections.length > 0 && this.orderedSections[this.orderedSections.length - 1].tiedToPassage;
        i !== null ? (this.questionGroups.push({ sectionId: i, questions: h, maxQuestions: u }), this.orderedSections.push({ type: "questions", sectionId: i, questions: h, maxQuestions: u, tiedToPassage: g })) : (this.questionGroups.push({ sectionId: null, questions: h, maxQuestions: u }), this.orderedSections.push({ type: "questions", sectionId: null, questions: h, maxQuestions: u, tiedToPassage: !1 })), o = "questions";
      } else
        switch (m) {
          case "text":
          case "text-listening":
            const c = m === "text-listening", u = this.passages.length;
            this.passages.push({ text: d, sectionId: u, listening: c }), this.passage = d, i = u, this.orderedSections.push({ type: "text", sectionId: u, text: d, listening: c }), o = "text";
            break;
          case "audio":
            this.parseAudio(d), this.orderedSections.push({ type: "audio", audioSrc: this.audioSrc }), o = "audio";
            break;
          default:
            o = null;
        }
    }
    this.title && (this.shadowRoot.getElementById("quizTitle").textContent = this.title);
    const a = this.questionGroups.reduce((s, n) => s + (n.questions ? n.questions.length : 0), 0);
    console.log("Parsed:", {
      title: this.title,
      passages: this.passages.length,
      passageLength: this.passage.length,
      vocabularySections: this.vocabularySections.length,
      clozeSections: this.clozeSections.length,
      audioSrc: this.audioSrc,
      questionsCount: a
    });
  }
  parseVocabulary(e, t = null) {
    if (!e) return;
    const o = e.split(/\r?\n/).map((r) => r.trim()).filter(Boolean), i = o.length > 0 ? o.slice() : [e.trim()], a = (r) => {
      const l = {};
      return r.forEach((m) => {
        const d = m.indexOf(":");
        if (d === -1) return;
        const c = m.slice(0, d).trim(), u = m.slice(d + 1).trim().replace(/,$/, "");
        c && u && (l[c] = u);
      }), l;
    };
    let s = a(i);
    if (Object.keys(s).length <= 1 && e.indexOf(",") !== -1) {
      const r = e.split(",").map((l) => l.trim()).filter(Boolean);
      s = a(r);
    }
    let n;
    if (t && Object.keys(s).length > t) {
      const r = Object.entries(s);
      this.shuffleArray(r);
      const l = r.slice(0, t);
      n = Object.fromEntries(l);
    } else
      n = s;
    this.vocabularySections.push({
      vocabulary: n,
      sectionId: this.vocabularySections.length
    }), console.log("Vocabulary section parsed. Words in this section:", Object.keys(n).length, "Max words:", t);
  }
  parseAudio(e) {
    if (!e) return;
    const t = e.match(/audio-src\s*=\s*(.+)/);
    t && (this.audioSrc = t[1].trim());
  }
  parseCloze(e, t = null) {
    if (!e) return;
    const o = e.match(/\*([^*]+)\*/g);
    let i = [];
    o && (i = o.map((a) => a.replace(/\*/g, "")), t && i.length > t && (this.shuffleArray(i), i = i.slice(0, t))), this.clozeSections.push({
      text: e,
      words: i,
      sectionId: this.clozeSections.length
    }), console.log("Cloze section parsed. Total words available:", o ? o.length : 0, "Words to remove:", i.length, "Max blanks:", t);
  }
  parseQuestions(e, t = null) {
    if (!e) return [];
    const o = e.split(`
`).map((s) => s.trim()).filter((s) => s.length > 0);
    let i = null;
    const a = [];
    for (const s of o)
      if (s.startsWith("Q:") || s.startsWith("Q."))
        i && a.push(i), i = {
          q: s.substring(2).trim(),
          o: [],
          a: "",
          e: ""
          // explanation
        };
      else if (s.startsWith("A:") && i) {
        const n = s.substring(2).trim(), r = n.includes("[correct]"), l = n.replace("[correct]", "").trim();
        i.o.push(l), r && (i.a = l);
      } else s.startsWith("E:") && i && (i.e = s.substring(2).trim());
    return i && a.push(i), console.log("Questions parsed. Total questions parsed:", a.length, "Max questions (deferred):", t), a;
  }
  extractHeadingAndBody(e, t = "Instructions") {
    const o = (e || "").split(`
`);
    let i = "";
    const a = [];
    for (const n of o)
      !i && n.trim().length > 0 ? i = n.trim() : a.push(n);
    i || (i = t);
    const s = a.join(`
`).trim();
    return { heading: i, body: s };
  }
  generateVocabMatching() {
    const e = this.shadowRoot.getElementById("vocabSection"), t = this.shadowRoot.getElementById("vocabGrid");
    if (this.vocabularySections.length === 0) {
      e.classList.add("hidden");
      return;
    }
    e.classList.remove("hidden"), t.innerHTML = "", this.vocabScore = 0, this.vocabUserChoices = {}, this.vocabSubmitted = !1, this.vocabularySections.forEach((o, i) => {
      const { vocabulary: a, sectionId: s } = o;
      if (!a) return;
      if (this.vocabularySections.length > 1) {
        const c = document.createElement("div");
        c.className = "vocab-section-header", c.innerHTML = `<h4>Vocabulary Set ${i + 1}</h4>`, t.appendChild(c);
      }
      const n = Object.keys(a), r = Object.values(a);
      this.shuffleArray(r);
      const l = document.createElement("div");
      l.className = "vocab-grid-table";
      const m = document.createElement("div");
      m.className = "vocab-grid-header";
      const d = document.createElement("div");
      if (d.className = "vocab-grid-header-cell", d.textContent = "Word", m.appendChild(d), r.forEach((c) => {
        const u = document.createElement("div");
        u.className = "vocab-grid-header-cell", u.textContent = c, m.appendChild(u);
      }), l.appendChild(m), n.forEach((c, u) => {
        const h = document.createElement("div");
        h.className = "vocab-grid-row";
        const g = document.createElement("div");
        g.className = "vocab-grid-cell vocab-word-cell", g.textContent = c, h.appendChild(g);
        const f = a[c], v = r.filter((b) => b !== f);
        this.shuffleArray(v);
        const p = [f, ...v.slice(0, 3)];
        this.shuffleArray(p), p.forEach((b, S) => {
          const y = document.createElement("div");
          y.className = "vocab-grid-cell vocab-option-cell";
          const x = document.createElement("div");
          x.className = "vocab-radio-container";
          const w = document.createElement("input");
          w.type = "radio", w.name = `vocab-${s}-${u}`, w.value = b, w.id = `vocab-${s}-${u}-${S}`, x.appendChild(w), y.appendChild(x);
          const k = document.createElement("span");
          k.className = "vocab-def-label", k.textContent = b, y.appendChild(k), h.appendChild(y);
        }), l.appendChild(h);
      }), t.appendChild(l), i < this.vocabularySections.length - 1) {
        const c = document.createElement("div");
        c.style.marginBottom = "2rem", t.appendChild(c);
      }
    });
  }
  generateCloze() {
    const e = this.shadowRoot.getElementById("clozeSection"), t = this.shadowRoot.getElementById("clozeContainer");
    if (this.clozeSections.length === 0) {
      e.classList.add("hidden");
      return;
    }
    if (e.classList.remove("hidden"), this.clozeScore = 0, this.clozeAnswers = {}, this.clozeSubmitted = !1, !t) {
      const i = document.createElement("div");
      i.id = "clozeContainer", e.appendChild(i);
    }
    const o = this.shadowRoot.getElementById("clozeContainer");
    o.innerHTML = "", this.clozeSections.forEach((i, a) => {
      const { text: s, words: n, sectionId: r } = i, l = document.createElement("div");
      if (l.className = "cloze-section-wrapper", this.clozeSections.length > 1) {
        const h = document.createElement("h4");
        h.className = "cloze-section-header", h.textContent = `Fill in the Blanks - Section ${a + 1}`, l.appendChild(h);
      }
      const m = document.createElement("div");
      m.className = "cloze-word-bank", m.innerHTML = `
                <div class="cloze-bank-title">Word Bank</div>
                <div class="cloze-bank-words">
                    ${n.map((h) => `<span class="cloze-bank-word">${h}</span>`).join("")}
                </div>
            `, l.appendChild(m);
      const d = document.createElement("div");
      d.className = "cloze-text";
      let c = s, u = 0;
      n.forEach((h) => {
        const g = new RegExp(`\\*${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*`, "gi");
        c = c.replace(g, () => {
          const f = `<input type="text" class="cloze-blank" data-answer="${h.toLowerCase()}" data-section-id="${r}" data-blank-index="${u}" autocomplete="off" spellcheck="false" title="Fill in the blank">`;
          return u++, f;
        });
      }), c = c.replace(/\*([^*]+)\*/g, "$1"), c = this.addLineBreaksToHtml(c), d.innerHTML = c, l.appendChild(d), a < this.clozeSections.length - 1 && (l.style.marginBottom = "2rem"), o.appendChild(l);
    });
  }
  // Render a single vocabulary section inline into the target container
  renderVocabInline(e, t, o) {
    const { vocabulary: i, sectionId: a } = e, n = this.vocabularySections.length > 1 ? `Vocabulary Set ${o + 1}` : "Vocabulary", { card: r, content: l } = this.createSectionCard(n, {
      cardClasses: ["vocab-card"]
    }), d = Object.keys(i).map((g, f) => ({
      letter: String.fromCharCode(65 + f),
      // A, B, C...
      word: g,
      definition: i[g]
    })), c = document.createElement("div");
    c.className = "vocab-word-bank", c.innerHTML = `
            <div class="vocab-bank-title">Word Bank</div>
            <div class="vocab-bank-items">
                ${d.map((g) => `<span class="vocab-bank-item">${g.letter}: ${g.word.toUpperCase()}</span>`).join("")}
            </div>
        `, l.appendChild(c);
    const u = document.createElement("div");
    u.className = "vocab-matching-container";
    const h = [...d];
    this.shuffleArray(h), h.forEach((g) => {
      const f = document.createElement("div");
      f.className = "vocab-matching-row";
      const v = document.createElement("div");
      v.className = "vocab-matching-input-group";
      const p = document.createElement("input");
      p.type = "text", p.className = "vocab-matching-input", p.maxLength = 1, p.dataset.sectionId = a, p.dataset.word = g.word, p.dataset.correctLetter = g.letter, p.autocomplete = "off", p.setAttribute("autocapitalize", "characters"), p.setAttribute("autocorrect", "off"), p.setAttribute("spellcheck", "false"), p.inputMode = "text", p.title = "Enter the letter for this definition", v.appendChild(p), f.appendChild(v);
      const b = document.createElement("div");
      b.className = "vocab-definition-text", b.textContent = g.definition, f.appendChild(b), u.appendChild(f);
    }), l.appendChild(u), t.appendChild(r);
  }
  // Render a single cloze section inline into the target container
  renderClozeInline(e, t, o) {
    const { text: i, words: a, sectionId: s } = e, n = this.clozeSections.length > 1 ? `Fill in the Blanks - Section ${o + 1}` : "Fill in the Blanks", { card: r, content: l } = this.createSectionCard(n, {
      cardClasses: ["cloze-card"]
    }), m = document.createElement("div");
    m.className = "cloze-word-bank", m.innerHTML = `
            <div class="cloze-bank-title">Word Bank</div>
            <div class="cloze-bank-words">
                ${a.map((h) => `<span class="cloze-bank-word">${h}</span>`).join("")}
            </div>
        `, l.appendChild(m);
    let d = i, c = 0;
    a.forEach((h) => {
      const g = new RegExp(`\\*${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*`, "gi");
      d = d.replace(g, () => {
        const f = `<input type="text" class="cloze-blank" data-answer="${h.toLowerCase()}" data-section-id="${s}" data-blank-index="${c}" autocomplete="off" spellcheck="false" inputmode="text" autocapitalize="none" autocorrect="off" title="Fill in the blank">`;
        return c++, f;
      });
    }), d = d.replace(/\*([^*]+)\*/g, "$1"), d = this.addLineBreaksToHtml(d);
    const u = document.createElement("div");
    u.className = "cloze-text", u.innerHTML = d, l.appendChild(u), t.appendChild(r);
  }
  handleVocabAnswer(e) {
    const t = e.target;
    if (t.type === "text" && t.classList.contains("vocab-matching-input")) {
      const o = t.value.trim().toUpperCase();
      t.value !== o && (t.value = o);
      const i = parseInt(t.dataset.sectionId), a = t.dataset.word, s = `${i}-${a}`;
      o ? this.vocabUserChoices[s] = o : delete this.vocabUserChoices[s], this.updateCheckScoreButtonState();
    }
  }
  updateCheckScoreButtonState() {
    const e = this.vocabularySections.length === 0 || Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords(), t = this.totalQuestions === 0 || this.checkAllQuestionsAnswered(), o = this.checkAllClozeAnswered();
    if (e && t && o) {
      const i = this.shadowRoot.getElementById("checkScoreButton");
      i && (i.disabled = !1);
    }
  }
  handleClozeAnswer(e) {
    if (e.target.type !== "text" || !e.target.classList.contains("cloze-blank")) return;
    const t = e.target, o = t.dataset.sectionId, i = t.dataset.blankIndex, a = t.value.trim().toLowerCase(), s = `${o}-${i}`;
    if (this.clozeAnswers[s] = a, this.checkAllClozeAnswered()) {
      const n = this.vocabularySections.length === 0 || Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords(), r = this.totalQuestions === 0 || this.checkAllQuestionsAnswered();
      if (n && r) {
        const l = this.shadowRoot.getElementById("checkScoreButton");
        l.disabled = !1;
      }
    }
  }
  checkAllClozeAnswered() {
    const e = this.clozeSections.reduce((o, i) => o + i.words.length, 0);
    return Object.keys(this.clozeAnswers).filter((o) => this.clozeAnswers[o].length > 0).length === e;
  }
  getTotalVocabWords() {
    return this.vocabularySections.reduce((e, t) => e + (t.vocabulary ? Object.keys(t.vocabulary).length : 0), 0);
  }
  formatTextWithLineBreaks(e) {
    return e ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>") : "";
  }
  addLineBreaksToHtml(e) {
    return e ? e.replace(/\n/g, "<br>") : "";
  }
  createSectionCard(e, t = {}) {
    const { descriptionHtml: o = "", cardClasses: i = [] } = t, a = document.createElement("div"), s = ["section-card", ...i].filter(Boolean);
    a.className = s.join(" ");
    const n = document.createElement("div");
    if (n.className = "section-card-header", n.textContent = e, a.appendChild(n), o) {
      const l = document.createElement("div");
      l.className = "section-card-description", l.innerHTML = o, a.appendChild(l);
    }
    const r = document.createElement("div");
    return r.className = "section-card-content", a.appendChild(r), { card: a, content: r };
  }
  showVocabScore() {
    this.vocabScore = 0, this.getTotalVocabWords(), this.vocabularySections.forEach((e) => {
      const { vocabulary: t, sectionId: o } = e;
      if (!t) return;
      Object.keys(t).forEach((a) => {
        const s = `${o}-${a}`, n = this.vocabUserChoices[s], r = this.shadowRoot.querySelector(`.vocab-matching-input[data-section-id="${o}"][data-word="${a}"]`);
        if (!r) return;
        const l = r.dataset.correctLetter, m = r.closest(".vocab-matching-row");
        r.disabled = !0;
        let d = m.querySelector(".feedback-icon");
        d || (d = document.createElement("span"), d.className = "feedback-icon", m.appendChild(d)), n === l ? (this.vocabScore++, m.classList.add("correct"), d.textContent = " ✅") : (m.classList.add("incorrect"), d.textContent = ` ❌ (Correct: ${l})`);
      });
    }), this.vocabSubmitted = !0;
  }
  showClozeScore() {
    this.clozeScore = 0, this.clozeSections.reduce((t, o) => t + o.words.length, 0), this.shadowRoot.querySelectorAll(".cloze-blank").forEach((t) => {
      const o = t.dataset.answer.toLowerCase();
      t.value.trim().toLowerCase() === o ? (this.clozeScore++, t.classList.add("correct")) : t.classList.add("incorrect"), t.disabled = !0;
    }), this.clozeSubmitted = !0;
  }
  setupEventListeners() {
    const e = this.shadowRoot.getElementById("quizForm"), t = this.shadowRoot.getElementById("sendButton"), o = this.shadowRoot.getElementById("tryAgainButton"), i = this.shadowRoot.querySelector(".theme-toggle"), a = this.shadowRoot.getElementById("startQuizButton");
    e && e.addEventListener("keydown", (s) => {
      !this.quizUnlocked && s.key === "Enter" && s.preventDefault();
    }), e.addEventListener("change", (s) => {
      this.handleAnswer(s);
    }), e.addEventListener("input", (s) => {
      this.handleClozeAnswer(s), this.handleVocabAnswer(s);
    }), e.addEventListener("submit", (s) => this.handleSubmit(s)), t.addEventListener("click", () => this.sendScore()), o.addEventListener("click", () => this.resetQuiz()), i.addEventListener("click", () => this.toggleTheme()), a && a.addEventListener("click", () => this.handleStartQuiz()), this.getStudentInputs().forEach((s) => {
      s.addEventListener("input", () => {
        s.value.trim() !== "" && s.classList.remove("invalid"), this.quizUnlocked || this.showStudentInfoAlert();
      });
    }), this.shadowRoot.addEventListener("click", (s) => {
      const n = s.target.closest(".passage-audio-toggle");
      if (n) {
        const c = n.closest(".section-card"), h = (c ? Array.from(c.querySelectorAll(".passage-text")) : []).map((g) => g.textContent).join(`
`);
        this.handlePassageTTS(n, h);
        return;
      }
      s.target.closest(".audio-toggle") && this.handleAudioToggle(), s.target.closest("#voice-btn") && this._showVoiceOverlay(), s.target.closest(".close-voice-btn") && this._hideVoiceOverlay(), s.target.closest(".voice-overlay") && !s.target.closest(".voice-card") && this._hideVoiceOverlay();
    });
  }
  shuffleArray(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const o = Math.floor(Math.random() * (t + 1));
      [e[t], e[o]] = [e[o], e[t]];
    }
  }
  setAudioIcon(e) {
    const t = this.shadowRoot.querySelector(".play-icon"), o = this.shadowRoot.querySelector(".pause-icon");
    e === "playing" ? (t.classList.add("hidden"), o.classList.remove("hidden")) : (t.classList.remove("hidden"), o.classList.add("hidden"));
  }
  // Set play/pause icon state for a specific passage audio button
  setPassageAudioIcon(e, t) {
    if (!e) return;
    const o = e.querySelector(".play-icon"), i = e.querySelector(".pause-icon");
    !o || !i || (t === "playing" ? (o.classList.add("hidden"), i.classList.remove("hidden")) : (o.classList.remove("hidden"), i.classList.add("hidden")));
  }
  stopAllAudio() {
    window.speechSynthesis && window.speechSynthesis.cancel(), this.audioPlayer && (this.audioPlayer.pause(), this.audioPlayer.currentTime = 0), this.ttsPaused = !1, this.setAudioIcon("paused"), this.currentAudioButton && (this.setPassageAudioIcon(this.currentAudioButton, "paused"), this.currentAudioButton = null);
  }
  handleTTS() {
    if (this.audioPlayer && !this.audioPlayer.paused && this.audioPlayer.pause(), window.speechSynthesis.speaking && this.ttsPaused)
      window.speechSynthesis.resume(), this.ttsPaused = !1, this.setAudioIcon("playing");
    else if (window.speechSynthesis.speaking && !this.ttsPaused)
      window.speechSynthesis.pause(), this.ttsPaused = !0, this.setAudioIcon("paused");
    else {
      this.stopAllAudio(), this.utterance = new SpeechSynthesisUtterance(this.passage), this.utterance.lang = "en-US";
      let t = window.speechSynthesis.getVoices().find((o) => o.name === this.selectedVoiceName);
      t || (t = this._getBestVoice("en-US")), t && (this.utterance.voice = t), this.utterance.onstart = () => {
        this.setAudioIcon("playing"), this.ttsPaused = !1;
      }, this.utterance.onend = () => {
        this.setAudioIcon("paused"), this.ttsPaused = !1;
      }, this.utterance.onerror = (o) => {
        console.error("TTS Error:", o), this.setAudioIcon("paused"), this.ttsPaused = !1;
      }, window.speechSynthesis.speak(this.utterance);
    }
  }
  handleAudioFile() {
    (window.speechSynthesis.speaking || window.speechSynthesis.paused) && window.speechSynthesis.cancel(), this.audioPlayer || (this.audioPlayer = new Audio(this.audioSrc), this.audioPlayer.onplaying = () => this.setAudioIcon("playing"), this.audioPlayer.onpause = () => this.setAudioIcon("paused"), this.audioPlayer.onended = () => this.setAudioIcon("paused"), this.audioPlayer.onerror = (e) => {
      console.error("Audio file error. Falling back to TTS.", e), this.audioPlayer = null, this.handleTTS();
    }), this.audioPlayer.paused ? this.audioPlayer.play() : this.audioPlayer.pause();
  }
  handleAudioToggle() {
    this.audioSrc && this.audioSrc.trim() !== "" ? this.handleAudioFile() : this.handleTTS();
  }
  // Play/pause TTS for a specific passage button and text
  handlePassageTTS(e, t) {
    if (e) {
      if (this.currentAudioButton && this.currentAudioButton !== e && this.stopAllAudio(), window.speechSynthesis && window.speechSynthesis.speaking && this.currentAudioButton === e) {
        this.ttsPaused ? (window.speechSynthesis.resume(), this.ttsPaused = !1, this.setPassageAudioIcon(e, "playing")) : (window.speechSynthesis.pause(), this.ttsPaused = !0, this.setPassageAudioIcon(e, "paused"));
        return;
      }
      this.stopAllAudio();
      try {
        this.utterance = new SpeechSynthesisUtterance(t || ""), this.utterance.lang = "en-US";
        let i = window.speechSynthesis.getVoices().find((a) => a.name === this.selectedVoiceName);
        i || (i = this._getBestVoice("en-US")), i && (this.utterance.voice = i), this.utterance.onstart = () => {
          this.setPassageAudioIcon(e, "playing"), this.currentAudioButton = e, this.ttsPaused = !1;
        }, this.utterance.onend = () => {
          this.setPassageAudioIcon(e, "paused"), this.currentAudioButton === e && (this.currentAudioButton = null, this.ttsPaused = !1);
        }, this.utterance.onerror = (a) => {
          console.error("Passage TTS Error:", a), this.setPassageAudioIcon(e, "paused"), this.currentAudioButton === e && (this.currentAudioButton = null, this.ttsPaused = !1);
        }, window.speechSynthesis.speak(this.utterance);
      } catch (o) {
        console.error("TTS not available:", o);
      }
    }
  }
  createQuestionBlock(e, t) {
    const o = `q${t}`, i = [...e.o];
    this.shuffleArray(i);
    const a = i.map((r) => `
            <label class="option-label">
                <input type="radio" name="${o}" value="${r}" class="form-radio" required>
                <span>${r}</span>
            </label>
        `).join(""), s = e.e ? `<div class="explanation hidden" id="explanation-${o}">
            <div class="explanation-content">
                <strong>Explanation:</strong> ${e.e}
            </div>
        </div>` : "", n = document.createElement("div");
    return n.className = "question-block", n.innerHTML = `
            <p class="question-text">${e.q}</p>
            <div class="options-group">${a}</div>
            ${s}
        `, n;
  }
  generateQuiz() {
    const e = this.shadowRoot.getElementById("checkScoreButton"), t = this.shadowRoot.getElementById("dynamicContent");
    if (!t) {
      console.error("generateQuiz failed: dynamicContent element not found in shadow DOM");
      return;
    }
    console.log("generateQuiz called, questions total:", this.totalQuestions), t.innerHTML = "", this.score = 0, this.questionsAnswered = 0, this.userQuestionAnswers = {}, e.disabled = !0;
    const o = [];
    let i = 0, a = 0;
    this.orderedSections.forEach((s) => {
      if (s.type === "audio") {
        if (!this._shouldShowAudioControls()) return;
        const n = this.shadowRoot.querySelector(".quiz-header");
        if (n && !n.querySelector(".audio-toggle-container")) {
          const r = document.createElement("div");
          r.className = "audio-toggle-container", r.style.marginTop = "1rem", r.innerHTML = `
                        <button type="button" class="audio-toggle" title="Play Overall Audio">
                            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                            <span style="margin-left: 0.5rem; font-weight: 600;">Play Lesson Audio</span>
                        </button>
                    `, n.appendChild(r);
        }
      } else if (s.type === "text") {
        const { card: n, content: r } = this.createSectionCard(s.heading || "Reading Passage", {
          cardClasses: ["passage-card"]
        }), l = document.createElement("div");
        l.className = "passage-wrapper";
        const m = document.createElement("button");
        m.type = "button", m.className = "passage-audio-toggle", m.title = "Play Passage Audio", m.innerHTML = `
                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                `;
        const d = n.querySelector(".section-card-header");
        d && d.appendChild(m), s.text.split(/\n\s*\n/).forEach((u) => {
          const h = document.createElement("p");
          h.className = "passage-text", s.listening && h.classList.add("listening-hidden"), h.textContent = u.trim(), l.appendChild(h);
        }), r.appendChild(l), t.appendChild(n);
      } else if (s.type === "instructions") {
        const n = s.heading || "Instructions", r = s.body ? this.formatTextWithLineBreaks(s.body) : "", { card: l } = this.createSectionCard(n, {
          descriptionHtml: r,
          cardClasses: ["instruction-card"]
        });
        t.appendChild(l);
      } else if (s.type === "vocab") {
        const n = this.vocabularySections[i++];
        n && this.renderVocabInline(n, t, i - 1);
      } else if (s.type === "cloze") {
        const n = this.clozeSections[a++];
        n && this.renderClozeInline(n, t, a - 1);
      } else if (s.type === "questions") {
        const { card: n, content: r } = this.createSectionCard("Comprehension Questions", {
          cardClasses: ["questions-card"]
        }), l = document.createElement("p");
        if (l.className = "reading-instructions instruction", l.textContent = "Read each question and select the best answer from the choices below.", r.appendChild(l), t.appendChild(n), s.questions && s.questions.length > 0) {
          const m = s.maxQuestions || null;
          let d = [...s.questions];
          m && d.length > m && (this.shuffleArray(d), d = d.slice(0, m)), d.forEach((c) => o.push({ question: c, container: r }));
        }
      }
    }), this.currentQuestions = o.map((s) => s.question), this.totalQuestions = this.currentQuestions.length, this.currentQuestions.forEach((s, n) => {
      const r = o[n];
      (r && r.container ? r.container : t).appendChild(this.createQuestionBlock(s, n));
    });
  }
  getStudentInputs() {
    return [
      this.shadowRoot.getElementById("nickname"),
      this.shadowRoot.getElementById("homeroom"),
      this.shadowRoot.getElementById("studentId")
    ].filter(Boolean);
  }
  showStudentInfoAlert(e = "", t = "") {
    const o = this.shadowRoot.getElementById("studentInfoAlert");
    o && (o.textContent = e, o.className = t || "");
  }
  validateStudentInfoFields(e = {}) {
    const { showAlert: t = !0 } = e, o = this.getStudentInputs();
    let i = !0;
    return o.forEach((a) => {
      a.value.trim() === "" ? (i = !1, a.classList.add("invalid")) : a.classList.remove("invalid");
    }), t && (i ? this.showStudentInfoAlert() : this.showStudentInfoAlert("Please fill out all student information fields before continuing.", "error")), i;
  }
  lockQuizContent() {
    const e = this.shadowRoot.getElementById("quizContent"), t = this.shadowRoot.getElementById("startQuizButton");
    e && e.classList.add("hidden"), t && t.classList.remove("hidden"), this.quizUnlocked = !1, this.showStudentInfoAlert();
  }
  unlockQuizContent() {
    const e = this.shadowRoot.getElementById("quizContent"), t = this.shadowRoot.getElementById("startQuizButton");
    e && e.classList.remove("hidden"), t && t.classList.add("hidden"), this.quizUnlocked = !0;
  }
  handleStartQuiz() {
    if (!this.validateStudentInfoFields({ showAlert: !0 })) return;
    this.unlockQuizContent(), this.showStudentInfoAlert("Information saved! Scroll down to begin the quiz.", "success");
    const e = this.shadowRoot.getElementById("dynamicContent");
    try {
      e ? e.scrollIntoView({ behavior: "smooth", block: "start" }) : this.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      this.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  checkInitialCompletion() {
    const e = this.vocabularySections.length > 0, t = this.totalQuestions > 0, o = this.clozeSections.length > 0;
    o && !e && !t || !o && !e && !t && this.shadowRoot.getElementById("checkScoreContainer").classList.add("hidden");
  }
  checkAllQuestionsAnswered() {
    return this.questionsAnswered === this.totalQuestions;
  }
  showQuestionFeedback() {
    this.score = 0;
    for (let e = 0; e < this.totalQuestions; e++) {
      const t = this.currentQuestions[e], o = `q${e}`, i = this.userQuestionAnswers[e];
      this.shadowRoot.querySelectorAll(`input[name="${o}"]`).forEach((n) => {
        const r = n.closest(".option-label");
        n.disabled = !0;
        let l = r.querySelector(".feedback-icon");
        l || (l = document.createElement("span"), l.className = "feedback-icon", r.appendChild(l)), n.value === t.a && (r.classList.add("correct"), l.textContent = "✅"), i && n.value === i && i !== t.a && (r.classList.add("incorrect"), l.textContent = "❌");
      });
      const s = this.shadowRoot.getElementById(`explanation-q${e}`);
      s && s.classList.remove("hidden"), i === t.a && this.score++;
    }
  }
  handleAnswer(e) {
    if (e.target.type !== "radio") return;
    const t = e.target, o = t.name;
    if (o.startsWith("vocab-")) return;
    const i = parseInt(o.substring(1));
    this.userQuestionAnswers[i] = t.value, t.dataset.answered = "true";
    const a = Object.keys(this.userQuestionAnswers).length;
    this.questionsAnswered = a;
    const s = this.vocabularySections.length === 0 || Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords(), n = this.checkAllQuestionsAnswered(), r = this.checkAllClozeAnswered();
    s && n && r && (this.shadowRoot.getElementById("checkScoreButton").disabled = !1);
  }
  handleSubmit(e) {
    if (e.preventDefault(), !this.quizUnlocked) {
      this.showStudentInfoAlert("Please save your student information before taking the quiz.", "error");
      return;
    }
    this.validateStudentInfoFields({ showAlert: !0 }) && this.showFinalScore();
  }
  showFinalScore() {
    this.totalQuestions > 0 && this.showQuestionFeedback(), this.vocabularySections.length > 0 && !this.vocabSubmitted && this.showVocabScore(), this.clozeSections.length > 0 && !this.clozeSubmitted && this.showClozeScore();
    const e = this.shadowRoot.getElementById("resultScore"), t = this.shadowRoot.getElementById("checkScoreContainer"), o = this.shadowRoot.getElementById("resultArea"), i = this.shadowRoot.getElementById("postScoreActions"), a = this.shadowRoot.getElementById("sendButton"), s = this.shadowRoot.getElementById("tryAgainButton"), n = this.shadowRoot.getElementById("studentInfoSection"), r = this.getTotalVocabWords(), l = this.clozeSections.reduce((p, b) => p + b.words.length, 0), m = this.totalQuestions, d = r + l + m, c = this.vocabScore + this.clozeScore + this.score, u = this.shadowRoot.getElementById("nickname").value || "-", h = this.shadowRoot.getElementById("homeroom").value || "-", g = this.shadowRoot.getElementById("studentId").value || "-", v = (/* @__PURE__ */ new Date()).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    if (n && (n.style.display = "none"), d > 0) {
      const p = Math.round(c / d * 100);
      let b = "";
      r > 0 && (b += `
                    <div class="score-section">
                        <span class="score-label">Vocabulary</span>
                        <span class="score-value">${this.vocabScore}/${r}</span>
                    </div>`), l > 0 && (b += `
                    <div class="score-section">
                        <span class="score-label">Fill-in-the-blank</span>
                        <span class="score-value">${this.clozeScore}/${l}</span>
                    </div>`), m > 0 && (b += `
                    <div class="score-section">
                        <span class="score-label">Questions</span>
                        <span class="score-value">${this.score}/${m}</span>
                    </div>`), e.innerHTML = `
                <div class="score-report-card">
                    <div class="result-title">Performance Report</div>
                    <div class="student-details">
                        <div><strong>NAME:</strong> ${u}</div>
                        <div><strong>ID:</strong> ${g}</div>
                        <div><strong>CLASS:</strong> ${h}</div>
                        <div><strong>DATE:</strong> ${v}</div>
                    </div>
                    <div class="score-summary">
                        <div class="score-main-compact">${c} / ${d}</div>
                        <div class="score-percentage">${p}% Accuracy</div>
                    </div>
                    <div class="score-breakdown-compact">
                        ${b}
                    </div>
                </div>
            `;
    } else
      e.innerHTML = '<div class="score-report-card"><div class="score-main-compact">No score data available</div></div>';
    if (e.className = "", t && t.classList.add("hidden"), i && i.classList.remove("hidden"), o && o.classList.remove("hidden"), a && (a.disabled = !0, a.textContent = "Resend Score to Teacher", a.classList.add("hidden")), s && (s.disabled = !1), o)
      try {
        o.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {
        this.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    this.stopAllAudio(), this.sendScore(!0);
  }
  async sendScore(e = !1) {
    if (this.autoSubmissionInProgress)
      return;
    const t = this.shadowRoot.getElementById("validationMessage"), o = this.shadowRoot.getElementById("sendButton"), i = this.shadowRoot.getElementById("tryAgainButton");
    if (!this.validateStudentInfoFields({ showAlert: !0 })) {
      t && (t.textContent = "Please fill out all student information fields.", t.className = "error"), o && e && (o.classList.remove("hidden"), o.disabled = !1);
      return;
    }
    const s = this.getTotalVocabWords(), n = this.clozeSections.reduce((c, u) => c + u.words.length, 0), r = this.totalQuestions, l = s + n + r, m = this.vocabScore + this.clozeScore + this.score, d = {
      quizName: this.title,
      nickname: this.shadowRoot.getElementById("nickname").value,
      homeroom: this.shadowRoot.getElementById("homeroom").value,
      studentId: this.shadowRoot.getElementById("studentId").value,
      score: m,
      total: l,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.submissionUrl) {
      t && (t.textContent = "⚠️ No submission URL configured.", t.className = "error"), o && (o.textContent = "No Submission URL", o.disabled = !0, o.classList.remove("hidden")), i && (i.disabled = !1);
      return;
    }
    this.autoSubmissionInProgress = !0, o && (e ? o.classList.add("hidden") : (o.disabled = !0, o.textContent = "Sending...")), t && (t.innerHTML = e ? "<span>Submitting score to teacher...</span>" : "", t.className = ""), i && (i.disabled = !0);
    try {
      const c = await fetch(this.submissionUrl, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(d)
      });
      if (!c.ok)
        throw new Error(`HTTP error! status: ${c.status}`);
      let u;
      const h = c.headers.get("content-type");
      if (h && h.includes("application/json"))
        u = await c.json();
      else {
        const g = await c.text();
        console.warn("Non-JSON response received:", g), u = { message: "Submission received (non-JSON response)" };
      }
      if (t) {
        const g = e ? "Score automatically submitted to your teacher" : u.message || "Submission successful!";
        t.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>${g}</span>
                `, t.className = "success";
      }
      o && (o.textContent = "Score Sent", o.disabled = !0, o.classList.add("hidden")), i && (i.disabled = !1), this.scoreSubmitted = !0;
    } catch (c) {
      console.error("Error:", c), t && (t.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>Could not submit score. Please try again.</span>
                `, t.className = "error"), o && (o.textContent = e ? "Send Score Again" : "Try Sending Again", o.disabled = !1, o.classList.remove("hidden")), i && (i.disabled = !1);
    } finally {
      this.autoSubmissionInProgress = !1;
    }
  }
  resetQuiz() {
    const e = this.shadowRoot.getElementById("quizForm"), t = this.shadowRoot.getElementById("resultArea"), o = this.shadowRoot.getElementById("postScoreActions"), i = this.shadowRoot.getElementById("checkScoreContainer"), a = this.shadowRoot.getElementById("validationMessage"), s = this.shadowRoot.getElementById("sendButton"), n = this.shadowRoot.getElementById("tryAgainButton"), r = this.getStudentInputs(), l = this.shadowRoot.getElementById("studentInfoSection");
    e.reset(), l && (l.style.display = ""), t && t.classList.add("hidden"), o && o.classList.add("hidden"), i && i.classList.remove("hidden"), a && (a.textContent = "", a.className = ""), r.forEach((h) => {
      h.classList.remove("invalid"), h.disabled = !1;
    }), this.showStudentInfoAlert(), this.userQuestionAnswers = {}, this.questionsAnswered = 0, this.score = 0, this.vocabUserChoices = {}, this.vocabScore = 0, this.vocabSubmitted = !1, this.clozeAnswers = {}, this.clozeScore = 0, this.clozeSubmitted = !1, this.scoreSubmitted = !1, this.autoSubmissionInProgress = !1, Array.from(this.shadowRoot.querySelectorAll('input[type="radio"]')).forEach((h) => {
      h.disabled = !1;
      try {
        delete h.dataset.answered;
      } catch {
      }
    }), Array.from(this.shadowRoot.querySelectorAll(".option-label")).forEach((h) => {
      h.classList.remove("correct", "incorrect");
      const g = h.querySelector(".feedback-icon");
      g && g.remove(), h.style.cursor = "";
    }), Array.from(this.shadowRoot.querySelectorAll(".explanation")).forEach((h) => h.classList.add("hidden")), s && (s.disabled = !1, s.textContent = "Resend Score to Teacher", s.classList.add("hidden")), n && (n.disabled = !1), this.stopAllAudio(), this.generateQuiz();
    const u = this.shadowRoot.getElementById("checkScoreButton");
    u && (u.disabled = !0), this.lockQuizContent();
  }
  toggleTheme() {
    this.classList.toggle("dark");
    const e = this.classList.contains("dark");
    this.shadowRoot.querySelector(".light-icon").classList.toggle("hidden", e), this.shadowRoot.querySelector(".dark-icon").classList.toggle("hidden", !e);
  }
}
customElements.define("tj-quiz-element", A);
