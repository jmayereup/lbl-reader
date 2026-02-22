const C = {
  submissionUrl: "https://script.google.com/macros/s/AKfycbxDI_qYNK5NOfUCN7iN-1ebmwRapBcDzptYDEPKLdZh_vGuCb-UB6EsSgdEbSFAFuIekw/exec"
  // Replace with your actual submission endpoint
}, z = `<div class="quiz-wrapper" translate="no">
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
            <div id="quizContent" class="hidden">
                <!-- Dynamic sections will be appended here as .section-card elements -->
                <div id="dynamicContent"></div>

                <div id="studentInfoSection" class="section-card">
                    <div class="section-card-header">Student Information / ข้อมูลนักเรียน</div>
                    <p class="student-instructions instruction">Enter your details to generate your report. / กรุณากรอกข้อมูลเพื่อสร้างรายงานผลการเรียน
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
                    <div class="input-group" style="margin-top: 1rem;">
                        <label for="teacherCode" class="input-label">Teacher Code (Optional)</label>
                        <input type="text" id="teacherCode" name="teacherCode" class="form-input" placeholder="Enter code for submission">
                    </div>
                </div>

                <div id="checkScoreContainer" class="actions-container">
                    <button type="submit" id="checkScoreButton" class="button button-primary">
                        Check My Score
                    </button>
                    <p id="studentInfoAlert"></p>
                </div>

                <div id="resultArea" class="result-area section-card hidden">
                    <div id="resultScore"></div>
                </div>

                <div id="postScoreActions" class="post-score-section hidden">
                    <p id="validationMessage"></p>
                    
                    <div id="retrySubmissionSection" class="retry-section hidden">
                        <p class="retry-title">Want to send this to your teacher?</p>
                        <div class="retry-controls">
                            <input type="text" id="retryTeacherCode" class="form-input" placeholder="Teacher Code" title="Teacher Code">
                            <button type="button" id="retrySendButton" class="button button-green">Send Now</button>
                        </div>
                    </div>

                    <div class="post-score-actions">
                        <button type="button" id="sendButton" class="button button-green hidden">
                            Resend Score to Teacher
                        </button>
                        <button type="button" id="tryAgainButton" class="button button-slate">
                            Try Again
                        </button>
                    </div>
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
</div>`, I = ':host{display:block;--bg-light: #f1f5f9;--text-light: #1e293b;--card-bg-light: #ffffff;--card-shadow-light: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);--border-light: #e2e8f0;--input-bg-light: #f8fafc;--input-border-light: #cbd5e1;--subtle-text-light: #475569;--primary-color: #4f46e5;--primary-hover: #4338ca;--primary-text: #ffffff;--green-color: #16a34a;--green-hover: #15803d;--green-light-bg: #dcfce7;--red-color: #ef4444;--red-light-bg: #fee2e2;--yellow-color: #eab308;--slate-color: #64748b;--slate-hover: #475569;--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif}:host(.dark){--bg-light: #0f172a;--text-light: #e2e8f0;--card-bg-light: #1e293b;--card-shadow-light: 0 10px 15px -3px rgba(0, 0, 0, .3), 0 4px 6px -2px rgba(0, 0, 0, .2);--border-light: #334155;--input-bg-light: #334155;--input-border-light: #475569;--subtle-text-light: #87abdd;--green-light-bg: #14532d;--red-light-bg: #7f1d1d}.quiz-wrapper *{box-sizing:border-box}.quiz-wrapper{font-family:var(--font-sans);background-color:var(--bg-light);color:var(--text-light);line-height:1.6;transition:background-color .3s,color .3s;padding:1rem 0}.quiz-wrapper p{font-size:1em;margin-bottom:1rem}.container{max-width:800px;margin-left:auto;margin-right:auto;padding:0 1rem}.quiz-header{background-color:var(--primary-color);color:var(--primary-text);padding:1.5rem;position:relative;border-radius:.75rem;margin-bottom:1.25rem;box-shadow:var(--card-shadow-light)}.quiz-header h1{font-size:1.5em;font-weight:700;margin:0}.quiz-header p{margin-top:.5rem;color:#e0e7ff;opacity:.9;font-size:.9375em}.theme-toggle{position:absolute;top:1rem;right:1rem;cursor:pointer;width:2.5rem;height:2.5rem;padding:0;border-radius:9999px;background-color:#ffffff1a;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem;transition:background-color .2s,transform .2s}.theme-toggle:hover,#voice-btn:hover{background-color:#fff3;transform:scale(1.05)}form{padding:0}@media (min-width: 640px){form{padding:2rem}}fieldset{border:none;padding:0;margin:0;margin-bottom:2rem}.legend-container{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-light);padding-bottom:.5rem;margin-bottom:1rem;width:100%}legend{font-size:1.125em;font-weight:600;color:var(--text-light);border-bottom:none;padding-bottom:0;margin-bottom:0;width:auto}fieldset>legend{display:block;font-size:1.125em;font-weight:700;margin-bottom:.5rem;padding-bottom:.5rem;color:var(--text-light);border-bottom:1px solid var(--border-light)}#vocabSection .vocab-grid-table,#clozeSection .cloze-word-bank,#clozeSection .cloze-text{margin-top:1rem}.reading-instructions{font-size:.9em;font-style:italic;margin-bottom:1rem;margin-top:1rem}.instruction{font-size:.9em;color:var(--subtle-text-light);font-style:italic;margin-top:.25rem;margin-bottom:1rem;line-height:1.45}.audio-toggle{cursor:pointer;padding:.75rem;border-radius:9999px;background-color:var(--primary-color);border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;color:var(--primary-text);transition:background-color .2s}.audio-toggle:hover{background-color:var(--primary-hover)}.audio-toggle svg{width:1.5em;height:1.5em}.passage-audio-toggle{cursor:pointer;padding:.5rem .6rem;border-radius:.5rem;background-color:#fff;border:1px solid var(--border-light);color:var(--text-light);display:inline-flex;align-items:center;justify-content:center;margin-left:.5rem;box-shadow:0 2px 6px #0000000f;transition:transform .12s,box-shadow .12s}.passage-audio-toggle:hover{transform:translateY(-2px);box-shadow:0 6px 16px #0000001f}.passage-audio-toggle .play-icon,.passage-audio-toggle .pause-icon{width:1.1rem;height:1.1rem}.passage-wrapper{padding:1rem 1.25rem;border-radius:.5rem;background:transparent;margin-bottom:1rem}.passage-wrapper{position:relative}.passage-header{display:flex;align-items:center;gap:.5rem}.passage-text{margin-top:.75rem}.listening-hidden{position:absolute!important;clip:rect(1px,1px,1px,1px);clip-path:inset(50%);height:1px;width:1px;overflow:hidden;white-space:nowrap}.passage-content{background-color:var(--input-bg-light);border-radius:.5rem;padding:1.5rem;margin-bottom:1.5rem;border:1px solid var(--border-light);line-height:1.7}.section-card{background-color:var(--card-bg-light);border:1px solid var(--border-light);border-radius:.75rem;padding:1.5rem;margin-bottom:1.25rem;box-shadow:var(--card-shadow-light)}.section-card-header{font-size:1.05em;font-weight:600;color:var(--text-light);margin:0 0 .5rem;border-bottom:1px solid var(--border-light);padding-bottom:.4rem}.section-card-description{font-size:.95em;color:var(--subtle-text-light);line-height:1.6;margin-bottom:.75rem}.section-card-content{display:block}.instruction-card .section-card-content{margin-top:.25rem}.instruction-questions{margin-top:.75rem}.question-block{padding-top:1.5rem;border-top:1px solid var(--border-light)}.question-block:first-of-type{border-top:none;padding-top:0}.question-block p.question-text{font-weight:600;margin-bottom:1rem;font-size:1em}.options-group{display:flex;flex-direction:column;gap:.5rem}.option-label{display:flex;align-items:center;padding:.5rem .75rem;background-color:var(--input-bg-light);border-radius:.5rem;cursor:pointer;transition:background-color .18s,border-color .18s;border:1px solid transparent;font-size:.95em}.option-label:hover{background-color:#eef4ff}:host(.dark) .option-label:hover{background-color:#2b3440}.option-label.correct{background-color:var(--green-light-bg);border-color:var(--green-color)}.option-label.incorrect{background-color:var(--red-light-bg);border-color:var(--red-color)}.feedback-icon{margin-left:auto;font-size:1.25em}.explanation{margin-top:1rem;padding:1rem;background-color:var(--input-bg-light);border-radius:.5rem;border-left:4px solid var(--primary-color);font-size:.9em;line-height:1.5}.explanation-content strong{color:var(--primary-color)}.form-radio{width:1.125em;height:1.125em;margin-right:.75em;accent-color:var(--primary-color);flex-shrink:0}.form-radio:disabled{cursor:not-allowed}.form-input{width:100%;padding:.75rem;background-color:var(--input-bg-light);border:1px solid var(--input-border-light);border-radius:.5rem;color:var(--text-light);font-size:1em}.form-input.invalid{border-color:var(--red-color)}.form-input:disabled{background-color:#e2e8f0;cursor:not-allowed}:host(.dark) .form-input:disabled{background-color:#334155}.input-label{display:block;font-size:.875em;font-weight:500;color:var(--subtle-text-light);margin-bottom:.25rem}#teacherCode{letter-spacing:.1em;font-family:monospace}:host(.dark) #teacherCode{background-color:#1e293b}.grid-container{display:grid;grid-template-columns:1fr;gap:1rem}@media (min-width: 768px){.grid-container{grid-template-columns:repeat(2,1fr)}}.actions-container{padding-top:1.5rem;border-top:1px solid var(--border-light);margin-top:2rem}.button{width:100%;font-weight:600;padding:.875rem 1.5rem;border-radius:.5rem;font-size:1em;transition:all .2s ease-in-out;border:none;cursor:pointer}.button:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 4px 10px #0000001a}.button:disabled{background-color:#94a3b8;cursor:not-allowed;transform:none;box-shadow:none}.button-primary{background-color:var(--primary-color);color:var(--primary-text)}.button-primary:hover:not(:disabled){background-color:var(--primary-hover)}.button-green{background-color:var(--green-color);color:var(--primary-text)}.button-green:hover:not(:disabled){background-color:var(--green-hover)}.button-slate{background-color:var(--slate-color);color:var(--primary-text)}.button-slate:hover:not(:disabled){background-color:var(--slate-hover)}.post-score-actions{display:flex;flex-direction:column;gap:1rem}@media (min-width: 768px){.post-score-actions{flex-direction:row-reverse}}.prequiz-actions{margin-top:1.5rem;display:flex;flex-direction:column;gap:.75rem;align-items:flex-start}#studentInfoAlert{font-size:.9em;font-weight:500;min-height:1.5rem}#studentInfoAlert.success{color:var(--green-color)}#studentInfoAlert.error{color:var(--red-color)}.result-area{padding:2rem;text-align:center;border-bottom:1px solid var(--border-light);margin-bottom:2rem}.result-area h2{font-size:1.25em;font-weight:600;margin:0}#resultScore{text-align:center;margin:1.5rem 0}.score-main{font-size:3em;font-weight:700;line-height:1;margin-bottom:.5rem}.score-percentage{font-size:1.5em;font-weight:600;opacity:.8;margin-bottom:1rem}.score-breakdown{display:flex;justify-content:center;gap:2rem;margin-top:1rem}.score-section{display:flex;flex-direction:column;align-items:center;gap:.25rem}.score-label{font-size:.9em;font-weight:500;opacity:.7;text-transform:uppercase;letter-spacing:.05em}.score-value{font-size:1.25em;font-weight:600}@media (max-width: 768px){.score-main{font-size:2.5em}.score-percentage{font-size:1.25em}.score-breakdown{flex-direction:column;gap:1rem}.score-section{flex-direction:row;justify-content:space-between;align-items:center;padding:.5rem 1rem;background-color:var(--input-bg-light);border-radius:.5rem}}#resultScore.high .score-main{color:var(--green-color)}#resultScore.medium .score-main{color:var(--yellow-color)}#resultScore.low .score-main{color:var(--red-color)}#validationMessage{text-align:center;margin-bottom:1rem;font-weight:500;min-height:1.5rem;font-size:.9em}#validationMessage.success{color:var(--green-color)}#validationMessage.error{color:var(--red-color)}.hidden{display:none!important}.vocab-word-bank{background-color:var(--input-bg-light);border:1px solid var(--border-light);border-radius:.5rem;padding:1rem;margin-bottom:1.25rem}:host(.dark) .vocab-word-bank{background-color:var(--input-bg-dark)}.vocab-bank-title{font-weight:600;margin-bottom:.75rem;color:var(--subtle-text-light);font-size:.9em;text-transform:uppercase;letter-spacing:.05em}.vocab-bank-items{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}.vocab-bank-item{background-color:var(--card-bg-light);color:var(--text-light);padding:.45rem .75rem;border-radius:.375rem;border:1px solid var(--border-light);font-size:.9em;font-weight:600;cursor:default;-webkit-user-select:none;user-select:none;box-shadow:0 1px 2px #0000000d}.vocab-matching-container{display:flex;flex-direction:column;gap:.5rem}.vocab-matching-row{display:flex;align-items:center;gap:1rem;padding:.5rem .75rem;border-radius:.5rem;transition:background-color .2s}.vocab-matching-input{width:2.5rem;height:2.5rem;padding:0;text-align:center;font-weight:700;font-size:1.125rem;line-height:normal;border:2px solid var(--input-border-light);border-radius:.4rem;background-color:var(--card-bg-light);color:var(--text-light);text-transform:uppercase;flex-shrink:0;box-sizing:border-box}:host(.dark) .vocab-matching-input{background-color:var(--input-bg-light)}.vocab-matching-input:focus{border-color:var(--primary-color);outline:none;box-shadow:0 0 0 3px #4f46e51a}.vocab-matching-input:disabled{background-color:#f1f5f9;cursor:not-allowed}:host(.dark) .vocab-matching-input:disabled{background-color:#1e293b}.vocab-definition-text{flex:1;font-size:1em;color:var(--text-light)}.vocab-matching-row.correct{background-color:var(--green-light-bg)}.vocab-matching-row.incorrect{background-color:var(--red-light-bg)}.vocab-matching-row.correct .vocab-matching-input{border-color:var(--green-color)}.vocab-matching-row.incorrect .vocab-matching-input{border-color:var(--red-color)}.vocab-matching-row .feedback-icon{font-weight:600;font-size:.9em;white-space:nowrap}@media (max-width: 768px){.vocab-def-label{display:inline-block;white-space:normal;max-width:60%}}.cloze-word-bank{background-color:var(--input-bg-light);border:1px solid var(--border-light);border-radius:.5rem;padding:1rem;margin-bottom:1.25rem}:host(.dark) .cloze-word-bank{background-color:var(--input-bg-dark)}.cloze-bank-title{font-weight:600;margin-bottom:.75rem;color:var(--subtle-text-light);font-size:.9em;text-transform:uppercase;letter-spacing:.05em}.cloze-bank-words{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}.cloze-bank-word{background-color:var(--card-bg-light);color:var(--text-light);padding:.45rem .75rem;border-radius:.375rem;border:1px solid var(--border-light);font-size:.9em;font-weight:600;cursor:default;-webkit-user-select:none;user-select:none;box-shadow:0 1px 2px #0000000d}.cloze-text{line-height:1.8;font-size:1.05em;color:var(--text-light)}.cloze-blank{display:inline-block;min-width:6.5ch;max-width:12ch;margin:0 .35rem;padding:.15rem .4rem;border:none;border-bottom:2px solid var(--border-light);background:transparent;font-size:inherit;font-family:inherit;color:var(--text-light);text-align:center;vertical-align:baseline;transition:border-color .18s,background-color .18s}.cloze-blank:focus{outline:none;border-bottom-color:var(--primary-color);background:#4f46e508;border-radius:.25rem}.cloze-blank.correct{border-bottom-color:var(--green-color);background-color:var(--green-light-bg)}.cloze-blank.correct{border-bottom-color:var(--green-color);background-color:var(--green-light-bg);border-radius:.25rem}.cloze-blank.incorrect{border-bottom-color:var(--red-color);background-color:var(--red-light-bg);border-radius:.25rem}.cloze-score{text-align:center;font-weight:600;margin-top:1rem;font-size:1.1em}@media (max-width: 768px){.cloze-bank-words{gap:.375rem}.cloze-bank-word{padding:.375rem .5rem;font-size:.8em}.cloze-blank{min-width:5.5ch}.cloze-text{font-size:1em}.cloze-blank{min-width:80px;padding:.25em .375em}}.vocab-section-header,.cloze-section-header{margin:1.5rem 0 1rem;font-size:1.1em;font-weight:600;color:var(--primary-color);border-bottom:2px solid var(--primary-color);padding-bottom:.5rem}.cloze-section-wrapper{margin-bottom:2rem}.cloze-section-wrapper:last-child{margin-bottom:0}.score-report-card{background-color:var(--card-bg-light);border:2px solid var(--primary-color);border-radius:1rem;padding:2rem;margin:1rem 0;text-align:center;box-shadow:0 4px 20px #4f46e526;position:relative;overflow:hidden}.score-report-card:before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,var(--primary-color),var(--primary-hover))}.result-title{font-size:1.5em;font-weight:800;color:var(--primary-color);margin-bottom:1.5rem;text-transform:uppercase;letter-spacing:.1em}.student-details{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:2rem;font-size:1.1em;border:1px solid var(--border-light);padding:1.25rem;border-radius:.5rem;background-color:var(--input-bg-light);text-align:left}.student-details strong{color:var(--primary-color)}.score-summary{margin-bottom:2rem}.score-main-compact{font-size:2.5em;font-weight:800;color:var(--primary-color);margin-bottom:.25rem}.score-percentage{font-size:1.2em;color:var(--slate-color);font-weight:600}.score-breakdown-compact{display:flex;flex-direction:column;gap:.75rem;max-width:300px;margin:0 auto;padding:1rem;border-top:1px dashed var(--border-light)}.score-section{display:flex;justify-content:space-between;align-items:center;font-weight:600}.score-label{color:var(--subtle-text-light)}.score-value{color:var(--text-light)}.post-score-section{text-align:center;margin:2rem 0}.post-score-actions{display:flex;justify-content:center;gap:1rem;margin-top:1.5rem}#validationMessage.success{display:inline-flex;align-items:center;gap:.5rem;background-color:var(--green-light-bg);color:var(--green-color);padding:.75rem 1.5rem;border-radius:2rem;font-weight:600;font-size:.95rem;margin-bottom:0}#validationMessage.error{color:var(--red-color);background-color:var(--red-light-bg);padding:.75rem 1.5rem;border-radius:2rem;font-weight:600;font-size:.95rem;display:inline-flex;margin-bottom:0}.voice-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#0f172ab3;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:2000}.voice-card{background:var(--card-bg-light);width:90%;max-width:400px;max-height:80vh;border-radius:1.25rem;box-shadow:0 25px 50px -12px #00000040;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--border-light)}.voice-card-header{padding:1.25rem;background:var(--primary-color);color:#fff;display:flex;justify-content:space-between;align-items:center}.voice-card-header h3{margin:0;font-size:1.25em;font-weight:700}.close-voice-btn{background:#fff3;border:none;color:#fff;width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.5em;transition:background .2s}.close-voice-btn:hover{background:#ffffff4d}.voice-list{padding:1rem;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:.5rem}.voice-option-btn{padding:.875rem 1rem;background:var(--input-bg-light);border:1px solid var(--border-light);border-radius:.75rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all .2s;color:var(--text-light);font-family:var(--font-sans)}.voice-option-btn:hover{border-color:var(--primary-color);background:#eff6ff}:host(.dark) .voice-option-btn:hover{background:#1e293b}.voice-option-btn.active{background:#eff6ff;border-color:var(--primary-color);color:var(--primary-color);font-weight:600;box-shadow:0 0 0 1px var(--primary-color)}:host(.dark) .voice-option-btn.active{background:#1e293b}.voice-option-btn .badge{background:var(--green-color);color:#fff;padding:.2rem .5rem;border-radius:2rem;font-size:.75em;font-weight:700;text-transform:uppercase}#voice-btn{position:absolute;top:1rem;right:4rem;cursor:pointer;width:2.5rem;height:2.5rem;padding:0;border-radius:9999px;background-color:#ffffff1a;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;color:#fff;transition:background-color .2s,transform .2s}#voice-btn svg{width:1.25rem;height:1.25rem}.retry-section{margin-top:1rem;margin-bottom:1rem;padding:1.25rem;background-color:var(--input-bg-light);border-radius:.6rem;border:1px dashed var(--border-light)}.retry-title{margin-top:0;margin-bottom:.75rem;font-size:.95em;font-weight:600;color:var(--text-light)}.retry-controls{display:flex;gap:.75rem;align-items:center}.retry-controls .form-input{flex:1;margin:0}.retry-controls .button{width:auto;margin:0;white-space:nowrap}';
class A extends HTMLElement {
  static get observedAttributes() {
    return ["submission-url"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.questionBank = [], this.passages = [], this.selectedVoiceName = null, this.isPlayingAll = !1, this.instructions = [], this.questionGroups = [], this.orderedSections = [], this.currentQuestions = [], this.score = 0, this.questionsAnswered = 0, this.questionsToDisplay = 5, this.totalQuestions = 0, this.audioPlayer = null, this.utterance = null, this.audioSrc = "", this.currentAudioButton = null, this.submissionUrl = C.submissionUrl, this.title = "", this.passage = "", this.vocabularySections = [], this.vocabUserChoices = {}, this.vocabScore = 0, this.vocabSubmitted = !1, this.clozeSections = [], this.clozeAnswers = {}, this.clozeScore = 0, this.clozeSubmitted = !1, this.userQuestionAnswers = {}, this.quizUnlocked = !0, this.autoSubmissionInProgress = !1, this.scoreSubmitted = !1, this.scoreSentToServer = !1, this.ttsPaused = !1;
  }
  attributeChangedCallback(e, t) {
    e === "submission-url" && (this.submissionUrl = t);
  }
  connectedCallback() {
    requestAnimationFrame(() => {
      if (this.originalContent = this.textContent, this.hasAttribute("submission-url") && (this.submissionUrl = this.getAttribute("submission-url")), this.loadTemplate(), this.setAttribute("translate", "no"), !this._shouldShowAudioControls()) {
        const t = this.shadowRoot.getElementById("voice-btn");
        t && t.classList.add("hidden");
      }
      window.speechSynthesis && (window.speechSynthesis.onvoiceschanged = () => this._updateVoiceList(), this._updateVoiceList()), this.parseContent(), this.setupEventListeners(), this.generateQuiz(), this.unlockQuizContent();
      const e = this.loadFromLocalStorage();
      e && this.restoreQuizState(e);
    });
  }
  loadTemplate() {
    try {
      const e = document.createElement("template");
      e.innerHTML = `<style>${I}</style>${z}`, this.shadowRoot.firstChild && (this.shadowRoot.innerHTML = ""), this.shadowRoot.appendChild(e.content.cloneNode(!0)), console.log("Inlined template applied successfully");
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
    let s = t.filter((i) => i.lang.toLowerCase() === e.toLowerCase());
    if (s.length === 0 && (s = t.filter((i) => i.lang.split(/[-_]/)[0].toLowerCase() === o)), s.length === 0) return null;
    const r = ["natural", "google", "premium", "siri"];
    for (const i of r) {
      const a = s.find((c) => c.name.toLowerCase().includes(i));
      if (a) return a;
    }
    return s.find((i) => !i.name.toLowerCase().includes("microsoft")) || s[0];
  }
  _updateVoiceList() {
    if (!window.speechSynthesis) return;
    const e = window.speechSynthesis.getVoices(), t = this.shadowRoot.querySelector(".voice-list");
    if (!t) return;
    const o = "en-US", s = e.filter((n) => n.lang.split(/[-_]/)[0].toLowerCase() === o.split("-")[0]), r = this._getBestVoice(o);
    t.innerHTML = "", s.sort((n, i) => n.name.localeCompare(i.name)), s.forEach((n) => {
      const i = document.createElement("button");
      i.type = "button", i.classList.add("voice-option-btn"), this.selectedVoiceName === n.name && i.classList.add("active");
      let a = `<span>${n.name}</span>`;
      r && n.name === r.name && (a += '<span class="badge">Best</span>'), i.innerHTML = a, i.onclick = () => {
        this.selectedVoiceName = n.name, this._updateVoiceList(), this._hideVoiceOverlay();
      }, t.appendChild(i);
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
    const t = e.split("---").map((n) => n.trim());
    if (t.length >= 1) {
      const i = t[0].trim().split(`
`).map((a) => a.trim()).filter((a) => a.length > 0);
      i.length > 0 && (this.title = i[0]);
    }
    let o = null, s = null;
    for (let n = 1; n < t.length; n++) {
      const a = t[n].split(`
`);
      if (a.length === 0) continue;
      const h = (a[0] || "").trim().toLowerCase(), d = a.slice(1).join(`
`);
      if (h.startsWith("vocab")) {
        const l = h.match(/vocab(?:-(\d+))?/), u = l && l[1] ? parseInt(l[1]) : null;
        this.parseVocabulary(d, u), this.orderedSections.push({ type: "vocab", data: { vocabCount: u } }), o = "vocab";
      } else if (h.startsWith("cloze")) {
        const l = h.match(/cloze(?:-(\d+))?/), u = l && l[1] ? parseInt(l[1]) : null;
        this.parseCloze(d, u), this.orderedSections.push({ type: "cloze", data: { clozeCount: u, text: d } }), o = "cloze";
      } else if (h.startsWith("instructions")) {
        const l = this.passages.length, { heading: u, body: g } = this.extractHeadingAndBody(d, `Instructions ${this.instructions.length + 1}`);
        this.instructions.push({ sectionId: l, heading: u, body: g }), this.passages.push({ text: g || u, sectionId: l, listening: !1, isInstruction: !0 }), this.orderedSections.push({ type: "instructions", sectionId: l, heading: u, body: g }), s = l, o = "instructions";
      } else if (h.startsWith("questions")) {
        const l = h.match(/questions(?:-(\d+))?/), u = l && l[1] ? parseInt(l[1]) : null, g = this.parseQuestions(d), p = o === "text" || o === "instructions" || o === "questions" && this.orderedSections.length > 0 && this.orderedSections[this.orderedSections.length - 1].tiedToPassage;
        s !== null ? (this.questionGroups.push({ sectionId: s, questions: g, maxQuestions: u }), this.orderedSections.push({ type: "questions", sectionId: s, questions: g, maxQuestions: u, tiedToPassage: p })) : (this.questionGroups.push({ sectionId: null, questions: g, maxQuestions: u }), this.orderedSections.push({ type: "questions", sectionId: null, questions: g, maxQuestions: u, tiedToPassage: !1 })), o = "questions";
      } else
        switch (h) {
          case "text":
          case "text-listening":
            const l = h === "text-listening", u = this.passages.length;
            this.passages.push({ text: d, sectionId: u, listening: l }), this.passage = d, s = u, this.orderedSections.push({ type: "text", sectionId: u, text: d, listening: l }), o = "text";
            break;
          case "audio":
            this.parseAudio(d), this.orderedSections.push({ type: "audio", audioSrc: this.audioSrc }), o = "audio";
            break;
          default:
            o = null;
        }
    }
    this.title && (this.shadowRoot.getElementById("quizTitle").textContent = this.title);
    const r = this.questionGroups.reduce((n, i) => n + (i.questions ? i.questions.length : 0), 0);
    console.log("Parsed:", {
      title: this.title,
      passages: this.passages.length,
      passageLength: this.passage.length,
      vocabularySections: this.vocabularySections.length,
      clozeSections: this.clozeSections.length,
      audioSrc: this.audioSrc,
      questionsCount: r
    });
  }
  parseVocabulary(e, t = null) {
    if (!e) return;
    const o = e.split(/\r?\n/).map((a) => a.trim()).filter(Boolean), s = o.length > 0 ? o.slice() : [e.trim()], r = (a) => {
      const c = {};
      return a.forEach((h) => {
        const d = h.indexOf(":");
        if (d === -1) return;
        const l = h.slice(0, d).trim(), u = h.slice(d + 1).trim().replace(/,$/, "");
        l && u && (c[l] = u);
      }), c;
    };
    let n = r(s);
    if (Object.keys(n).length <= 1 && e.indexOf(",") !== -1) {
      const a = e.split(",").map((c) => c.trim()).filter(Boolean);
      n = r(a);
    }
    let i;
    if (t && Object.keys(n).length > t) {
      const a = Object.entries(n);
      this.shuffleArray(a);
      const c = a.slice(0, t);
      i = Object.fromEntries(c);
    } else
      i = n;
    this.vocabularySections.push({
      vocabulary: i,
      sectionId: this.vocabularySections.length
    }), console.log("Vocabulary section parsed. Words in this section:", Object.keys(i).length, "Max words:", t);
  }
  parseAudio(e) {
    if (!e) return;
    const t = e.match(/audio-src\s*=\s*(.+)/);
    t && (this.audioSrc = t[1].trim());
  }
  parseCloze(e, t = null) {
    if (!e) return;
    const o = e.match(/\*([^*]+)\*/g);
    let s = [];
    o && (s = o.map((r) => r.replace(/\*/g, "")), t && s.length > t && (this.shuffleArray(s), s = s.slice(0, t))), this.clozeSections.push({
      text: e,
      words: s,
      sectionId: this.clozeSections.length
    }), console.log("Cloze section parsed. Total words available:", o ? o.length : 0, "Words to remove:", s.length, "Max blanks:", t);
  }
  parseQuestions(e, t = null) {
    if (!e) return [];
    const o = e.split(`
`).map((n) => n.trim()).filter((n) => n.length > 0);
    let s = null;
    const r = [];
    for (const n of o)
      if (n.startsWith("Q:") || n.startsWith("Q."))
        s && r.push(s), s = {
          q: n.substring(2).trim(),
          o: [],
          a: "",
          e: ""
          // explanation
        };
      else if (n.startsWith("A:") && s) {
        const i = n.substring(2).trim(), a = i.includes("[correct]"), c = i.replace("[correct]", "").trim();
        s.o.push(c), a && (s.a = c);
      } else n.startsWith("E:") && s && (s.e = n.substring(2).trim());
    return s && r.push(s), console.log("Questions parsed. Total questions parsed:", r.length, "Max questions (deferred):", t), r;
  }
  extractHeadingAndBody(e, t = "Instructions") {
    const o = (e || "").split(`
`);
    let s = "";
    const r = [];
    for (const i of o)
      !s && i.trim().length > 0 ? s = i.trim() : r.push(i);
    s || (s = t);
    const n = r.join(`
`).trim();
    return { heading: s, body: n };
  }
  generateVocabMatching() {
    const e = this.shadowRoot.getElementById("vocabSection"), t = this.shadowRoot.getElementById("vocabGrid");
    if (this.vocabularySections.length === 0) {
      e.classList.add("hidden");
      return;
    }
    e.classList.remove("hidden"), t.innerHTML = "", this.vocabScore = 0, this.vocabUserChoices = {}, this.vocabSubmitted = !1, this.vocabularySections.forEach((o, s) => {
      const { vocabulary: r, sectionId: n } = o;
      if (!r) return;
      if (this.vocabularySections.length > 1) {
        const l = document.createElement("div");
        l.className = "vocab-section-header", l.innerHTML = `<h4>Vocabulary Set ${s + 1}</h4>`, t.appendChild(l);
      }
      const i = Object.keys(r), a = Object.values(r);
      this.shuffleArray(a);
      const c = document.createElement("div");
      c.className = "vocab-grid-table";
      const h = document.createElement("div");
      h.className = "vocab-grid-header";
      const d = document.createElement("div");
      if (d.className = "vocab-grid-header-cell", d.textContent = "Word", h.appendChild(d), a.forEach((l) => {
        const u = document.createElement("div");
        u.className = "vocab-grid-header-cell", u.textContent = l, h.appendChild(u);
      }), c.appendChild(h), i.forEach((l, u) => {
        const g = document.createElement("div");
        g.className = "vocab-grid-row";
        const p = document.createElement("div");
        p.className = "vocab-grid-cell vocab-word-cell", p.textContent = l, g.appendChild(p);
        const m = r[l], f = a.filter((v) => v !== m);
        this.shuffleArray(f);
        const b = [m, ...f.slice(0, 3)];
        this.shuffleArray(b), b.forEach((v, y) => {
          const w = document.createElement("div");
          w.className = "vocab-grid-cell vocab-option-cell";
          const x = document.createElement("div");
          x.className = "vocab-radio-container";
          const S = document.createElement("input");
          S.type = "radio", S.name = `vocab-${n}-${u}`, S.value = v, S.id = `vocab-${n}-${u}-${y}`, x.appendChild(S), w.appendChild(x);
          const k = document.createElement("span");
          k.className = "vocab-def-label", k.textContent = v, w.appendChild(k), g.appendChild(w);
        }), c.appendChild(g);
      }), t.appendChild(c), s < this.vocabularySections.length - 1) {
        const l = document.createElement("div");
        l.style.marginBottom = "2rem", t.appendChild(l);
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
      const s = document.createElement("div");
      s.id = "clozeContainer", e.appendChild(s);
    }
    const o = this.shadowRoot.getElementById("clozeContainer");
    o.innerHTML = "", this.clozeSections.forEach((s, r) => {
      const { text: n, words: i, sectionId: a } = s, c = document.createElement("div");
      if (c.className = "cloze-section-wrapper", this.clozeSections.length > 1) {
        const g = document.createElement("h4");
        g.className = "cloze-section-header", g.textContent = `Fill in the Blanks - Section ${r + 1}`, c.appendChild(g);
      }
      const h = document.createElement("div");
      h.className = "cloze-word-bank", h.innerHTML = `
                <div class="cloze-bank-title">Word Bank</div>
                <div class="cloze-bank-words">
                    ${i.map((g) => `<span class="cloze-bank-word">${g}</span>`).join("")}
                </div>
            `, c.appendChild(h);
      const d = document.createElement("div");
      d.className = "cloze-text";
      let l = n, u = 0;
      i.forEach((g) => {
        const p = new RegExp(`\\*${g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*`, "gi");
        l = l.replace(p, () => {
          const m = `<input type="text" class="cloze-blank" data-answer="${g.toLowerCase()}" data-section-id="${a}" data-blank-index="${u}" autocomplete="off" spellcheck="false" title="Fill in the blank">`;
          return u++, m;
        });
      }), l = l.replace(/\*([^*]+)\*/g, "$1"), l = this.addLineBreaksToHtml(l), d.innerHTML = l, c.appendChild(d), r < this.clozeSections.length - 1 && (c.style.marginBottom = "2rem"), o.appendChild(c);
    });
  }
  // Render a single vocabulary section inline into the target container
  renderVocabInline(e, t, o) {
    const { vocabulary: s, sectionId: r } = e, i = this.vocabularySections.length > 1 ? `Vocabulary Set ${o + 1}` : "Vocabulary", { card: a, content: c } = this.createSectionCard(i, {
      cardClasses: ["vocab-card"]
    }), d = Object.keys(s).map((p, m) => ({
      letter: String.fromCharCode(65 + m),
      // A, B, C...
      word: p,
      definition: s[p]
    })), l = document.createElement("div");
    l.className = "vocab-word-bank", l.innerHTML = `
            <div class="vocab-bank-title">Word Bank</div>
            <div class="vocab-bank-items">
                ${d.map((p) => `<span class="vocab-bank-item">${p.letter}: ${p.word.toUpperCase()}</span>`).join("")}
            </div>
        `, c.appendChild(l);
    const u = document.createElement("div");
    u.className = "vocab-matching-container";
    const g = [...d];
    this.shuffleArray(g), g.forEach((p) => {
      const m = document.createElement("div");
      m.className = "vocab-matching-row";
      const f = document.createElement("div");
      f.className = "vocab-matching-input-group";
      const b = document.createElement("input");
      b.type = "text", b.className = "vocab-matching-input", b.maxLength = 1, b.dataset.sectionId = r, b.dataset.word = p.word, b.dataset.correctLetter = p.letter, b.autocomplete = "off", b.setAttribute("autocapitalize", "characters"), b.setAttribute("autocorrect", "off"), b.setAttribute("spellcheck", "false"), b.inputMode = "text", b.title = "Enter the letter for this definition", f.appendChild(b), m.appendChild(f);
      const v = document.createElement("div");
      v.className = "vocab-definition-text", v.textContent = p.definition, m.appendChild(v), u.appendChild(m);
    }), c.appendChild(u), t.appendChild(a);
  }
  // Render a single cloze section inline into the target container
  renderClozeInline(e, t, o) {
    const { text: s, words: r, sectionId: n } = e, i = this.clozeSections.length > 1 ? `Fill in the Blanks - Section ${o + 1}` : "Fill in the Blanks", { card: a, content: c } = this.createSectionCard(i, {
      cardClasses: ["cloze-card"]
    }), h = document.createElement("div");
    h.className = "cloze-word-bank", h.innerHTML = `
            <div class="cloze-bank-title">Word Bank</div>
            <div class="cloze-bank-words">
                ${r.map((g) => `<span class="cloze-bank-word">${g}</span>`).join("")}
            </div>
        `, c.appendChild(h);
    let d = s, l = 0;
    r.forEach((g) => {
      const p = new RegExp(`\\*${g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*`, "gi");
      d = d.replace(p, () => {
        const m = `<input type="text" class="cloze-blank" data-answer="${g.toLowerCase()}" data-section-id="${n}" data-blank-index="${l}" autocomplete="off" spellcheck="false" inputmode="text" autocapitalize="none" autocorrect="off" title="Fill in the blank">`;
        return l++, m;
      });
    }), d = d.replace(/\*([^*]+)\*/g, "$1"), d = this.addLineBreaksToHtml(d);
    const u = document.createElement("div");
    u.className = "cloze-text", u.innerHTML = d, c.appendChild(u), t.appendChild(a);
  }
  handleVocabAnswer(e) {
    const t = e.target;
    if (t.type === "text" && t.classList.contains("vocab-matching-input")) {
      const o = t.value.trim().toUpperCase();
      t.value !== o && (t.value = o);
      const s = parseInt(t.dataset.sectionId), r = t.dataset.word, n = `${s}-${r}`;
      o ? this.vocabUserChoices[n] = o : delete this.vocabUserChoices[n], this.updateCheckScoreButtonState();
    }
  }
  updateCheckScoreButtonState() {
    const e = this.vocabularySections.length === 0 || Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords(), t = this.totalQuestions === 0 || this.checkAllQuestionsAnswered(), o = this.checkAllClozeAnswered();
    if (e && t && o) {
      const s = this.shadowRoot.getElementById("checkScoreButton");
      s && (s.disabled = !1);
    }
  }
  handleClozeAnswer(e) {
    if (e.target.type !== "text" || !e.target.classList.contains("cloze-blank")) return;
    const t = e.target, o = t.dataset.sectionId, s = t.dataset.blankIndex, r = t.value.trim().toLowerCase(), n = `${o}-${s}`;
    if (this.clozeAnswers[n] = r, this.checkAllClozeAnswered()) {
      const i = this.vocabularySections.length === 0 || Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords(), a = this.totalQuestions === 0 || this.checkAllQuestionsAnswered();
      if (i && a) {
        const c = this.shadowRoot.getElementById("checkScoreButton");
        c.disabled = !1;
      }
    }
  }
  checkAllClozeAnswered() {
    const e = this.clozeSections.reduce((o, s) => o + s.words.length, 0);
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
    const { descriptionHtml: o = "", cardClasses: s = [] } = t, r = document.createElement("div"), n = ["section-card", ...s].filter(Boolean);
    r.className = n.join(" ");
    const i = document.createElement("div");
    if (i.className = "section-card-header", i.textContent = e, r.appendChild(i), o) {
      const c = document.createElement("div");
      c.className = "section-card-description", c.innerHTML = o, r.appendChild(c);
    }
    const a = document.createElement("div");
    return a.className = "section-card-content", r.appendChild(a), { card: r, content: a };
  }
  showVocabScore() {
    this.vocabScore = 0, this.getTotalVocabWords(), this.vocabularySections.forEach((e) => {
      const { vocabulary: t, sectionId: o } = e;
      if (!t) return;
      Object.keys(t).forEach((r) => {
        const n = `${o}-${r}`, i = this.vocabUserChoices[n], a = this.shadowRoot.querySelector(`.vocab-matching-input[data-section-id="${o}"][data-word="${r}"]`);
        if (!a) return;
        const c = a.dataset.correctLetter, h = a.closest(".vocab-matching-row");
        a.disabled = !0;
        let d = h.querySelector(".feedback-icon");
        d || (d = document.createElement("span"), d.className = "feedback-icon", h.appendChild(d)), i === c ? (this.vocabScore++, h.classList.add("correct"), d.textContent = " ✅") : (h.classList.add("incorrect"), d.textContent = " ❌");
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
    const e = this.shadowRoot.getElementById("quizForm"), t = this.shadowRoot.getElementById("sendButton"), o = this.shadowRoot.getElementById("tryAgainButton"), s = this.shadowRoot.querySelector(".theme-toggle"), r = this.shadowRoot.getElementById("startQuizButton");
    e && e.addEventListener("keydown", (i) => {
      !this.quizUnlocked && i.key === "Enter" && i.preventDefault();
    });
    const n = this.shadowRoot.getElementById("retrySendButton");
    e && (e.addEventListener("change", (i) => {
      this.handleAnswer(i);
    }), e.addEventListener("input", (i) => {
      this.handleClozeAnswer(i), this.handleVocabAnswer(i);
    }), e.addEventListener("submit", (i) => this.handleSubmit(i))), t && t.addEventListener("click", () => this.sendScore()), o && o.addEventListener("click", () => this.resetQuiz()), n && n.addEventListener("click", () => this.sendScore(!1, !0)), s && s.addEventListener("click", () => this.toggleTheme()), r && r.addEventListener("click", () => this.handleStartQuiz()), this.getStudentInputs().forEach((i) => {
      i.addEventListener("input", () => {
        i.value.trim() !== "" && i.classList.remove("invalid"), this.quizUnlocked || this.showStudentInfoAlert();
      });
    }), this.shadowRoot.addEventListener("click", (i) => {
      const a = i.target.closest(".passage-audio-toggle");
      if (a) {
        const u = a.closest(".section-card"), p = (u ? Array.from(u.querySelectorAll(".passage-text")) : []).map((m) => m.textContent).join(`
`);
        this.handlePassageTTS(a, p);
        return;
      }
      i.target.closest(".audio-toggle") && this.handleAudioToggle(), i.target.closest("#voice-btn") && this._showVoiceOverlay(), i.target.closest(".close-voice-btn") && this._hideVoiceOverlay(), i.target.closest(".voice-overlay") && !i.target.closest(".voice-card") && this._hideVoiceOverlay();
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
    const o = e.querySelector(".play-icon"), s = e.querySelector(".pause-icon");
    !o || !s || (t === "playing" ? (o.classList.add("hidden"), s.classList.remove("hidden")) : (o.classList.remove("hidden"), s.classList.add("hidden")));
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
        let s = window.speechSynthesis.getVoices().find((r) => r.name === this.selectedVoiceName);
        s || (s = this._getBestVoice("en-US")), s && (this.utterance.voice = s), this.utterance.onstart = () => {
          this.setPassageAudioIcon(e, "playing"), this.currentAudioButton = e, this.ttsPaused = !1;
        }, this.utterance.onend = () => {
          this.setPassageAudioIcon(e, "paused"), this.currentAudioButton === e && (this.currentAudioButton = null, this.ttsPaused = !1);
        }, this.utterance.onerror = (r) => {
          console.error("Passage TTS Error:", r), this.setPassageAudioIcon(e, "paused"), this.currentAudioButton === e && (this.currentAudioButton = null, this.ttsPaused = !1);
        }, window.speechSynthesis.speak(this.utterance);
      } catch (o) {
        console.error("TTS not available:", o);
      }
    }
  }
  createQuestionBlock(e, t) {
    const o = `q${t}`, s = [...e.o];
    this.shuffleArray(s);
    const r = s.map((a) => `
            <label class="option-label">
                <input type="radio" name="${o}" value="${a}" class="form-radio" required>
                <span>${a}</span>
            </label>
        `).join(""), n = e.e ? `<div class="explanation hidden" id="explanation-${o}">
            <div class="explanation-content">
                <strong>Explanation:</strong> ${e.e}
            </div>
        </div>` : "", i = document.createElement("div");
    return i.className = "question-block", i.innerHTML = `
            <p class="question-text">${e.q}</p>
            <div class="options-group">${r}</div>
            ${n}
        `, i;
  }
  generateQuiz() {
    const e = this.shadowRoot.getElementById("checkScoreButton"), t = this.shadowRoot.getElementById("dynamicContent");
    if (!t) {
      console.error("generateQuiz failed: dynamicContent element not found in shadow DOM");
      return;
    }
    console.log("generateQuiz called, questions total:", this.totalQuestions), t.innerHTML = "", this.score = 0, this.questionsAnswered = 0, this.userQuestionAnswers = {}, e.disabled = !0;
    const o = [];
    let s = 0, r = 0;
    this.orderedSections.forEach((n) => {
      if (n.type === "audio") {
        if (!this._shouldShowAudioControls()) return;
        const i = this.shadowRoot.querySelector(".quiz-header");
        if (i && !i.querySelector(".audio-toggle-container")) {
          const a = document.createElement("div");
          a.className = "audio-toggle-container", a.style.marginTop = "1rem", a.innerHTML = `
                        <button type="button" class="audio-toggle" title="Play Overall Audio">
                            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                            <span style="margin-left: 0.5rem; font-weight: 600;">Play Lesson Audio</span>
                        </button>
                    `, i.appendChild(a);
        }
      } else if (n.type === "text") {
        const { card: i, content: a } = this.createSectionCard(n.heading || "Reading Passage", {
          cardClasses: ["passage-card"]
        }), c = document.createElement("div");
        c.className = "passage-wrapper";
        const h = document.createElement("button");
        h.type = "button", h.className = "passage-audio-toggle", h.title = "Play Passage Audio", h.innerHTML = `
                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                `;
        const d = i.querySelector(".section-card-header");
        d && d.appendChild(h), n.text.split(/\n\s*\n/).forEach((u) => {
          const g = document.createElement("p");
          g.className = "passage-text", n.listening && g.classList.add("listening-hidden"), g.textContent = u.trim(), c.appendChild(g);
        }), a.appendChild(c), t.appendChild(i);
      } else if (n.type === "instructions") {
        const i = n.heading || "Instructions", a = n.body ? this.formatTextWithLineBreaks(n.body) : "", { card: c } = this.createSectionCard(i, {
          descriptionHtml: a,
          cardClasses: ["instruction-card"]
        });
        t.appendChild(c);
      } else if (n.type === "vocab") {
        const i = this.vocabularySections[s++];
        i && this.renderVocabInline(i, t, s - 1);
      } else if (n.type === "cloze") {
        const i = this.clozeSections[r++];
        i && this.renderClozeInline(i, t, r - 1);
      } else if (n.type === "questions") {
        const { card: i, content: a } = this.createSectionCard("Comprehension Questions", {
          cardClasses: ["questions-card"]
        }), c = document.createElement("p");
        if (c.className = "reading-instructions instruction", c.textContent = "Read each question and select the best answer from the choices below.", a.appendChild(c), t.appendChild(i), n.questions && n.questions.length > 0) {
          const h = n.maxQuestions || null;
          let d = [...n.questions];
          h && d.length > h && (this.shuffleArray(d), d = d.slice(0, h)), d.forEach((l) => o.push({ question: l, container: a }));
        }
      }
    }), this.currentQuestions = o.map((n) => n.question), this.totalQuestions = this.currentQuestions.length, this.currentQuestions.forEach((n, i) => {
      const a = o[i];
      (a && a.container ? a.container : t).appendChild(this.createQuestionBlock(n, i));
    });
  }
  getStudentInputs() {
    return [
      this.shadowRoot.getElementById("nickname"),
      this.shadowRoot.getElementById("homeroom"),
      this.shadowRoot.getElementById("studentId")
    ].filter(Boolean);
  }
  getTeacherCodeInput() {
    return this.shadowRoot.getElementById("teacherCode");
  }
  getStorageKey() {
    return `tj-quiz-result-${(this.title || "untitled-quiz").toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  }
  saveToLocalStorage(e) {
    try {
      const t = this.getStorageKey();
      localStorage.setItem(t, JSON.stringify({
        ...e,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    } catch (t) {
      console.warn("Failed to save to localStorage:", t);
    }
  }
  loadFromLocalStorage() {
    try {
      const e = this.getStorageKey(), t = localStorage.getItem(e);
      return t ? JSON.parse(t) : null;
    } catch (e) {
      return console.warn("Failed to load from localStorage:", e), null;
    }
  }
  clearLocalStorage() {
    try {
      const e = this.getStorageKey();
      localStorage.removeItem(e);
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  }
  restoreQuizState(e) {
    const t = this.shadowRoot.getElementById("nickname"), o = this.shadowRoot.getElementById("homeroom"), s = this.shadowRoot.getElementById("studentId");
    t && (t.value = e.nickname || ""), o && (o.value = e.homeroom || ""), s && (s.value = e.studentId || ""), this.vocabScore = e.vocabScore || 0, this.clozeScore = e.clozeScore || 0, this.score = e.score || 0, this.scoreSentToServer = e.scoreSentToServer || !1, this.showFinalScore();
  }
  showStudentInfoAlert(e = "", t = "") {
    const o = this.shadowRoot.getElementById("studentInfoAlert");
    o && (o.textContent = e, o.className = t || "");
  }
  validateStudentInfoFields(e = {}) {
    const { showAlert: t = !0 } = e, o = this.getStudentInputs();
    let s = !0;
    return o.forEach((r) => {
      r.value.trim() === "" ? (s = !1, r.classList.add("invalid")) : r.classList.remove("invalid");
    }), t && (s ? this.showStudentInfoAlert() : this.showStudentInfoAlert("Please fill out all student information fields before continuing.", "error")), s;
  }
  lockQuizContent() {
    const e = this.shadowRoot.getElementById("quizContent");
    e && e.classList.remove("hidden"), this.quizUnlocked = !0;
  }
  unlockQuizContent() {
    const e = this.shadowRoot.getElementById("quizContent");
    e && e.classList.remove("hidden"), this.quizUnlocked = !0;
  }
  handleStartQuiz() {
    this.unlockQuizContent();
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
      const t = this.currentQuestions[e], o = `q${e}`, s = this.userQuestionAnswers[e];
      this.shadowRoot.querySelectorAll(`input[name="${o}"]`).forEach((i) => {
        const a = i.closest(".option-label");
        i.disabled = !0;
        let c = a.querySelector(".feedback-icon");
        c || (c = document.createElement("span"), c.className = "feedback-icon", a.appendChild(c)), s === i.value && (s === t.a ? (a.classList.add("correct"), c.textContent = "✅") : (a.classList.add("incorrect"), c.textContent = "❌"));
      });
      const n = this.shadowRoot.getElementById(`explanation-q${e}`);
      n && n.classList.add("hidden"), s === t.a && this.score++;
    }
  }
  handleAnswer(e) {
    if (e.target.type !== "radio") return;
    const t = e.target, o = t.name;
    if (o.startsWith("vocab-")) return;
    const s = parseInt(o.substring(1));
    this.userQuestionAnswers[s] = t.value, t.dataset.answered = "true";
    const r = Object.keys(this.userQuestionAnswers).length;
    this.questionsAnswered = r;
    const n = this.vocabularySections.length === 0 || Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords(), i = this.checkAllQuestionsAnswered(), a = this.checkAllClozeAnswered();
    n && i && a && (this.shadowRoot.getElementById("checkScoreButton").disabled = !1);
  }
  handleSubmit(e) {
    if (e.preventDefault(), !this.validateStudentInfoFields({ showAlert: !0 })) {
      const n = this.shadowRoot.getElementById("studentInfoSection");
      n && n.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    this.vocabScore;
    const t = this.getTotalVocabWords(), o = this.clozeSections.reduce((n, i) => n + i.words.length, 0), s = this.totalQuestions, r = this.vocabScore + this.clozeScore + this.score;
    this.saveToLocalStorage({
      nickname: this.shadowRoot.getElementById("nickname").value,
      homeroom: this.shadowRoot.getElementById("homeroom").value,
      studentId: this.shadowRoot.getElementById("studentId").value,
      vocabScore: this.vocabScore,
      clozeScore: this.clozeScore,
      score: this.score,
      totalPossible: t + o + s,
      totalEarned: r,
      scoreSentToServer: this.scoreSentToServer
    }), this.showFinalScore();
  }
  showFinalScore() {
    this.totalQuestions > 0 && this.showQuestionFeedback(), this.vocabularySections.length > 0 && !this.vocabSubmitted && this.showVocabScore(), this.clozeSections.length > 0 && !this.clozeSubmitted && this.showClozeScore();
    const e = this.shadowRoot.getElementById("resultScore"), t = this.shadowRoot.getElementById("checkScoreContainer"), o = this.shadowRoot.getElementById("resultArea"), s = this.shadowRoot.getElementById("postScoreActions"), r = this.shadowRoot.getElementById("sendButton"), n = this.shadowRoot.getElementById("tryAgainButton"), i = this.shadowRoot.getElementById("studentInfoSection"), a = this.getTotalVocabWords(), c = this.clozeSections.reduce((v, y) => v + y.words.length, 0), h = this.totalQuestions, d = a + c + h, l = this.vocabScore + this.clozeScore + this.score, u = this.shadowRoot.getElementById("nickname").value || "-", g = this.shadowRoot.getElementById("homeroom").value || "-", p = this.shadowRoot.getElementById("studentId").value || "-", f = (/* @__PURE__ */ new Date()).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    if (i) {
      const v = this.getStudentInputs(), y = this.getTeacherCodeInput();
      v.forEach((w) => {
        w && (w.disabled = !0);
      }), y && (y.disabled = !0);
    }
    s && s.classList.remove("hidden");
    const b = this.shadowRoot.getElementById("retrySubmissionSection");
    if (b && (this.scoreSentToServer ? b.classList.add("hidden") : b.classList.remove("hidden")), d > 0) {
      const v = Math.round(l / d * 100);
      let y = "";
      a > 0 && (y += `
                    <div class="score-section">
                        <span class="score-label">Vocabulary</span>
                        <span class="score-value">${this.vocabScore}/${a}</span>
                    </div>`), c > 0 && (y += `
                    <div class="score-section">
                        <span class="score-label">Fill-in-the-blank</span>
                        <span class="score-value">${this.clozeScore}/${c}</span>
                    </div>`), h > 0 && (y += `
                    <div class="score-section">
                        <span class="score-label">Questions</span>
                        <span class="score-value">${this.score}/${h}</span>
                    </div>`), e.innerHTML = `
                <div class="score-report-card">
                    <div class="result-title">Performance Report</div>
                    <div class="student-details">
                        <div><strong>NAME:</strong> ${u}</div>
                        <div><strong>ID:</strong> ${p}</div>
                        <div><strong>CLASS:</strong> ${g}</div>
                        <div><strong>DATE:</strong> ${f}</div>
                    </div>
                    <div class="score-summary">
                        <div class="score-main-compact">${l} / ${d}</div>
                        <div class="score-percentage">${v}% Accuracy</div>
                    </div>
                    <div class="score-breakdown-compact">
                        ${y}
                    </div>
                </div>
            `;
    } else
      e.innerHTML = '<div class="score-report-card"><div class="score-main-compact">No score data available</div></div>';
    if (e.className = "", t && t.classList.add("hidden"), s && s.classList.remove("hidden"), o && o.classList.remove("hidden"), r && (r.disabled = !0, r.textContent = "Resend Score to Teacher", r.classList.add("hidden")), n && (n.disabled = !1), o)
      try {
        o.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {
        this.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    this.stopAllAudio(), this.sendScore(!0);
  }
  async sendScore(e = !1, t = !1) {
    if (this.autoSubmissionInProgress)
      return;
    const o = this.shadowRoot.getElementById("validationMessage"), s = this.shadowRoot.getElementById("sendButton"), r = this.shadowRoot.getElementById("tryAgainButton"), n = this.shadowRoot.getElementById("retrySubmissionSection");
    if (this.shadowRoot.getElementById("retrySendButton"), !this.validateStudentInfoFields({ showAlert: !0 })) {
      o && (o.textContent = "Please fill out all student information fields.", o.className = "error"), s && e && (s.classList.remove("hidden"), s.disabled = !1);
      return;
    }
    let a = "";
    if (t) {
      const m = this.shadowRoot.getElementById("retryTeacherCode");
      a = m ? m.value.trim() : "";
    } else {
      const m = this.getTeacherCodeInput();
      a = m ? m.value.trim() : "";
    }
    this.vocabScore;
    const h = this.getTotalVocabWords(), d = this.clozeSections.reduce((m, f) => m + f.words.length, 0), l = this.totalQuestions, u = h + d + l, g = this.vocabScore + this.clozeScore + this.score, p = {
      quizName: this.title,
      nickname: this.shadowRoot.getElementById("nickname").value,
      homeroom: this.shadowRoot.getElementById("homeroom").value,
      studentId: this.shadowRoot.getElementById("studentId").value,
      score: g,
      total: u,
      teacherCode: a,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (a !== "6767") {
      t ? o && (o.textContent = "❌ Invalid Teacher Code. Please try again.", o.className = "error") : (o && (o.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Report card generated. Not sent to teacher (no valid code).</span>
                    `, o.className = "success"), n && n.classList.remove("hidden")), r && (r.disabled = !1), this.scoreSubmitted = !0, this.autoSubmissionInProgress = !1;
      return;
    }
    if (!this.submissionUrl) {
      o && (o.textContent = "⚠️ No submission URL configured.", o.className = "error"), s && (s.textContent = "No Submission URL", s.disabled = !0, s.classList.remove("hidden")), r && (r.disabled = !1);
      return;
    }
    this.autoSubmissionInProgress = !0, s && (e ? s.classList.add("hidden") : (s.disabled = !0, s.textContent = "Sending...")), o && (o.innerHTML = e ? "<span>Submitting score to teacher...</span>" : "", o.className = ""), r && (r.disabled = !0);
    try {
      const m = await fetch(this.submissionUrl, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(p)
      });
      if (!m.ok)
        throw new Error(`HTTP error! status: ${m.status}`);
      let f;
      const b = m.headers.get("content-type");
      if (b && b.includes("application/json"))
        f = await m.json();
      else {
        const v = await m.text();
        console.warn("Non-JSON response received:", v), f = { message: "Submission received (non-JSON response)" };
      }
      if (this.scoreSentToServer = !0, n && n.classList.add("hidden"), o) {
        const v = e ? "Score automatically submitted to your teacher" : f.message || "Submission successful!";
        o.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>${v}</span>
                `, o.className = "success";
      }
      s && (s.textContent = "Score Sent", s.disabled = !0, s.classList.add("hidden")), r && (r.disabled = !1), this.scoreSubmitted = !0;
    } catch (m) {
      console.error("Error:", m), o && (o.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>Could not submit score. Please try again.</span>
                `, o.className = "error"), s && (s.textContent = e ? "Send Score Again" : "Try Sending Again", s.disabled = !1, s.classList.remove("hidden")), r && (r.disabled = !1);
    } finally {
      this.autoSubmissionInProgress = !1;
    }
  }
  resetQuiz() {
    const e = this.shadowRoot.getElementById("quizForm"), t = this.shadowRoot.getElementById("resultArea"), o = this.shadowRoot.getElementById("postScoreActions"), s = this.shadowRoot.getElementById("checkScoreContainer"), r = this.shadowRoot.getElementById("validationMessage"), n = this.shadowRoot.getElementById("sendButton"), i = this.shadowRoot.getElementById("tryAgainButton"), a = this.getStudentInputs(), c = this.shadowRoot.getElementById("studentInfoSection");
    if (e.reset(), c) {
      c.style.display = "";
      const m = this.getStudentInputs(), f = this.getTeacherCodeInput();
      m.forEach((b) => {
        b && (b.disabled = !1);
      }), f && (f.disabled = !1);
    }
    t && t.classList.add("hidden"), o && o.classList.add("hidden"), s && s.classList.remove("hidden"), r && (r.textContent = "", r.className = ""), a.forEach((m) => {
      m.classList.remove("invalid"), m.disabled = !1;
    }), this.showStudentInfoAlert(), this.userQuestionAnswers = {}, this.questionsAnswered = 0, this.score = 0, this.vocabUserChoices = {}, this.vocabScore = 0, this.vocabSubmitted = !1, this.clozeAnswers = {}, this.clozeScore = 0, this.clozeSubmitted = !1, this.scoreSubmitted = !1, this.scoreSentToServer = !1, this.autoSubmissionInProgress = !1, this.clearLocalStorage();
    const h = this.shadowRoot.getElementById("retrySubmissionSection");
    h && h.classList.add("hidden");
    const d = this.shadowRoot.getElementById("retryTeacherCode");
    d && (d.value = ""), Array.from(this.shadowRoot.querySelectorAll('input[type="radio"]')).forEach((m) => {
      m.disabled = !1;
      try {
        delete m.dataset.answered;
      } catch {
      }
    }), Array.from(this.shadowRoot.querySelectorAll(".option-label")).forEach((m) => {
      m.classList.remove("correct", "incorrect");
      const f = m.querySelector(".feedback-icon");
      f && f.remove(), m.style.cursor = "";
    }), Array.from(this.shadowRoot.querySelectorAll(".explanation")).forEach((m) => m.classList.add("hidden")), n && (n.disabled = !1, n.textContent = "Resend Score to Teacher", n.classList.add("hidden")), i && (i.disabled = !1), this.stopAllAudio(), this.generateQuiz();
    const p = this.shadowRoot.getElementById("checkScoreButton");
    p && (p.disabled = !0), this.lockQuizContent();
  }
  toggleTheme() {
    this.classList.toggle("dark");
    const e = this.classList.contains("dark");
    this.shadowRoot.querySelector(".light-icon").classList.toggle("hidden", e), this.shadowRoot.querySelector(".dark-icon").classList.toggle("hidden", !e);
  }
}
customElements.define("tj-quiz-element", A);
