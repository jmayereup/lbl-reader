const x = `
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');

    tj-chapter-book {
        --tj-bg-color: #f8fafc;
        --tj-text-color: #1e293b;
        --tj-card-bg: #ffffff;
        --tj-accent-color: #b45309;
        --tj-subtitle-color: #64748b;
        --tj-card-border: #e2e8f0;
        --tj-btn-bg: #f1f5f9;
        --tj-btn-text: #475569;
        --tj-btn-hover: #e2e8f0;
        --tj-btn-slow-text: #2563eb;
        --tj-quiz-bg: #f8fafc;
        --tj-shadow: rgba(0, 0, 0, 0.05);
        --tj-input-bg: #ffffff;
        
        display: block;
        box-sizing: border-box;
        font-family: 'Lato', sans-serif;
        background-color: var(--tj-bg-color);
        color: var(--tj-text-color);
        overflow-anchor: auto;
        padding-bottom: 2em;
        transition: background-color 0.3s, color 0.3s;
    }

    tj-chapter-book *, tj-chapter-book *::before, tj-chapter-book *::after {
        box-sizing: inherit;
    }

    tj-chapter-book h1, tj-chapter-book h2, tj-chapter-book h3, tj-chapter-book p {
        margin: 0;
        padding: 0;
    }

    tj-chapter-book.dark-theme {
        --tj-bg-color: #0f172a;
        --tj-text-color: #e2e8f0;
        --tj-card-bg: #1e293b;
        --tj-card-border: #334155;
        --tj-accent-color: #fbbf24;
        --tj-subtitle-color: #94a3b8;
        --tj-btn-bg: #334155;
        --tj-btn-hover: #475569;
        --tj-btn-text: white;
        --tj-btn-slow-text: #93c5fd;
        --tj-quiz-bg: #334155;
        --tj-shadow: rgba(0, 0, 0, 0.5);
        --tj-input-bg: #1e293b;
    }

    tj-chapter-book h1, tj-chapter-book h2, tj-chapter-book h3 {
        font-family: 'Lato', sans-serif;
    }

    .book-header {
        max-width: 56em;
        margin: 0 auto;
        padding: 1.5em 1em;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
    }

    .theme-toggle, .print-toggle, .lang-swap {
        background: none;
        border: none;
        color: var(--tj-text-color);
        cursor: pointer;
        padding: 0.5em;
        border-radius: 50%;
        transition: background-color 0.2s;
    }

    .theme-toggle:hover, .print-toggle:hover, .lang-swap:hover {
        background-color: var(--tj-btn-hover);
    }

    .header-actions {
        display: flex;
        gap: 0.5em;
        justify-content: flex-end;
        width: 100%;
        flex-wrap: wrap;
        margin-bottom: 0.5em;
    }

    @media (max-width: 640px) {
        .header-actions {
            justify-content: center;
        }
    }

    .book-title {
        font-size: 3em;
        line-height: 1;
        color: var(--tj-accent-color);
        margin-bottom: 0.5em;
    }

    .book-subtitle {
        font-size: 1.25em;
        color: var(--tj-subtitle-color);
    }

    @media (max-width: 640px) {
        .book-title {
            font-size: 2em;
        }
    }

    .chapters-container {
        max-width: 48em;
        margin: 0 auto;
        padding: 2em 1em;
    }

    .chapters-container > * + * {
        margin-top: 3em;
    }

    .chapter-card {
        background-color: var(--tj-card-bg);
        border: 1px solid var(--tj-card-border);
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px var(--tj-shadow);
        transition: transform 0.2s, background-color 0.3s, border-color 0.3s;
        padding: 1.5em;
    }

    @media (min-width: 768px) {
        .chapter-card {
            padding: 2em;
        }
    }

    .chapter-title {
        font-size: 1.875em;
        line-height: 2.25em;
        color: var(--tj-accent-color);
        margin-bottom: 1.5em;
    }

    .audio-controls {
        display: flex;
        gap: 0.75em;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 1em;
    }

    .audio-btn {
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 0.375em 0.75em;
        border-radius: 9999px;
        transition: all 0.2s;
        font-size: 0.875em;
        border-width: 1px;
        border-style: solid;
        cursor: pointer;
        font-weight: 600;
    }

    .audio-btn-normal {
        background-color: var(--tj-btn-bg);
        color: var(--tj-btn-text);
        border-color: var(--tj-card-border);
    }

    .audio-btn-normal:hover {
        background-color: var(--tj-btn-hover);
    }

    .audio-btn-slow {
        background-color: var(--tj-btn-bg);
        color: var(--tj-btn-slow-text);
        border-color: var(--tj-card-border);
    }

    .audio-btn-slow:hover {
        background-color: var(--tj-btn-hover);
    }

    .audio-btn-cancel {
        background-color: var(--tj-btn-bg);
        color: var(--tj-btn-text);
        border-color: var(--tj-card-border);
    }

    .audio-btn-cancel:hover {
        background-color: var(--tj-btn-hover);
    }

    .chapter-text {
        color: var(--tj-text-color);
        line-height: 1.625;
        margin-bottom: 1.5em;
        font-size: 1.125em;
    }

    .chapter-text p {
        margin-bottom: 1.25em;
    }

    .translation-details {
        margin-bottom: 2em;
    }

    .translation-summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        cursor: pointer;
        list-style: none;
        background-color: var(--tj-card-bg);
        padding: 0.75em;
        border-radius: 0.5em;
        color: var(--tj-accent-color);
        transition: background-color 0.2s;
        border: 1px solid var(--tj-card-border);
    }

    .translation-summary:hover {
        background-color: var(--tj-btn-hover);
    }

    .translation-content {
        color: var(--tj-subtitle-color);
        font-style: italic;
        font-size: 1em;
        margin-top: 0.75em;
        padding-left: 0.75em;
        padding-right: 0.75em;
    }

    .quiz-container {
        background-color: var(--tj-card-bg);
        padding: 1.5em;
        border-radius: 0.5em;
        border: 1px solid var(--tj-card-border);
    }

    .quiz-title {
        font-size: 1.25em;
        color: var(--tj-accent-color);
        margin-bottom: 1em;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    .question-block {
        background: var(--tj-quiz-bg);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        border: 1px solid var(--tj-card-border);
    }

    .question-text {
        margin-bottom: 0.5em;
        font-weight: 600;
    }

    .option-label {
        display: block;
        margin-bottom: 0.25em;
    }

    input[type="radio"] {
        accent-color: var(--tj-accent-color);
        transform: scale(1.2);
        margin-right: 8px;
    }

    .feedback {
        margin-top: 8px;
        font-size: 0.9em;
        transition: all 0.3s;
    }

    .check-btn {
        margin-top: 0.5em;
        background-color: #ca8a04;
        color: white;
        padding: 0.5em 1em;
        border-radius: 0.25em;
        font-weight: 700;
        transition: background-color 0.2s;
        border: none;
        cursor: pointer;
    }

    .check-btn:hover {
        background-color: #a16207;
    }

    .quiz-container.locked-open {
        display: none;
    }

    .quiz-lock-message {
        display: none;
        background: var(--tj-quiz-bg);
        padding: 1.5em;
        border-radius: 0.5em;
        border: 1px dashed var(--tj-card-border);
        text-align: center;
        color: var(--tj-subtitle-color);
        margin-top: 2em;
    }

    .quiz-container.locked-delay {
        display: none;
    }

    .quiz-container.quiz-hidden-checked,
    .translation-details.translation-hidden-checked {
        display: none !important;
    }

    .quiz-lock-message.visible {
        display: block;
        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    /* Accordion Styling */
    details > summary::-webkit-details-marker { display: none; }
    
    details[open] summary ~ * {
        animation: sweep .3s ease-in-out;
    }

    @keyframes sweep {
        0% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    .chevron { transition: transform 0.3s; display: flex; align-items: center; }
    details[open] .chevron { transform: rotate(180deg); }

    /* Dynamic Classes */
    .playing {
        box-shadow: 0 0 0 2px #60a5fa, 0 0 0 3px var(--tj-bg-color);
    }

    .feedback-correct {
        color: #4ade80;
        font-weight: 700;
    }

    .feedback-wrong {
        color: #f87171;
        font-weight: 700;
    }

    .feedback-neutral {
        color: #9ca3af;
    }

    .book-footer {
        max-width: 48em;
        margin: 2em auto 0;
        padding: 1.5em;
        text-align: left;
        font-size: 0.875em;
        color: var(--tj-subtitle-color);
        border-top: 1px solid var(--tj-card-border);
    }

    .book-footer p {
        margin: 0.5em 0;
        line-height: 1.5;
    }

    .report-card-section {
        max-width: 48em;
        margin: 2em auto;
        background-color: var(--tj-card-bg);
        border: 1px solid var(--tj-card-border);
        padding: 2em;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px var(--tj-shadow);
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }

    .report-tally {
        font-weight: bold;
        color: var(--tj-accent-color);
        text-align: center;
        font-size: 1.25em;
    }

    .student-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
    }

    @media (max-width: 640px) {
        .student-inputs {
            grid-template-columns: 1fr;
        }
    }

    .student-inputs input {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid var(--tj-card-border);
        background: var(--tj-input-bg);
        color: var(--tj-text-color);
        font-size: 0.9em;
    }

    .student-inputs input:disabled {
        opacity: 0.7;
        background: var(--tj-btn-bg);
        cursor: not-allowed;
    }

    .report-actions {
        display: flex;
        gap: 1em;
    }

    .generate-btn {
        flex: 3;
        background-color: var(--tj-accent-color);
        color: white;
        border: none;
        padding: 0.75em;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: opacity 0.2s;
        font-size: 1em;
    }

    .reset-btn {
        flex: 1;
        background-color: #ef4444;
        color: white;
        border: none;
        padding: 0.75em;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: opacity 0.2s;
        font-size: 1em;
    }

    .generate-btn:hover, .reset-btn:hover {
        opacity: 0.9;
    }

    .report-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 1.5em;
    }

    .report-overlay.visible {
        display: flex;
    }

    .report-modal {
        background: var(--tj-card-bg);
        width: 100%;
        max-width: 550px;
        max-height: 90vh;
        border-radius: 1.5em;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--tj-card-border);
        position: relative;
    }

    .report-header {
        padding: 1.5em;
        background: var(--tj-btn-bg);
        border-bottom: 1px solid var(--tj-card-border);
        text-align: center;
    }

    .report-header h2 {
        color: var(--tj-accent-color);
        margin: 0;
        font-size: 1.5em;
    }

    .report-body {
        padding: 2em;
        overflow-y: auto;
        color: var(--tj-text-color);
    }

    .report-info-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px 20px;
        margin-bottom: 2em;
        font-size: 1em;
    }

    .report-info-label {
        font-weight: bold;
        color: var(--tj-subtitle-color);
    }

    .report-score-box {
        background: var(--tj-quiz-bg);
        padding: 1.5em;
        border-radius: 12px;
        text-align: center;
        margin-bottom: 2em;
        border: 1px solid var(--tj-card-border);
    }

    .report-score-value {
        font-size: 2.5em;
        font-weight: bold;
        color: var(--tj-accent-color);
        display: block;
    }

    .report-wrong-list {
        margin-top: 1.5em;
    }

    .report-wrong-item {
        padding: 12px;
        border-bottom: 1px solid var(--tj-card-border);
        font-size: 0.95em;
    }

    .report-wrong-item:last-child {
        border-bottom: none;
    }

    .report-wrong-chapter {
        font-size: 0.8em;
        color: var(--tj-subtitle-color);
        display: block;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .close-report-btn {
        margin: 1.5em auto;
        display: block;
        padding: 0.75em 2em;
        background: var(--tj-accent-color);
        color: white;
        border: none;
        border-radius: 9999px;
        font-weight: bold;
        cursor: pointer;
        width: fit-content;
    }

    .sticky-report.visible {
        display: block;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    /* Print Styles */
    @media print {
        /*
         * Print scoping
         * - When printing from the component's Print button, JS sets:
         *   - html.tj-print-scope
         *   - tj-chapter-book[data-tj-print-target="true"]
         * - For Ctrl/Cmd+P, you can opt-in by adding: print-scope="component".
         */
        html.tj-print-scope body * {
            visibility: hidden !important;
        }

        html.tj-print-scope tj-chapter-book[data-tj-print-target="true"],
        html.tj-print-scope tj-chapter-book[data-tj-print-target="true"] * {
            visibility: visible !important;
        }

        html.tj-print-scope tj-chapter-book[data-tj-print-target="true"] {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
        }

        tj-chapter-book {
            background: white !important;
            color: black !important;
            padding: 0 !important;
        }

        .book-header {
            padding-top: 0.5em !important;
            padding-bottom: 0.5em !important;
            page-break-after: avoid;
        }

        .header-actions, .sticky-report, .book-footer, .audio-controls {
            display: none !important;
        }

        .book-title {
            font-size: 1.5em !important;
            color: black !important;
            margin-bottom: 0.25em !important;
        }

        .book-subtitle {
            font-size: 0.9em !important;
            margin-bottom: 0.5em !important;
            color: #666 !important;
        }

        .chapters-container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .chapters-container > * + * {
            margin-top: 0.75em !important;
        }

        .chapter-card {
            background: white !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0.25em 0 !important;
            page-break-inside: avoid;
            margin-bottom: 0.35em !important;
            display: block !important;
        }

        .chapter-title {
            font-size: 0.95em !important;
            color: black !important;
            margin-bottom: 0.2em !important;
            font-weight: bold !important;
            line-height: 1.15 !important;
        }

        .chapter-text {
            font-size: 0.75em !important;
            line-height: 1.3 !important;
            margin-bottom: 0.4em !important;
            color: black !important;
        }

        .chapter-text p {
            margin-bottom: 0.3em !important;
        }

        .translation-details {
            display: none !important;
        }

        .quiz-container {
            background: white !important;
            border: none !important;
            padding: 0 !important;
            margin-top: 0.2em !important;
        }

        .quiz-title {
            display: none !important;
        }

        .question-block {
            background: white !important;
            border: none !important;
            padding: 0 !important;
            margin-bottom: 0.5em !important;
            break-inside: avoid;
        }

        .question-text {
            font-size: 0.7em !important;
            margin-bottom: 0.1em !important;
            font-weight: 600 !important;
            color: black !important;
            line-height: 1.2 !important;
        }

        .question-text::after {
            content: none !important;
        }

        .option-label {
            display: none !important;
        }

        input[type="radio"] {
            display: none !important;
        }

        .check-btn, .feedback {
            display: none !important;
        }

        /* Force content to fit in 4 pages */
        @page {
            size: A4;
            margin: 1cm;
        }
    }

    .word {
        cursor: pointer;
        padding: 0 2px;
        transition: background-color 0.2s, color 0.2s;
        border-radius: 4px;
        display: inline-block;
    }

    .word:hover {
        background-color: var(--tj-btn-hover);
        color: var(--tj-accent-color);
    }

    #voice-btn {
        background: var(--tj-btn-bg);
        border: 1px solid var(--tj-card-border);
        border-radius: 6px;
        padding: 6px;
        color: var(--tj-btn-text);
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #voice-btn:hover {
        background-color: var(--tj-btn-hover);
    }

    .voice-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(4px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1em;
    }

    .voice-overlay.visible {
        display: flex;
    }

    .voice-card {
        background: var(--tj-card-bg);
        width: 100%;
        max-width: 400px;
        max-height: 80vh;
        border-radius: 1.2em;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--tj-card-border);
    }

    .voice-card-header {
        padding: 1.25em 1.5em;
        border-bottom: 1px solid var(--tj-card-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .voice-card-header h3 {
        margin: 0;
        font-size: 1.25em;
        color: var(--tj-accent-color);
    }

    .close-voice-btn {
        background: none;
        border: none;
        color: var(--tj-text-color);
        font-size: 1.5em;
        cursor: pointer;
        padding: 0.25em;
        line-height: 1;
    }

    .voice-list {
        padding: 1em;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }

    .voice-option-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75em 1em;
        border-radius: 0.75em;
        border: 1px solid var(--tj-card-border);
        background: var(--tj-btn-bg);
        color: var(--tj-btn-text);
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        font-size: 0.95em;
    }

    .voice-option-btn:hover {
        background: var(--tj-btn-hover);
    }

    .voice-option-btn.active {
        background: var(--tj-accent-color);
        border-color: var(--tj-accent-color);
        color: white;
        font-weight: 600;
    }

    .voice-option-btn .badge {
        background: #fbbf24;
        color: #92400e;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 0.75em;
        font-weight: bold;
        text-transform: uppercase;
    }

    @media (max-width: 640px) {
        #voice-btn {
            padding: 4px;
        }
    }

    .browser-prompt-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(15, 23, 42, 0.9);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        padding: 2em;
        text-align: center;
    }

    .browser-prompt-card {
        background: white;
        color: #1e293b;
        padding: 2.5em;
        border-radius: 1.5em;
        max-width: 400px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .browser-prompt-card h2 {
        color: #b45309;
        margin-bottom: 0.5em;
        font-size: 1.5em;
    }

    .browser-prompt-card p {
        margin-bottom: 1.5em;
        line-height: 1.5;
    }

    .browser-action-btn {
        display: inline-block;
        background-color: #ca8a04;
        color: white;
        padding: 0.75em 1.5em;
        border-radius: 9999px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s;
        cursor: pointer;
    }

    .browser-action-btn:hover {
        background-color: #a16207;
    }
`;
class g extends HTMLElement {
  static chapterHasTranslation(t) {
    return !t || typeof t.translation != "string" ? !1 : t.translation.trim().length > 0;
  }
  static bookHasAnyTranslations(t) {
    return !t || !Array.isArray(t.chapters) ? !1 : t.chapters.some((o) => g.chapterHasTranslation(o));
  }
  static ensureGlobalPrintScoping() {
    g._globalPrintScopingReady || (g._globalPrintScopingReady = !0, window.addEventListener("beforeprint", () => {
      let t = document.querySelector('tj-chapter-book[data-tj-print-target="true"]');
      t || (t = document.querySelector('tj-chapter-book[print-scope="component"]'), t && t.setAttribute("data-tj-print-target", "true")), t && document.documentElement.classList.add("tj-print-scope");
    }), window.addEventListener("afterprint", () => {
      document.documentElement.classList.remove("tj-print-scope"), document.querySelectorAll('tj-chapter-book[data-tj-print-target="true"]').forEach((t) => {
        t.removeAttribute("data-tj-print-target");
      });
    }));
  }
  constructor() {
    super(), this.synth = window.speechSynthesis, this.currentUtterance = null, this.currentButtonId = null, this.isTextSwapped = !1, this.ttsState = {
      status: "idle",
      activeButtonId: null,
      activeElementId: null,
      activeRate: 1,
      activeLang: null
    }, this._ttsActionSeq = 0, this._ttsUtteranceSeq = 0, this.language = "fr-FR", this.selectedVoiceName = null, this.totalScore = 0, this.totalQuestions = 0, this.absoluteTotalQuestions = 0, this.wrongQuestions = [], this.lockoutTimers = /* @__PURE__ */ new Map();
  }
  connectedCallback() {
    this.synth && this.synth.onvoiceschanged !== void 0 && (this.synth.onvoiceschanged = () => this._updateVoiceList()), this._initVisibilityObserver();
    const t = this.getAttribute("src");
    t ? this.loadData(t) : setTimeout(() => {
      try {
        const o = JSON.parse(this.textContent);
        this.render(o);
      } catch (o) {
        console.error("Error parsing inline JSON data", o), this.innerHTML = '<p style="color: red;">Error loading book data: Invalid JSON.</p>';
      }
    }, 0);
  }
  async loadData(t) {
    try {
      const e = await (await fetch(t)).json();
      this.render(e);
    } catch (o) {
      console.error("Error loading chapter data:", o), this.innerHTML = '<p style="color: red;">Error loading book data.</p>';
    }
  }
  _getBestVoice(t) {
    if (!this.synth) return null;
    const o = this.synth.getVoices();
    if (o.length === 0) return null;
    const e = t.split(/[-_]/)[0].toLowerCase();
    let r = o.filter((a) => a.lang.toLowerCase() === t.toLowerCase());
    if (r.length === 0 && (r = o.filter((a) => a.lang.split(/[-_]/)[0].toLowerCase() === e)), r.length === 0) return null;
    const i = ["natural", "google", "premium", "siri"];
    for (const a of i) {
      const s = r.find((p) => p.name.toLowerCase().includes(a));
      if (s) return s;
    }
    return r.find((a) => !a.name.toLowerCase().includes("microsoft")) || r[0];
  }
  _showVoiceOverlay() {
    const t = this.querySelector(".voice-overlay");
    t && (t.classList.add("visible"), document.body.style.overflow = "hidden", this._updateVoiceList());
  }
  _hideVoiceOverlay() {
    const t = this.querySelector(".voice-overlay");
    t && (t.classList.remove("visible"), document.body.style.overflow = "");
  }
  _updateVoiceList() {
    if (!this.synth) return;
    const t = this.synth.getVoices(), o = this.querySelector(".voice-list"), e = this.querySelector("#voice-btn");
    if (!o || !e || t.length === 0) return;
    const r = this.language, i = r.split(/[-_]/)[0].toLowerCase(), n = t.filter((s) => s.lang.split(/[-_]/)[0].toLowerCase() === i), a = this._getBestVoice(r);
    !this.selectedVoiceName && a && (this.selectedVoiceName = a.name), o.innerHTML = "", n.sort((s, p) => s.name.localeCompare(p.name)), n.forEach((s) => {
      const p = document.createElement("button");
      p.classList.add("voice-option-btn"), this.selectedVoiceName === s.name && p.classList.add("active");
      let l = `<span>${s.name}</span>`;
      a && s.name === a.name && (l += '<span class="badge">Best</span>'), p.innerHTML = l, p.onclick = () => {
        this.selectedVoiceName = s.name, this.cancelTTS(), this._updateVoiceList(), this._hideVoiceOverlay();
      }, o.appendChild(p);
    });
  }
  _initVisibilityObserver() {
    this._visibilityObserver = new IntersectionObserver((t) => {
      t.forEach((o) => {
        const e = o.target, r = e.id, i = e.querySelector(`#quiz-${r}`);
        !o.isIntersecting && o.boundingClientRect.bottom < 0 && i && i.dataset.checked === "true" && !i.classList.contains("quiz-hidden-checked") && this._hideCheckedQuiz(e, i);
      });
    }, {
      threshold: 0,
      rootMargin: "0px"
    });
  }
  _hideCheckedQuiz(t, o) {
    const e = t.querySelector(".translation-details"), r = t.querySelector(".quiz-lock-message");
    o.offsetHeight, o.classList.add("quiz-hidden-checked"), e && (e.classList.add("translation-hidden-checked"), e.open = !1), r && (r.innerHTML = "Results Hidden"), console.log(`Hidden checked quiz for chapter ${t.id}`);
  }
  render(t) {
    if (this.hasAnyTranslations = g.bookHasAnyTranslations(t), this.absoluteTotalQuestions = 0, t.chapters && t.chapters.forEach((i) => {
      i.quiz && (this.absoluteTotalQuestions += i.quiz.length);
    }), t.language && (this.language = t.language), t.translationLanguage ? this.translationLanguage = t.translationLanguage : this.translationLanguage = this.language.startsWith("en") ? "th-TH" : "en-US", !document.getElementById("tj-chapter-book-styles")) {
      const i = document.createElement("style");
      i.id = "tj-chapter-book-styles", i.textContent = x, document.head.appendChild(i);
    }
    const o = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>', e = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>', r = '<svg width="20px" height="20px" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>swap-horizontal-circle</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M36.4,28.6l-4.9-5a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3L30.2,28H15a2,2,0,0,0,0,4H30.2l-1.6,1.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l4.9-5A1.9,1.9,0,0,0,36.4,28.6Z"></path> <path d="M33,16H17.8l1.6-1.6a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2l-4.9,5a1.9,1.9,0,0,0,0,2.8l4.9,5a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3L17.8,20H33a2,2,0,0,0,0-4Z"></path> <path d="M42,24A18,18,0,1,1,24,6,18.1,18.1,0,0,1,42,24m4,0A22,22,0,1,0,24,46,21.9,21.9,0,0,0,46,24Z"></path> </g> </g> </g></svg>';
    this.innerHTML = `
            <header class="book-header">
                <div class="header-actions">
                    ${this.shouldShowAudioControls() ? `
                    <button id="voice-btn" title="Choose Voice">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z"/>
                        </svg>
                    </button>
                    ` : ""}
                    <button id="print-toggle" class="print-toggle" aria-label="Print" title="Print friendly version">
                        ${e}
                    </button>
                    ${this.hasAnyTranslations ? `
                    <button id="lang-swap" class="lang-swap" aria-label="Swap target and translation language" title="Swap target and translation language">
                        ${r}
                    </button>
                    ` : ""}
                    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                        ${o}
                    </button>
                </div>
                <h1 class="book-title">${t.title}</h1>
                <p class="book-subtitle">${t.subtitle}</p>
            </header>

            <div class="chapters-container" translate="no">
                ${t.chapters.map((i, n) => this.renderChapter(i, n)).join("")}
            </div>

            <footer class="book-footer">
                <p>Note: I apologize for any cultural stereotypes or oversimplifications that may appear in these materials.
                My goal is to create accessible content for language learners, but I recognize this may sometimes result in generalizations.
                I welcome feedback to help me improve cultural sensitivity and accuracy.</p>
            </footer>

            <div class="report-card-section">
                <div class="report-tally">
                    Score: <span id="score-tally">0</span> / <span id="total-tally">${this.absoluteTotalQuestions}</span>
                </div>
                <div class="student-inputs">
                    <input type="text" id="student-name" placeholder="Student Name" required>
                    <input type="text" id="student-id" placeholder="Student ID" required>
                </div>
                <div class="report-actions">
                    <button class="generate-btn" id="generate-report">Generate Report Card</button>
                    <button class="reset-btn" id="reset-book">Reset Quiz</button>
                </div>
            </div>

            <div class="report-overlay">
                <div class="report-modal">
                    <div class="report-header">
                        <h2>Chapter Book Report Card</h2>
                    </div>
                    <div class="report-body">
                        <div id="report-content"></div>
                        <button class="close-report-btn">Close Report</button>
                    </div>
                </div>
            </div>

            <div class="voice-overlay">
                <div class="voice-card">
                    <div class="voice-card-header">
                        <h3>Choose Voice</h3>
                        <button class="close-voice-btn">×</button>
                    </div>
                    <div class="voice-list"></div>
                </div>
            </div>

            <div class="browser-prompt-overlay">
                <div class="browser-prompt-card">
                    <h2>Browser Support Needed</h2>
                    <p>This application works best in standard browsers like <strong>Chrome</strong> or <strong>Safari</strong> to enable high-quality text-to-speech features.</p>
                    <p>กรุณาเปิดใน Chrome หรือ Safari เพื่อใช้งานฟีเจอร์เสียงแบบเต็มรูปแบบ</p>
                    <a class="browser-action-btn">Open in Browser</a>
                </div>
            </div>

        `, this.attachEventListeners(), this._updateVoiceList(), this.checkBrowserSupport(), this.querySelectorAll(".chapter-card").forEach((i) => {
      this._visibilityObserver && this._visibilityObserver.observe(i);
    });
  }
  _getAndroidIntentLink() {
    if (!/android/i.test(navigator.userAgent)) return "";
    const e = new URL(window.location.href).toString().replace(/^https?:\/\//, ""), r = window.location.protocol.replace(":", "");
    return `intent://${e}#Intent;scheme=${r};package=com.android.chrome;end`;
  }
  checkBrowserSupport() {
    if (!this.shouldShowAudioControls()) {
      const t = this.querySelector(".browser-prompt-overlay");
      if (t) {
        t.style.display = "flex";
        const o = this._getAndroidIntentLink(), e = this.querySelector(".browser-action-btn");
        o ? (e.href = o, e.textContent = "Open in Chrome") : (e.innerHTML = 'Use Safari / Chrome<br><span style="font-size: 0.8em; font-weight: normal;">กรุณาเปิดใน Safari หรือ Chrome</span>', e.onclick = (r) => {
          r.preventDefault(), alert(`Please open this page in Safari or Chrome for audio features.

กรุณาเปิดหน้านี้ใน Safari หรือ Chrome เพื่อใช้งานฟีเจอร์เสียง`);
        });
      }
    }
  }
  shouldShowAudioControls() {
    if (!window.speechSynthesis) return !1;
    const t = navigator.userAgent.toLowerCase();
    return !(t.includes("wv") || t.includes("webview") || t.includes("instagram") || t.includes("facebook") || t.includes("line"));
  }
  renderChapter(t, o) {
    const e = `text-${t.id}`, r = `quiz-${t.id}`, i = `trans-${t.id}`, n = g.chapterHasTranslation(t), a = this.wrapWords(t.content ?? t.text), s = n ? this.wrapWords(t.translation) : "", p = s, l = t.quiz.map((f, v) => `
            <div class="question-block">
                <p class="question-text">${f.question}</p>
                ${f.options.map((y) => `
                    <label class="option-label">
                        <input type="radio" name="${t.id}-q${v}" value="${y.value}"> ${y.text}
                    </label>
                `).join("")}
                <p class="feedback"></p>
            </div>
        `).join(""), c = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>', d = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>', h = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', u = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>', m = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>';
    let b;
    if (this.shouldShowAudioControls())
      b = `
                <div class="audio-controls">
                    <button data-action="play" data-rate="1.0" data-target="${e}" id="btn-${t.id}-normal" class="audio-btn audio-btn-normal">
                        <span class="icon-wrapper">${c}</span> Normal
                    </button>
                    <button data-action="play" data-rate="0.6" data-target="${e}" id="btn-${t.id}-slow" class="audio-btn audio-btn-slow">
                        <span class="icon-wrapper">${c}</span> Slow
                    </button>
                    <button data-action="cancel-tts" id="btn-${t.id}-cancel" class="audio-btn audio-btn-cancel" aria-label="Cancel audio" title="Stop audio">
                        <span class="icon-wrapper">${d}</span> Cancel
                    </button>
                </div>`;
    else {
      const f = /android/i.test(navigator.userAgent);
      let v = "";
      if (f) {
        const w = window.location.href.replace(/^https?:\/\//, ""), k = window.location.protocol.replace(":", "");
        v = `<div style="margin-top: 0.5em;"><a href="${`intent://${w}#Intent;scheme=${k};package=com.android.chrome;end`}" style="color: var(--tj-accent-color); text-decoration: underline; font-weight: bold;">Open in Chrome</a></div>`;
      }
      b = `
                <div style="background-color: var(--tj-btn-bg); color: var(--tj-subtitle-color); padding: 0.75em; border-radius: 0.5em; border: 1px dashed var(--tj-card-border); text-align: center; font-size: 0.9em; margin-bottom: 1em;">
                    <p style="margin-bottom: 0.25em;">🎧 Audio available in Chrome or Safari</p>
                    <p>เสียงบรรยายใช้ได้ใน Chrome หรือ Safari</p>
                    ${v}
                </div>`;
    }
    return `
            <section id="${t.id}" class="chapter-card">
                <h2 class="chapter-title">${t.title}</h2>
                
                ${b}

                <template data-tj-template="main-original">${a}</template>
                ${n ? `<template data-tj-template="main-translation">${s}</template>` : ""}
                <template data-tj-template="trans-original">${a}</template>
                ${n ? `<template data-tj-template="trans-translation">${s}</template>` : ""}

                <div id="${e}" class="chapter-text">
                    ${this.isTextSwapped && n ? p : a}
                </div>

                ${n ? `
                <aside>
                <details class="translation-details group">
                    <summary class="translation-summary">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">${h} Translation</span>
                        <span class="chevron">${u}</span>
                    </summary>
                    <div style="padding: 0.5em 0.75em 0;">
                        <button data-action="play" data-rate="1.0" data-target="${i}" data-lang="${this.translationLanguage}" id="btn-trans-${t.id}" class="audio-btn audio-btn-normal" style="font-size: 0.8em; padding: 0.25em 0.5em;">
                            <span class="icon-wrapper">${c}</span> Play
                        </button>
                    </div>
                    <div id="${i}" class="translation-content">
                        ${this.isTextSwapped ? a : s}
                    </div>
                </details>
                </aside>
                ` : ""}

                <div class="quiz-container" id="${r}">
                    <h3 class="quiz-title">${m} Comprehension</h3>
                    ${l}
                    <button data-action="check-quiz" data-target="${r}" class="check-btn">Check</button>
                </div>
                <div id="lock-msg-${t.id}" class="quiz-lock-message">
                    Questions will reappear in <span class="countdown">10</span> seconds...
                </div>
            </section>
        `;
  }
  attachEventListeners() {
    g.ensureGlobalPrintScoping();
    const t = this.querySelector("#print-toggle");
    t && t.addEventListener("click", () => {
      document.querySelectorAll('tj-chapter-book[data-tj-print-target="true"]').forEach((l) => {
        l.removeAttribute("data-tj-print-target");
      }), this.setAttribute("data-tj-print-target", "true"), document.documentElement.classList.add("tj-print-scope"), window.print();
    });
    const o = this.querySelector("#lang-swap");
    o && o.addEventListener("click", () => {
      this.cancelTTS();
      const l = this.language;
      this.language = this.translationLanguage, this.translationLanguage = l, this.isTextSwapped = !this.isTextSwapped, this.applyLanguageTextSwap(), this.querySelectorAll('button[id^="btn-trans-"][data-action="play"]').forEach((c) => {
        c.dataset.lang = this.translationLanguage;
      }), this.selectedVoiceName = null, this._updateVoiceList(), this.resetApp(!0);
    });
    const e = this.querySelector("#voice-btn");
    e && e.addEventListener("click", () => {
      this._showVoiceOverlay();
    });
    const r = this.querySelector(".close-voice-btn");
    r && r.addEventListener("click", () => {
      this._hideVoiceOverlay();
    });
    const i = this.querySelector(".voice-overlay");
    i && i.addEventListener("click", (l) => {
      l.target === i && this._hideVoiceOverlay();
    });
    const n = this.querySelector("#theme-toggle");
    n && n.addEventListener("click", () => {
      this.classList.toggle("dark-theme");
      const l = this.classList.contains("dark-theme"), c = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>', d = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      n.innerHTML = l ? c : d;
    }), this.querySelectorAll('button[data-action="play"]').forEach((l) => {
      l.addEventListener("click", (c) => {
        const d = c.target.closest("button"), h = d.dataset.target, u = parseFloat(d.dataset.rate);
        this.playAudio(h, u, d.id);
      });
    }), this.querySelectorAll('button[data-action="cancel-tts"]').forEach((l) => {
      l.addEventListener("click", () => {
        this.cancelTTS();
      });
    }), this.querySelectorAll('button[data-action="check-quiz"]').forEach((l) => {
      l.addEventListener("click", (c) => {
        const d = c.target.closest("button"), h = d.dataset.target;
        this.checkRadioAnswers(h, d);
      });
    });
    const a = this.querySelector("#generate-report");
    a && a.addEventListener("click", () => this.showReportCard());
    const s = this.querySelector("#reset-book");
    s && s.addEventListener("click", () => this.resetApp());
    const p = this.querySelector(".close-report-btn");
    p && p.addEventListener("click", () => this.hideReportCard()), this.querySelectorAll(".chapter-text, .translation-content").forEach((l) => {
      l.addEventListener("click", (c) => {
        const d = c.target.closest(".word");
        if (d) {
          let h = this.language;
          l.classList.contains("translation-content") && !this.isTextSwapped ? h = this.translationLanguage : l.classList.contains("chapter-text") && this.isTextSwapped ? h = this.language : l.classList.contains("translation-content") && this.isTextSwapped && (h = this.translationLanguage), this.playWord(d.innerText, h);
        }
      });
    }), this.querySelectorAll(".translation-details").forEach((l) => {
      l.addEventListener("toggle", (c) => {
        const d = l.closest(".chapter-card");
        d && this.handleTranslationToggle(d.id, l.open);
      });
    });
  }
  wrapWords(t) {
    const o = (r) => /[\u0E00-\u0E7F]/.test(r);
    return (Array.isArray(t) ? t : [t]).map((r) => {
      if (r == null) return "";
      const i = r.replace(/<[^>]*>/g, "");
      return o(i) ? `<p>${r}</p>` : `<p>${i.split(/(\s+)/).map((s) => /\s+/.test(s) || s === "" ? s : `<span class="word">${s}</span>`).join("")}</p>`;
    }).join("");
  }
  updateIcon(t, o) {
    const e = this.querySelector(`#${t}`);
    if (!e) return;
    const r = e.querySelector(".icon-wrapper"), i = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>', n = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    o === "play" ? (r.innerHTML = i, e.classList.remove("playing")) : o === "pause" && (r.innerHTML = n, e.classList.add("playing"));
  }
  resetAllButtons() {
    this.querySelectorAll('button[data-action="play"]').forEach((t) => {
      this.updateIcon(t.id, "play");
    });
  }
  cancelTTS() {
    try {
      this.synth && this.synth.cancel();
    } finally {
      this._ttsActionSeq++, this._ttsUtteranceSeq++, this.ttsState.status = "idle", this.ttsState.activeButtonId = null, this.ttsState.activeElementId = null, this.ttsState.activeRate = 1, this.ttsState.activeLang = null, this.currentButtonId = null, this.currentUtterance = null, this.resetAllButtons();
    }
  }
  applyLanguageTextSwap() {
    this.querySelectorAll("section.chapter-card").forEach((t) => {
      const o = t.querySelector('.chapter-text[id^="text-"]'), e = t.querySelector('.translation-content[id^="trans-"]');
      if (!o || !e) return;
      const r = t.querySelector(this.isTextSwapped ? 'template[data-tj-template="main-translation"]' : 'template[data-tj-template="main-original"]'), i = t.querySelector(this.isTextSwapped ? 'template[data-tj-template="trans-original"]' : 'template[data-tj-template="trans-translation"]');
      r && (o.innerHTML = r.innerHTML), i && (e.innerHTML = i.innerHTML);
    });
  }
  handleTranslationToggle(t, o) {
    const e = this.querySelector(`#quiz-${t}`), r = this.querySelector(`#lock-msg-${t}`);
    if (!(!e || !r) && !(e.classList.contains("quiz-hidden-checked") || e.dataset.checked === "true"))
      if (this.lockoutTimers.has(t) && (clearInterval(this.lockoutTimers.get(t)), this.lockoutTimers.delete(t)), o)
        e.classList.add("locked-open"), e.classList.remove("locked-delay"), r.classList.remove("visible");
      else {
        e.classList.remove("locked-open"), e.classList.add("locked-delay");
        let i = 10;
        const n = r.querySelector(".countdown");
        n.textContent = i, r.classList.add("visible");
        const a = setInterval(() => {
          i--, i <= 0 ? (clearInterval(a), this.lockoutTimers.delete(t), e.classList.remove("locked-delay"), r.classList.remove("visible")) : n.textContent = i;
        }, 1e3);
        this.lockoutTimers.set(t, a);
      }
  }
  playAudio(t, o, e) {
    if (!(this.ttsState.activeElementId === t && this.ttsState.status !== "idle")) {
      this.cancelTTS(), this.startNewSpeech(t, o, e);
      return;
    }
    if (this.ttsState.status === "playing") {
      const i = (() => {
        const a = this.querySelector(`#${e}`);
        return a && a.dataset.lang ? a.dataset.lang : this.language;
      })();
      if (this.ttsState.activeRate !== o || this.ttsState.activeLang !== i) {
        this.cancelTTS(), this.startNewSpeech(t, o, e);
        return;
      }
      this.pauseTTS(e);
      return;
    }
    if (this.ttsState.status === "paused") {
      const i = (() => {
        const a = this.querySelector(`#${e}`);
        return a && a.dataset.lang ? a.dataset.lang : this.language;
      })();
      if (this.ttsState.activeRate !== o || this.ttsState.activeLang !== i) {
        this.cancelTTS(), this.startNewSpeech(t, o, e);
        return;
      }
      this.resumeTTS(t, o, e);
      return;
    }
    this.startNewSpeech(t, o, e);
  }
  pauseTTS(t) {
    this._ttsActionSeq++;
    try {
      this.synth && this.synth.pause();
    } catch (o) {
      console.warn("Speech pause() failed:", o);
    }
    this.ttsState.status = "paused", this.ttsState.activeButtonId = t, this.resetAllButtons();
  }
  resumeTTS(t, o, e) {
    this._ttsActionSeq++;
    const r = this._ttsActionSeq;
    this.ttsState.status = "playing", this.ttsState.activeButtonId = e, this.ttsState.activeElementId = t, this.ttsState.activeRate = o, this.updateIcon(e, "pause");
    try {
      this.synth && this.synth.resume();
    } catch (i) {
      console.warn("Speech resume() failed:", i);
    }
    window.setTimeout(() => {
      if (this._ttsActionSeq !== r) return;
      const i = !!(this.synth && this.synth.paused), n = !!(this.synth && this.synth.speaking);
      this.ttsState.status === "playing" && (i || !n) && this.startNewSpeech(t, o, e);
    }, 650);
  }
  startNewSpeech(t, o, e) {
    const r = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
    if (r.includes("wv") || r.includes("webview") || r.includes("instagram") || r.includes("facebook") || r.includes("line")) {
      this.showTTSError(e);
      return;
    }
    const i = this.querySelector(`#${t}`);
    if (!i) return;
    const n = i.innerText, a = this.querySelector(`#${e}`), s = a && a.dataset.lang ? a.dataset.lang : this.language;
    this._ttsActionSeq++, this._ttsUtteranceSeq++;
    const p = this._ttsUtteranceSeq;
    this.ttsState.status = "playing", this.ttsState.activeButtonId = e, this.ttsState.activeElementId = t, this.ttsState.activeRate = o, this.ttsState.activeLang = s;
    try {
      this.currentUtterance = new SpeechSynthesisUtterance(n);
      let c = this.synth.getVoices().find((u) => u.name === this.selectedVoiceName);
      const d = c ? c.lang.split(/[-_]/)[0].toLowerCase() : null, h = s.split(/[-_]/)[0].toLowerCase();
      (!c || d !== h) && (c = this._getBestVoice(s)), c && (this.currentUtterance.voice = c), this.currentUtterance.lang = s, this.currentUtterance.rate = o, this.currentUtterance.onend = () => {
        this._ttsUtteranceSeq === p && (this.updateIcon(e, "play"), this._ttsActionSeq++, this.ttsState.status = "idle", this.ttsState.activeButtonId = null, this.ttsState.activeElementId = null, this.ttsState.activeRate = 1, this.ttsState.activeLang = null, this.currentButtonId = null, this.currentUtterance = null);
      }, this.currentUtterance.onerror = (u) => {
        this._ttsUtteranceSeq === p && (console.error("Speech error:", u), this.updateIcon(e, "play"), this._ttsActionSeq++, this.ttsState.status = "idle", this.ttsState.activeButtonId = null, this.ttsState.activeElementId = null, this.ttsState.activeRate = 1, this.ttsState.activeLang = null, this.currentButtonId = null, u.error !== "canceled" && u.error !== "interrupted" && this.showTTSError(e));
      }, this.currentButtonId = e, this.updateIcon(e, "pause"), this.synth.speak(this.currentUtterance);
    } catch (l) {
      console.error("Speech synthesis setup error", l), this.showTTSError(e), this.updateIcon(e, "play"), this._ttsActionSeq++, this.ttsState.status = "idle", this.ttsState.activeButtonId = null, this.ttsState.activeElementId = null, this.ttsState.activeRate = 1, this.ttsState.activeLang = null;
    }
  }
  playWord(t, o) {
    if (!this.synth) return;
    const e = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    if (!e) return;
    this.synth.cancel();
    const r = new SpeechSynthesisUtterance(e);
    let n = this.synth.getVoices().find((p) => p.name === this.selectedVoiceName);
    const a = n ? n.lang.split(/[-_]/)[0].toLowerCase() : null, s = (o || this.language).split(/[-_]/)[0].toLowerCase();
    (!n || a !== s) && (n = this._getBestVoice(o || this.language)), n && (r.voice = n), r.lang = o || this.language, r.rate = 0.8, this.synth.speak(r);
  }
  showTTSError(t) {
    const o = `
            <div class="tts-error-message" style="background-color: #fee2e2; color: #991b1b; padding: 0.75em; border-radius: 0.5em; border: 1px solid #f87171; text-align: center; font-weight: 500;">
                <p style="margin-bottom: 0.5em;">⚠️ Audio not supported in this browser</p>
                <p style="font-size: 0.9em;">Please open in Chrome or Safari</p>
                <p style="font-size: 0.9em;">กรุณาเปิดใน Chrome หรือ Safari</p>
            </div>
        `;
    if (t) {
      const n = this.querySelector(`#${t}`);
      if (n) {
        const a = n.closest(".audio-controls");
        if (a) {
          a.innerHTML = o;
          return;
        }
      }
    }
    if (this.querySelector(".tts-error-message")) return;
    const e = document.createElement("div");
    e.className = "tts-error-message", e.style.cssText = `
            background-color: #fee2e2;
            color: #991b1b;
            padding: 1em;
            margin: 1em auto;
            border-radius: 0.5em;
            border: 1px solid #f87171;
            max-width: 48em;
            text-align: center;
            font-weight: 500;
        `, e.innerHTML = `
            <p>Text-to-speech is not supported in this browser. Please try opening this page in a standard browser like Chrome or Safari.</p>
            <p style="margin-top: 0.5em;">เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง กรุณาลองเปิดหน้านี้ในเบราว์เซอร์มาตรฐาน เช่น Chrome หรือ Safari</p>
            <button style="margin-top: 0.5em; background: none; border: none; color: #991b1b; text-decoration: underline; cursor: pointer;">Dismiss / ปิด</button>
        `;
    const r = e.querySelector("button");
    r.onclick = () => e.remove();
    const i = this.querySelector(".book-header");
    i ? i.after(e) : this.prepend(e);
  }
  checkRadioAnswers(t, o) {
    const e = this.querySelector(`#${t}`), r = e.closest(".chapter-card"), i = e.querySelectorAll(".question-block");
    let n = 0, a = 0, s = !0;
    if (i.forEach((c) => {
      c.querySelector('input[type="radio"]:checked') || (s = !1);
    }), !s) {
      alert("Please answer all questions before checking.");
      return;
    }
    o && (o.disabled = !0, o.textContent = "Checked", o.style.opacity = "0.7", o.style.cursor = "not-allowed"), e.dataset.checked = "true", i.forEach((c) => {
      const d = c.querySelector('input[type="radio"]:checked'), h = c.querySelector(".feedback");
      if (c.querySelectorAll('input[type="radio"]').forEach((m) => m.disabled = !0), a++, h.classList.remove("feedback-correct", "feedback-wrong", "feedback-neutral"), d.value === "correct")
        h.textContent = "Correct !", h.classList.add("feedback-correct"), n++;
      else {
        h.textContent = "Incorrect.", h.classList.add("feedback-wrong");
        const m = r ? r.querySelector(".chapter-title").innerText : "Unknown Chapter", b = c.querySelector(".question-text").innerText;
        this.wrongQuestions.push({
          question: b,
          chapter: m
        });
      }
    }), this.updateScore(n, a);
    const p = t.replace("quiz-", ""), l = this.querySelector(`#lock-msg-${p}`);
    l && (this.lockoutTimers.has(p) && (clearInterval(this.lockoutTimers.get(p)), this.lockoutTimers.delete(p)), l.innerHTML = "Answers will disappear when you scroll past.", l.classList.add("visible"));
  }
  updateScore(t, o) {
    this.totalScore = (this.totalScore || 0) + t;
    const e = this.querySelector("#score-tally"), r = this.querySelector("#total-tally");
    e && r && (e.textContent = this.totalScore, r.textContent = this.absoluteTotalQuestions);
  }
  showReportCard() {
    const t = this.querySelector("#student-name"), o = this.querySelector("#student-id"), e = t.value.trim(), r = o.value.trim();
    if (!e || !r) {
      alert("Please enter both Student Name and Student ID before generating a report card."), e ? o.focus() : t.focus();
      return;
    }
    t.disabled = !0, o.disabled = !0;
    const i = this.querySelector(".report-overlay"), n = this.querySelector("#report-content"), a = /* @__PURE__ */ new Date(), s = a.toLocaleDateString(), p = a.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), l = this.querySelector(".book-title").innerText, c = this.absoluteTotalQuestions > 0 ? Math.round(this.totalScore / this.absoluteTotalQuestions * 100) : 0;
    let d = "";
    this.wrongQuestions.length > 0 ? d = `
                <div class="report-wrong-list">
                    <h3 style="font-size: 1.1em; color: #ef4444; margin-bottom: 0.5em;">Needs Review:</h3>
                    ${this.wrongQuestions.map((h) => `
                        <div class="report-wrong-item">
                            <span class="report-wrong-chapter">${h.chapter}</span>
                            ${h.question}
                        </div>
                    `).join("")}
                </div>
            ` : this.absoluteTotalQuestions > 0 && (d = '<p style="color: #10b981; font-weight: bold; text-align: center; margin-top: 2em;">Excellent! No incorrect answers.</p>'), n.innerHTML = `
            <div class="report-info-grid">
                <span class="report-info-label">Student:</span>
                <span>${e}</span>
                <span class="report-info-label">ID:</span>
                <span>${r}</span>
                <span class="report-info-label">Book:</span>
                <span>${l}</span>
                <span class="report-info-label">Date:</span>
                <span>${s} at ${p}</span>
            </div>

            <div class="report-score-box">
                <span class="report-info-label" style="display: block; margin-bottom: 0.5em;">Final Score</span>
                <span class="report-score-value">${this.totalScore} / ${this.absoluteTotalQuestions}</span>
                <span style="font-weight: bold; color: var(--tj-accent-color); font-size: 1.25em;">${c}%</span>
            </div>

            ${d}
        `, i.classList.add("visible");
  }
  hideReportCard() {
    this.querySelector(".report-overlay").classList.remove("visible");
  }
  resetApp(t = !1) {
    if (!t && !confirm("Are you sure you want to reset everything? Your scores and progress will be lost.")) return;
    this.totalScore = 0, this.wrongQuestions = [];
    const o = this.querySelector("#student-name"), e = this.querySelector("#student-id");
    o && (o.disabled = !1, o.value = ""), e && (e.disabled = !1, e.value = "");
    const r = this.querySelector("#score-tally"), i = this.querySelector("#total-tally");
    r && (r.textContent = "0"), i && (i.textContent = this.absoluteTotalQuestions), this.querySelectorAll(".chapter-card").forEach((n) => {
      const a = `quiz-${n.id}`, s = n.querySelector(`#${a}`);
      if (s) {
        s.classList.remove("quiz-hidden-checked", "locked-open", "locked-delay"), delete s.dataset.checked;
        const c = s.querySelector('button[data-action="check-quiz"]');
        c && (c.disabled = !1, c.textContent = "Check", c.style.opacity = "1", c.style.cursor = "pointer"), s.querySelectorAll('input[type="radio"]').forEach((d) => {
          d.disabled = !1, d.checked = !1;
        }), s.querySelectorAll(".feedback").forEach((d) => {
          d.textContent = "", d.className = "feedback";
        });
      }
      const p = n.querySelector(".translation-details");
      p && (p.classList.remove("translation-hidden-checked"), p.open = !1);
      const l = n.querySelector(".quiz-lock-message");
      l && (l.classList.remove("visible"), l.textContent = "");
    }), this.lockoutTimers.forEach((n) => clearInterval(n)), this.lockoutTimers.clear(), window.scrollTo({ top: 0, behavior: "smooth" });
  }
  disconnectedCallback() {
    this.synth && this.synth.cancel(), this._visibilityObserver && this._visibilityObserver.disconnect();
  }
}
customElements.define("tj-chapter-book", g);
