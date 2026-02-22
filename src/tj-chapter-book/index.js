const styles = `
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

    .lang-selector-container {
        margin: 1.5em 0;
        text-align: center;
        width: 100%;
    }

    .lang-selector-label {
        font-weight: bold;
        color: var(--tj-subtitle-color);
        margin-bottom: 0.75em;
        font-size: 1.1em;
    }

    .lang-selector-buttons {
        display: flex;
        justify-content: center;
        gap: 1em;
        flex-wrap: wrap;
    }

    .lang-btn {
        background: var(--tj-card-bg);
        border: 2px solid var(--tj-card-border);
        color: var(--tj-text-color);
        padding: 0.75em 1.5em;
        border-radius: 9999px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .lang-btn:hover {
        border-color: var(--tj-accent-color);
    }

    .lang-btn.active {
        background: var(--tj-accent-color);
        border-color: var(--tj-accent-color);
        color: white;
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

class TjChapterBook extends HTMLElement {
    getLanguageName(localeStr) {
        if (!localeStr) return 'Unknown';
        try {
            const dn = new Intl.DisplayNames(['en'], { type: 'language' });
            return dn.of(localeStr.split(/[-_]/)[0]);
        } catch(e) {
            return localeStr;
        }
    }

    static chapterHasTranslation(chapter) {
        if (!chapter) return false;
        if (typeof chapter.translation !== 'string') return false;
        return chapter.translation.trim().length > 0;
    }

    static bookHasAnyTranslations(data) {
        if (!data || !Array.isArray(data.chapters)) return false;
        return data.chapters.some(ch => TjChapterBook.chapterHasTranslation(ch));
    }

    static ensureGlobalPrintScoping() {
        if (TjChapterBook._globalPrintScopingReady) return;
        TjChapterBook._globalPrintScopingReady = true;

        window.addEventListener('beforeprint', () => {
            // If a print target is already set, keep it.
            let target = document.querySelector('tj-chapter-book[data-tj-print-target="true"]');
            if (!target) {
                // Opt-in for Ctrl/Cmd+P when embedded in other pages.
                target = document.querySelector('tj-chapter-book[print-scope="component"]');
                if (target) target.setAttribute('data-tj-print-target', 'true');
            }

            if (target) {
                document.documentElement.classList.add('tj-print-scope');
            }
        });

        window.addEventListener('afterprint', () => {
            document.documentElement.classList.remove('tj-print-scope');
            document.querySelectorAll('tj-chapter-book[data-tj-print-target="true"]').forEach(el => {
                el.removeAttribute('data-tj-print-target');
            });
        });
    }

    constructor() {
        super();
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.currentButtonId = null;
        this.isTextSwapped = false;
        this.ttsState = {
            status: 'idle',
            activeButtonId: null,
            activeElementId: null,
            activeRate: 1.0,
            activeLang: null,
        };
        this._ttsActionSeq = 0;
        this._ttsUtteranceSeq = 0;
        this.language = 'fr-FR'; // Default language
        this.selectedVoiceName = null;
        this.totalScore = 0;
        this.totalQuestions = 0; // Legacy if needed, but we'll use absoluteTotalQuestions
        this.absoluteTotalQuestions = 0;
        this.wrongQuestions = [];
        this.lockoutTimers = new Map();
    }

    connectedCallback() {
        if (this.synth && this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._updateVoiceList();
        }

        // Initialize IntersectionObserver to hide checked quizzes when scrolled past
        this._initVisibilityObserver();

        const src = this.getAttribute('src');
        if (src) {
            this.loadData(src);
        } else {
            // Use setTimeout to ensure children (JSON content) are parsed by the browser
            requestAnimationFrame(() => {
                try {
                    const data = JSON.parse(this.textContent);
                    this.render(data);
                } catch (e) {
                    console.error('Error parsing inline JSON data', e);
                    this.innerHTML = `<p style="color: red;">Error loading book data: Invalid JSON.</p>`;
                }
            });
        }
    }

    async loadData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.render(data);
        } catch (error) {
            console.error('Error loading chapter data:', error);
            this.innerHTML = `<p style="color: red;">Error loading book data.</p>`;
        }
    }

    _getBestVoice(lang) {
        if (!this.synth) return null;
        const voices = this.synth.getVoices();
        if (voices.length === 0) return null;

        const langPrefix = lang.split(/[-_]/)[0].toLowerCase();

        // 1. Filter by language (exact match or prefix)
        let langVoices = voices.filter(v => v.lang.toLowerCase() === lang.toLowerCase());
        if (langVoices.length === 0) {
            langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
        }

        if (langVoices.length === 0) return null;

        // 2. Priority list for high-quality voices
        const priorities = ["natural", "google", "premium", "siri"];
        for (const p of priorities) {
            const found = langVoices.find(v => v.name.toLowerCase().includes(p));
            if (found) return found;
        }

        // 3. Fallback to first non-robotic voice
        const nonRobotic = langVoices.find(v => !v.name.toLowerCase().includes("microsoft"));
        return nonRobotic || langVoices[0];
    }

    _showVoiceOverlay() {
        const overlay = this.querySelector('.voice-overlay');
        if (overlay) {
            overlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
            this._updateVoiceList();
        }
    }

    _hideVoiceOverlay() {
        const overlay = this.querySelector('.voice-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    _updateVoiceList() {
        if (!this.synth) return;
        const voices = this.synth.getVoices();
        const voiceList = this.querySelector('.voice-list');
        const voiceBtn = this.querySelector('#voice-btn');
        if (!voiceList || !voiceBtn || voices.length === 0) return;

        const lang = this.language;
        const langPrefix = lang.split(/[-_]/)[0].toLowerCase();
        const langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
        const bestVoice = this._getBestVoice(lang);

        // Default to best voice if no user choice yet
        if (!this.selectedVoiceName && bestVoice) {
            this.selectedVoiceName = bestVoice.name;
        }

        voiceList.innerHTML = '';
        langVoices.sort((a, b) => a.name.localeCompare(b.name));

        langVoices.forEach(voice => {
            const btn = document.createElement('button');
            btn.classList.add('voice-option-btn');
            if (this.selectedVoiceName === voice.name) btn.classList.add('active');

            let btnContent = `<span>${voice.name}</span>`;
            if (bestVoice && voice.name === bestVoice.name) {
                btnContent += `<span class="badge">Best</span>`;
            }
            btn.innerHTML = btnContent;

            btn.onclick = () => {
                this.selectedVoiceName = voice.name;
                this.cancelTTS();
                this._updateVoiceList();
                this._hideVoiceOverlay();
            };
            voiceList.appendChild(btn);
        });
    }

    _initVisibilityObserver() {
        this._visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const chapterCard = entry.target;
                const chapterId = chapterCard.id;
                const quizContainer = chapterCard.querySelector(`#quiz-${chapterId}`);

                // If not intersecting and we scrolled PAST it (it's above us)
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                    if (quizContainer && quizContainer.dataset.checked === 'true' && !quizContainer.classList.contains('quiz-hidden-checked')) {
                        this._hideCheckedQuiz(chapterCard, quizContainer);
                    }
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px'
        });
    }

    _hideCheckedQuiz(chapterCard, quizContainer) {
        const transDetails = chapterCard.querySelector('.translation-details');
        const lockMsg = chapterCard.querySelector('.quiz-lock-message');

        // Capture height before hiding
        // We use the quiz container's height as the primary compensation measure
        const quizHeight = quizContainer.offsetHeight;

        // Add hidden classes
        quizContainer.classList.add('quiz-hidden-checked');
        if (transDetails) {
            transDetails.classList.add('translation-hidden-checked');
            transDetails.open = false;
        }

        if (lockMsg) {
            lockMsg.innerHTML = 'Results Hidden';
        }

        // In modern browsers, scroll anchoring handles the layout shift automatically.
        // Manual compensation (window.scrollBy) often causes "jumping" issues.
        console.log(`Hidden checked quiz for chapter ${chapterCard.id}`);
    }

    render(data) {
        if (!data) return;
        this.hasAnyTranslations = TjChapterBook.bookHasAnyTranslations(data);

        // Calculate absolute total questions
        this.absoluteTotalQuestions = 0;
        if (data.chapters) {
            data.chapters.forEach(chapter => {
                if (chapter.quiz) {
                    this.absoluteTotalQuestions += chapter.quiz.length;
                }
            });
        }

        // Store language if provided
        if (data.language) {
            this.language = data.language;
            this.originalLanguage = data.language;
        } else {
            this.originalLanguage = this.language;
        }

        if (data.translationLanguage) {
            this.translationLanguage = data.translationLanguage;
            this.originalTranslationLanguage = data.translationLanguage;
        } else {
            this.translationLanguage = this.language.startsWith('en') ? 'th-TH' : 'en-US';
            this.originalTranslationLanguage = this.translationLanguage;
        }

        // Inject styles if not already present
        if (!document.getElementById('tj-chapter-book-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'tj-chapter-book-styles';
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
        }

        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        const printerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`;
        const swapLangIcon = `<svg width="20px" height="20px" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>swap-horizontal-circle</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M36.4,28.6l-4.9-5a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3L30.2,28H15a2,2,0,0,0,0,4H30.2l-1.6,1.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l4.9-5A1.9,1.9,0,0,0,36.4,28.6Z"></path> <path d="M33,16H17.8l1.6-1.6a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2l-4.9,5a1.9,1.9,0,0,0,0,2.8l4.9,5a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3L17.8,20H33a2,2,0,0,0,0-4Z"></path> <path d="M42,24A18,18,0,1,1,24,6,18.1,18.1,0,0,1,42,24m4,0A22,22,0,1,0,24,46,21.9,21.9,0,0,0,46,24Z"></path> </g> </g> </g></svg>`;

        this.innerHTML = `
            <header class="book-header">
                <div class="header-actions">
                    ${this.shouldShowAudioControls() ? `
                    <button id="voice-btn" title="Choose Voice">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.77 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.17 0-7.27l-1.68 1.69zM18.42 3.7l-1.7 1.71c2.3 2 2.3 5.6 0 7.6l1.7 1.71c3.28-3.23 3.28-8.15 0-11.02z"/>
                        </svg>
                    </button>
                    ` : ''}
                    <button id="print-toggle" class="print-toggle" aria-label="Print" title="Print friendly version">
                        ${printerIcon}
                    </button>
                    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                        ${moonIcon}
                    </button>
                </div>
                <h1 class="book-title">${data.title}</h1>
                <p class="book-subtitle">${data.subtitle}</p>
                ${this.hasAnyTranslations ? `
                <div class="lang-selector-container">
                    <p class="lang-selector-label">I want to read in:</p>
                    <div class="lang-selector-buttons">
                        <button class="lang-btn ${!this.isTextSwapped ? 'active' : ''}" data-action="set-lang" data-swap="false">${this.getLanguageName(this.originalLanguage)}</button>
                        <button class="lang-btn ${this.isTextSwapped ? 'active' : ''}" data-action="set-lang" data-swap="true">${this.getLanguageName(this.originalTranslationLanguage)}</button>
                    </div>
                </div>
                ` : ''}
            </header>

            <div class="chapters-container" translate="no">
                ${data.chapters ? data.chapters.map((chapter, index) => this.renderChapter(chapter, index)).join('') : '<p>No chapters found.</p>'}
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

        `;

        this.attachEventListeners();
        this._updateVoiceList();
        this.checkBrowserSupport();

        // Start observing chapters for scroll-past behavior
        this.querySelectorAll('.chapter-card').forEach(card => {
            if (this._visibilityObserver) {
                this._visibilityObserver.observe(card);
            }
        });
    }

    _getAndroidIntentLink() {
        const isAndroid = /android/i.test(navigator.userAgent);
        if (!isAndroid) return '';

        const url = new URL(window.location.href);
        const urlNoScheme = url.toString().replace(/^https?:\/\//, '');
        const scheme = window.location.protocol.replace(':', '');

        return `intent://${urlNoScheme}#Intent;scheme=${scheme};package=com.android.chrome;end`;
    }

    checkBrowserSupport() {
        if (!this.shouldShowAudioControls()) {
            const overlay = this.querySelector('.browser-prompt-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
                const androidLink = this._getAndroidIntentLink();
                const actionBtn = this.querySelector('.browser-action-btn');

                if (androidLink) {
                    actionBtn.href = androidLink;
                    actionBtn.textContent = 'Open in Chrome';
                } else {
                    // iOS or fallback: manual prompt
                    actionBtn.innerHTML = 'Use Safari / Chrome<br><span style="font-size: 0.8em; font-weight: normal;">กรุณาเปิดใน Safari หรือ Chrome</span>';
                    actionBtn.onclick = (e) => {
                        e.preventDefault();
                        alert('Please open this page in Safari or Chrome for audio features.\n\nกรุณาเปิดหน้านี้ใน Safari หรือ Chrome เพื่อใช้งานฟีเจอร์เสียง');
                    };
                }
            }
        }
    }

    shouldShowAudioControls() {
        if (!window.speechSynthesis) return false;

        const ua = navigator.userAgent.toLowerCase();

        // Block known in-app browsers and WebViews
        if (ua.includes("wv") || ua.includes("webview") ||
            ua.includes("instagram") || ua.includes("facebook") ||
            ua.includes("line")) {
            return false;
        }

        return true;
    }

    renderChapter(chapter, index) {
        const textId = `text-${chapter.id}`;
        const quizId = `quiz-${chapter.id}`;
        const translationId = `trans-${chapter.id}`;

        const chapterHasTranslation = TjChapterBook.chapterHasTranslation(chapter);

        const contentHtml = this.wrapWords(chapter.content ?? chapter.text);
        const translatedContentHtml = chapterHasTranslation ? this.wrapWords(chapter.translation) : '';

        const translationAsMainHtml = translatedContentHtml;

        const quizHtml = chapter.quiz.map((q, qIndex) => `
            <div class="question-block">
                <p class="question-text">${q.question}</p>
                ${q.options.map(opt => `
                    <label class="option-label">
                        <input type="radio" name="${chapter.id}-q${qIndex}" value="${opt.value}"> ${opt.text}
                    </label>
                `).join('')}
                <p class="feedback"></p>
            </div>
        `).join('');

        const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        const stopIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>`;
        const langIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
        const chevronIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        const pencilIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;

        let audioControls;
        if (this.shouldShowAudioControls()) {
            audioControls = `
                <div class="audio-controls">
                    <button data-action="play" data-rate="1.0" data-target="${textId}" id="btn-${chapter.id}-normal" class="audio-btn audio-btn-normal">
                        <span class="icon-wrapper">${playIcon}</span> Normal
                    </button>
                    <button data-action="play" data-rate="0.6" data-target="${textId}" id="btn-${chapter.id}-slow" class="audio-btn audio-btn-slow">
                        <span class="icon-wrapper">${playIcon}</span> Slow
                    </button>
                    <button data-action="cancel-tts" id="btn-${chapter.id}-cancel" class="audio-btn audio-btn-cancel" aria-label="Cancel audio" title="Stop audio">
                        <span class="icon-wrapper">${stopIcon}</span> Cancel
                    </button>
                </div>`;
        } else {
            const isAndroid = /android/i.test(navigator.userAgent);
            let actionBtn = '';
            if (isAndroid) {
                const url = window.location.href;
                const urlNoScheme = url.replace(/^https?:\/\//, '');
                const scheme = window.location.protocol.replace(':', '');
                // Android Intent to open in Chrome
                const intentUrl = `intent://${urlNoScheme}#Intent;scheme=${scheme};package=com.android.chrome;end`;
                actionBtn = `<div style="margin-top: 0.5em;"><a href="${intentUrl}" style="color: var(--tj-accent-color); text-decoration: underline; font-weight: bold;">Open in Chrome</a></div>`;
            }

            audioControls = `
                <div style="background-color: var(--tj-btn-bg); color: var(--tj-subtitle-color); padding: 0.75em; border-radius: 0.5em; border: 1px dashed var(--tj-card-border); text-align: center; font-size: 0.9em; margin-bottom: 1em;">
                    <p style="margin-bottom: 0.25em;">🎧 Audio available in Chrome or Safari</p>
                    <p>เสียงบรรยายใช้ได้ใน Chrome หรือ Safari</p>
                    ${actionBtn}
                </div>`;
        }

        return `
            <section id="${chapter.id}" class="chapter-card">
                <h2 class="chapter-title">${chapter.title}</h2>
                
                ${audioControls}

                <template data-tj-template="main-original">${contentHtml}</template>
                ${chapterHasTranslation ? `<template data-tj-template="main-translation">${translatedContentHtml}</template>` : ''}
                <template data-tj-template="trans-original">${contentHtml}</template>
                ${chapterHasTranslation ? `<template data-tj-template="trans-translation">${translatedContentHtml}</template>` : ''}

                <div id="${textId}" class="chapter-text">
                    ${(this.isTextSwapped && chapterHasTranslation) ? translationAsMainHtml : contentHtml}
                </div>

                ${chapterHasTranslation ? `
                <aside id="trans-aside-${chapter.id}" style="display: none;">
                <details class="translation-details group">
                    <summary class="translation-summary">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">${langIcon} Translation</span>
                        <span class="chevron">${chevronIcon}</span>
                    </summary>
                    <div style="padding: 0.5em 0.75em 0;">
                        <button data-action="play" data-rate="1.0" data-target="${translationId}" data-lang="${this.translationLanguage}" id="btn-trans-${chapter.id}" class="audio-btn audio-btn-normal" style="font-size: 0.8em; padding: 0.25em 0.5em;">
                            <span class="icon-wrapper">${playIcon}</span> Play
                        </button>
                    </div>
                    <div id="${translationId}" class="translation-content">
                        ${this.isTextSwapped ? contentHtml : translatedContentHtml}
                    </div>
                </details>
                </aside>
                ` : ''}

                <div class="quiz-container" id="${quizId}">
                    <h3 class="quiz-title">${pencilIcon} Comprehension</h3>
                    ${quizHtml}
                    <button data-action="check-quiz" data-target="${quizId}" class="check-btn">Check</button>
                </div>
                <div id="lock-msg-${chapter.id}" class="quiz-lock-message" style="display: none;">
                    Answers will disappear when you scroll past.
                </div>
            </section>
        `;
    }

    attachEventListeners() {
        TjChapterBook.ensureGlobalPrintScoping();

        // Print button
        const printToggle = this.querySelector('#print-toggle');
        if (printToggle) {
            printToggle.addEventListener('click', () => {
                document.querySelectorAll('tj-chapter-book[data-tj-print-target="true"]').forEach(el => {
                    el.removeAttribute('data-tj-print-target');
                });
                this.setAttribute('data-tj-print-target', 'true');
                document.documentElement.classList.add('tj-print-scope');
                window.print();
            });
        }

        // Swap target/translation languages (TTS)
        this.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetSwap = btn.dataset.swap === 'true';
                if (this.isTextSwapped !== targetSwap) {
                    this.cancelTTS();

                    const prevTarget = this.language;
                    this.language = this.translationLanguage;
                    this.translationLanguage = prevTarget;

                    this.isTextSwapped = targetSwap;
                    this.applyLanguageTextSwap();

                    this.querySelectorAll('button[id^="btn-trans-"][data-action="play"]').forEach(b => {
                        b.dataset.lang = this.translationLanguage;
                    });

                    this.selectedVoiceName = null;
                    this._updateVoiceList();

                    this.querySelectorAll('.lang-btn').forEach(b => {
                        b.classList.toggle('active', b.dataset.swap === String(this.isTextSwapped));
                    });

                    this.resetApp(true);
                }
            });
        });

        // Voice selection button
        const voiceBtn = this.querySelector('#voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this._showVoiceOverlay();
            });
        }

        // Voice overlay close
        const closeVoiceBtn = this.querySelector('.close-voice-btn');
        if (closeVoiceBtn) {
            closeVoiceBtn.addEventListener('click', () => {
                this._hideVoiceOverlay();
            });
        }

        // Close overlay on click outside card
        const voiceOverlay = this.querySelector('.voice-overlay');
        if (voiceOverlay) {
            voiceOverlay.addEventListener('click', (e) => {
                if (e.target === voiceOverlay) {
                    this._hideVoiceOverlay();
                }
            });
        }

        // Theme toggle
        const themeToggle = this.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.classList.toggle('dark-theme');
                const isDark = this.classList.contains('dark-theme');

                const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
                const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

                themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
            });
        }

        // Audio buttons
        this.querySelectorAll('button[data-action="play"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Handle click on icon inside button
                const button = e.target.closest('button');
                const targetId = button.dataset.target;
                const rate = parseFloat(button.dataset.rate);
                this.playAudio(targetId, rate, button.id);
            });
        });

        // Cancel TTS buttons
        this.querySelectorAll('button[data-action="cancel-tts"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.cancelTTS();
            });
        });

        // Quiz buttons
        this.querySelectorAll('button[data-action="check-quiz"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                const targetId = button.dataset.target;
                this.checkRadioAnswers(targetId, button);
            });
        });

        // Report Card Actions
        const generateBtn = this.querySelector('#generate-report');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.showReportCard());
        }

        const resetBtn = this.querySelector('#reset-book');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetApp());
        }

        const closeReportBtn = this.querySelector('.close-report-btn');
        if (closeReportBtn) {
            closeReportBtn.addEventListener('click', () => this.hideReportCard());
        }

        // Clickable words
        this.querySelectorAll('.chapter-text, .translation-content').forEach(container => {
            container.addEventListener('click', (e) => {
                const wordEl = e.target.closest('.word');
                if (wordEl) {
                    // Determine which language to use
                    let lang = this.language;
                    if (container.classList.contains('translation-content') && !this.isTextSwapped) {
                        lang = this.translationLanguage;
                    } else if (container.classList.contains('chapter-text') && this.isTextSwapped) {
                        // When swapped, chapter-text contains translation language text
                        // Wait, no. language/translationLanguage are also swapped!
                        // So this.language ALWAYS points to what's in chapter-text.
                        lang = this.language;
                    } else if (container.classList.contains('translation-content') && this.isTextSwapped) {
                        // Swapped: translation-content contains original language text
                        lang = this.translationLanguage;
                    }

                    this.playWord(wordEl.innerText, lang);
                }
            });
        });

        // Translation toggle (lockout mechanism)
        this.querySelectorAll('.translation-details').forEach(details => {
            details.addEventListener('toggle', (e) => {
                const chapterCard = details.closest('.chapter-card');
                if (chapterCard) {
                    this.handleTranslationToggle(chapterCard.id, details.open);
                }
            });
        });
    }

    wrapWords(content) {
        const isThai = (text) => /[\u0E00-\u0E7F]/.test(text);

        // Handle both single string and array of strings
        const paragraphs = Array.isArray(content) ? content : [content];

        return paragraphs.map(p => {
            if (p == null) return '';
            // Strip existing HTML tags if any (basic approach)
            const plainText = p.replace(/<[^>]*>/g, '');

            if (isThai(plainText)) {
                return `<p>${p}</p>`;
            } else {
                // Split by spaces but preserve them as part of the structure
                const tokens = plainText.split(/(\s+)/);
                const wrappedTokens = tokens.map(token => {
                    if (/\s+/.test(token) || token === "") {
                        return token;
                    }
                    return `<span class="word">${token}</span>`;
                });
                return `<p>${wrappedTokens.join('')}</p>`;
            }
        }).join('');
    }

    updateIcon(btnId, type) {
        const btn = this.querySelector(`#${btnId}`);
        if (!btn) return;
        const iconWrapper = btn.querySelector('.icon-wrapper');

        const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

        if (type === 'play') {
            iconWrapper.innerHTML = playIcon;
            btn.classList.remove('playing');
        } else if (type === 'pause') {
            iconWrapper.innerHTML = pauseIcon;
            btn.classList.add('playing');
        }
    }

    resetAllButtons() {
        this.querySelectorAll('button[data-action="play"]').forEach(btn => {
            this.updateIcon(btn.id, 'play');
        });
    }

    cancelTTS() {
        try {
            if (this.synth) this.synth.cancel();
        } finally {
            this._ttsActionSeq++;
            this._ttsUtteranceSeq++;
            this.ttsState.status = 'idle';
            this.ttsState.activeButtonId = null;
            this.ttsState.activeElementId = null;
            this.ttsState.activeRate = 1.0;
            this.ttsState.activeLang = null;
            this.currentButtonId = null;
            this.currentUtterance = null;
            this.resetAllButtons();
        }
    }

    applyLanguageTextSwap() {
        // Swap chapter text vs translation text in-place, without re-rendering quizzes.
        this.querySelectorAll('section.chapter-card').forEach(section => {
            const main = section.querySelector('.chapter-text[id^="text-"]');
            const trans = section.querySelector('.translation-content[id^="trans-"]');
            if (!main || !trans) return;

            const mainTpl = section.querySelector(this.isTextSwapped
                ? 'template[data-tj-template="main-translation"]'
                : 'template[data-tj-template="main-original"]');
            const transTpl = section.querySelector(this.isTextSwapped
                ? 'template[data-tj-template="trans-original"]'
                : 'template[data-tj-template="trans-translation"]');

            if (mainTpl) main.innerHTML = mainTpl.innerHTML;
            if (transTpl) trans.innerHTML = transTpl.innerHTML;
        });
    }

    handleTranslationToggle(chapterId, isOpen) {
        // Feature removed: No longer lock the quiz when translation is opened.
    }

    playAudio(elementId, rate, btnId) {
        // Prefer our own state machine; some browsers report paused/speaking unreliably.
        // Treat Normal/Slow as controls for the same target text; allow toggling by target.
        const isSameTarget = this.ttsState.activeElementId === elementId && this.ttsState.status !== 'idle';

        if (!isSameTarget) {
            this.cancelTTS();
            this.startNewSpeech(elementId, rate, btnId);
            return;
        }

        // Same target currently active.
        if (this.ttsState.status === 'playing') {
            // If user clicks a different rate/lang while playing, immediately switch by cancel+restart.
            const clickedLang = (() => {
                const btn = this.querySelector(`#${btnId}`);
                return btn && btn.dataset.lang ? btn.dataset.lang : this.language;
            })();

            const needsSwitch = this.ttsState.activeRate !== rate || this.ttsState.activeLang !== clickedLang;
            if (needsSwitch) {
                this.cancelTTS();
                this.startNewSpeech(elementId, rate, btnId);
                return;
            }

            this.pauseTTS(btnId);
            return;
        }

        if (this.ttsState.status === 'paused') {
            // If user clicks a different rate/lang button while paused, restart with new settings.
            const clickedLang = (() => {
                const btn = this.querySelector(`#${btnId}`);
                return btn && btn.dataset.lang ? btn.dataset.lang : this.language;
            })();

            const needsRestart = this.ttsState.activeRate !== rate || this.ttsState.activeLang !== clickedLang;
            if (needsRestart) {
                this.cancelTTS();
                this.startNewSpeech(elementId, rate, btnId);
                return;
            }

            this.resumeTTS(elementId, rate, btnId);
            return;
        }

        // idle (shouldn't happen when isSameTarget is true, but keep it safe)
        this.startNewSpeech(elementId, rate, btnId);
    }

    pauseTTS(btnId) {
        this._ttsActionSeq++;
        try {
            if (this.synth) this.synth.pause();
        } catch (e) {
            console.warn('Speech pause() failed:', e);
        }
        this.ttsState.status = 'paused';
        this.ttsState.activeButtonId = btnId;
        this.resetAllButtons();
    }

    resumeTTS(elementId, rate, btnId) {
        // Some environments are flaky about resume(); attempt resume, then fall back to restart.
        this._ttsActionSeq++;
        const seq = this._ttsActionSeq;

        this.ttsState.status = 'playing';
        this.ttsState.activeButtonId = btnId;
        this.ttsState.activeElementId = elementId;
        this.ttsState.activeRate = rate;
        // activeLang remains whatever started the utterance; rate/lang changes while paused restart instead.
        this.updateIcon(btnId, 'pause');

        try {
            if (this.synth) this.synth.resume();
        } catch (e) {
            console.warn('Speech resume() failed:', e);
        }

        window.setTimeout(() => {
            // Guard: only act if no other TTS action has happened since.
            if (this._ttsActionSeq !== seq) return;

            // If we tried to resume but it's still paused/not-speaking, restart.
            // We still consult synth as a heuristic, but we don't *depend* on it.
            const synthPaused = !!(this.synth && this.synth.paused);
            const synthSpeaking = !!(this.synth && this.synth.speaking);

            if (this.ttsState.status === 'playing' && (synthPaused || !synthSpeaking)) {
                this.startNewSpeech(elementId, rate, btnId);
            }
        }, 650);
    }

    startNewSpeech(elementId, rate, btnId) {
        // Check for in-app browsers which often have broken TTS
        const userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

        // Common in-app browser identifiers
        if (userAgent.includes("wv") || userAgent.includes("webview") ||
            userAgent.includes("instagram") || userAgent.includes("facebook") ||
            userAgent.includes("line")) {
            this.showTTSError(btnId);
            return;
        }

        const element = this.querySelector(`#${elementId}`);
        if (!element) return;

        const text = element.innerText;
        const btn = this.querySelector(`#${btnId}`);
        const lang = btn && btn.dataset.lang ? btn.dataset.lang : this.language;

        this._ttsActionSeq++;
        this._ttsUtteranceSeq++;
        const utteranceSeq = this._ttsUtteranceSeq;
        this.ttsState.status = 'playing';
        this.ttsState.activeButtonId = btnId;
        this.ttsState.activeElementId = elementId;
        this.ttsState.activeRate = rate;
        this.ttsState.activeLang = lang;

        try {
            this.currentUtterance = new SpeechSynthesisUtterance(text);

            const voices = this.synth.getVoices();
            let voice = voices.find(v => v.name === this.selectedVoiceName);

            // If the selected voice doesn't match the current language, or isn't found, find best voice
            const voiceLangPrefix = voice ? voice.lang.split(/[-_]/)[0].toLowerCase() : null;
            const targetLangPrefix = lang.split(/[-_]/)[0].toLowerCase();

            if (!voice || voiceLangPrefix !== targetLangPrefix) {
                voice = this._getBestVoice(lang);
            }

            if (voice) {
                this.currentUtterance.voice = voice;
            }

            // Always set lang (critical for Android stability)
            this.currentUtterance.lang = lang;

            this.currentUtterance.rate = rate;

            this.currentUtterance.onend = () => {
                if (this._ttsUtteranceSeq !== utteranceSeq) return;
                this.updateIcon(btnId, 'play');
                this._ttsActionSeq++;
                this.ttsState.status = 'idle';
                this.ttsState.activeButtonId = null;
                this.ttsState.activeElementId = null;
                this.ttsState.activeRate = 1.0;
                this.ttsState.activeLang = null;
                this.currentButtonId = null;
                this.currentUtterance = null;
            };

            this.currentUtterance.onerror = (e) => {
                if (this._ttsUtteranceSeq !== utteranceSeq) return;
                console.error('Speech error:', e);
                this.updateIcon(btnId, 'play');
                this._ttsActionSeq++;
                this.ttsState.status = 'idle';
                this.ttsState.activeButtonId = null;
                this.ttsState.activeElementId = null;
                this.ttsState.activeRate = 1.0;
                this.ttsState.activeLang = null;
                this.currentButtonId = null;

                // Show error if not just canceled/interrupted
                if (e.error !== 'canceled' && e.error !== 'interrupted') {
                    this.showTTSError(btnId);
                }
            }

            this.currentButtonId = btnId;
            this.updateIcon(btnId, 'pause');
            this.synth.speak(this.currentUtterance);
        } catch (e) {
            console.error("Speech synthesis setup error", e);
            this.showTTSError(btnId);
            this.updateIcon(btnId, 'play');
            this._ttsActionSeq++;
            this.ttsState.status = 'idle';
            this.ttsState.activeButtonId = null;
            this.ttsState.activeElementId = null;
            this.ttsState.activeRate = 1.0;
            this.ttsState.activeLang = null;
        }
    }

    playWord(word, lang) {
        if (!this.synth) return;

        // Strip punctuation for better TTS
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
        if (!cleanWord) return;

        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanWord);

        const voices = this.synth.getVoices();
        let voice = voices.find(v => v.name === this.selectedVoiceName);

        const voiceLangPrefix = voice ? voice.lang.split(/[-_]/)[0].toLowerCase() : null;
        const targetLangPrefix = (lang || this.language).split(/[-_]/)[0].toLowerCase();

        if (!voice || voiceLangPrefix !== targetLangPrefix) {
            voice = this._getBestVoice(lang || this.language);
        }

        if (voice) {
            utterance.voice = voice;
        }

        // Always set lang (critical for Android stability)
        utterance.lang = lang || this.language;

        utterance.rate = 0.8; // Slightly slower for individual words

        this.synth.speak(utterance);
    }

    showTTSError(btnId) {
        const errorHtml = `
            <div class="tts-error-message" style="background-color: #fee2e2; color: #991b1b; padding: 0.75em; border-radius: 0.5em; border: 1px solid #f87171; text-align: center; font-weight: 500;">
                <p style="margin-bottom: 0.5em;">⚠️ Audio not supported in this browser</p>
                <p style="font-size: 0.9em;">Please open in Chrome or Safari</p>
                <p style="font-size: 0.9em;">กรุณาเปิดใน Chrome หรือ Safari</p>
            </div>
        `;

        if (btnId) {
            const btn = this.querySelector(`#${btnId}`);
            if (btn) {
                const container = btn.closest('.audio-controls');
                if (container) {
                    container.innerHTML = errorHtml;
                    return;
                }
            }
        }

        // Fallback global message
        if (this.querySelector('.tts-error-message')) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'tts-error-message';
        errorDiv.style.cssText = `
            background-color: #fee2e2;
            color: #991b1b;
            padding: 1em;
            margin: 1em auto;
            border-radius: 0.5em;
            border: 1px solid #f87171;
            max-width: 48em;
            text-align: center;
            font-weight: 500;
        `;
        errorDiv.innerHTML = `
            <p>Text-to-speech is not supported in this browser. Please try opening this page in a standard browser like Chrome or Safari.</p>
            <p style="margin-top: 0.5em;">เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง กรุณาลองเปิดหน้านี้ในเบราว์เซอร์มาตรฐาน เช่น Chrome หรือ Safari</p>
            <button style="margin-top: 0.5em; background: none; border: none; color: #991b1b; text-decoration: underline; cursor: pointer;">Dismiss / ปิด</button>
        `;

        const closeBtn = errorDiv.querySelector('button');
        closeBtn.onclick = () => errorDiv.remove();

        const header = this.querySelector('.book-header');
        if (header) {
            header.after(errorDiv);
        } else {
            this.prepend(errorDiv);
        }
    }

    checkRadioAnswers(quizId, btn) {
        const quizContainer = this.querySelector(`#${quizId}`);
        const chapterCard = quizContainer.closest('.chapter-card');
        const questionBlocks = quizContainer.querySelectorAll('.question-block');
        let chapterScore = 0;
        let chapterTotal = 0;
        let allAnswered = true;

        // First check if all are answered
        questionBlocks.forEach(block => {
            const selectedOption = block.querySelector('input[type="radio"]:checked');
            if (!selectedOption) allAnswered = false;
        });

        if (!allAnswered) {
            alert("Please answer all questions before checking.");
            return;
        }

        // Disable button
        if (btn) {
            btn.disabled = true;
            btn.textContent = "Checked";
            btn.style.opacity = "0.7";
            btn.style.cursor = "not-allowed";
        }

        quizContainer.dataset.checked = "true";

        questionBlocks.forEach(block => {
            const selectedOption = block.querySelector('input[type="radio"]:checked');
            const feedback = block.querySelector('.feedback');
            const inputs = block.querySelectorAll('input[type="radio"]');

            // Disable inputs
            inputs.forEach(input => input.disabled = true);

            chapterTotal++;

            // Clear previous styles
            feedback.classList.remove('feedback-correct', 'feedback-wrong', 'feedback-neutral');

            if (selectedOption.value === "correct") {
                feedback.textContent = "Correct !";
                feedback.classList.add('feedback-correct');
                chapterScore++;
            } else {
                feedback.textContent = "Incorrect.";
                feedback.classList.add('feedback-wrong');

                // Track wrong question
                const chapterTitle = chapterCard ? chapterCard.querySelector('.chapter-title').innerText : 'Unknown Chapter';
                const questionText = block.querySelector('.question-text').innerText;

                this.wrongQuestions.push({
                    question: questionText,
                    chapter: chapterTitle
                });
            }
        });

        this.updateScore(chapterScore, chapterTotal);

        // Notify user that questions will disappear on scroll
        const chapterId = quizId.replace('quiz-', '');
        const lockMsg = this.querySelector(`#lock-msg-${chapterId}`);
        const transAside = chapterCard.querySelector(`#trans-aside-${chapterId}`);

        if (transAside) {
            transAside.style.display = 'block';
        }

        if (lockMsg) {
            lockMsg.innerHTML = `Answers and translation will disappear when you scroll past.`;
            lockMsg.classList.add('visible');
            lockMsg.style.display = 'block';
        }
    }

    updateScore(chapterScore, chapterTotal) {
        this.totalScore = (this.totalScore || 0) + chapterScore;

        const scoreSpan = this.querySelector('#score-tally');
        const totalSpan = this.querySelector('#total-tally');

        if (scoreSpan && totalSpan) {
            scoreSpan.textContent = this.totalScore;
            totalSpan.textContent = this.absoluteTotalQuestions;
        }
    }

    showReportCard() {
        const nameInput = this.querySelector('#student-name');
        const idInput = this.querySelector('#student-id');
        const name = nameInput.value.trim();
        const studentId = idInput.value.trim();

        if (!name || !studentId) {
            alert("Please enter both Student Name and Student ID before generating a report card.");
            if (!name) nameInput.focus();
            else idInput.focus();
            return;
        }

        // Lock inputs
        nameInput.disabled = true;
        idInput.disabled = true;

        const overlay = this.querySelector('.report-overlay');
        const content = this.querySelector('#report-content');

        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const bookTitle = this.querySelector('.book-title').innerText;
        const percentage = this.absoluteTotalQuestions > 0 ? Math.round((this.totalScore / this.absoluteTotalQuestions) * 100) : 0;

        let wrongListHtml = '';
        if (this.wrongQuestions.length > 0) {
            wrongListHtml = `
                <div class="report-wrong-list">
                    <h3 style="font-size: 1.1em; color: #ef4444; margin-bottom: 0.5em;">Needs Review:</h3>
                    ${this.wrongQuestions.map(item => `
                        <div class="report-wrong-item">
                            <span class="report-wrong-chapter">${item.chapter}</span>
                            ${item.question}
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (this.absoluteTotalQuestions > 0) {
            wrongListHtml = `<p style="color: #10b981; font-weight: bold; text-align: center; margin-top: 2em;">Excellent! No incorrect answers.</p>`;
        }

        content.innerHTML = `
            <div class="report-info-grid">
                <span class="report-info-label">Student:</span>
                <span>${name}</span>
                <span class="report-info-label">ID:</span>
                <span>${studentId}</span>
                <span class="report-info-label">Book:</span>
                <span>${bookTitle}</span>
                <span class="report-info-label">Date:</span>
                <span>${dateStr} at ${timeStr}</span>
            </div>

            <div class="report-score-box">
                <span class="report-info-label" style="display: block; margin-bottom: 0.5em;">Final Score</span>
                <span class="report-score-value">${this.totalScore} / ${this.absoluteTotalQuestions}</span>
                <span style="font-weight: bold; color: var(--tj-accent-color); font-size: 1.25em;">${percentage}%</span>
            </div>

            ${wrongListHtml}
        `;

        overlay.classList.add('visible');
    }

    hideReportCard() {
        const overlay = this.querySelector('.report-overlay');
        overlay.classList.remove('visible');
    }

    resetApp(skipConfirmation = false) {
        if (!skipConfirmation && !confirm("Are you sure you want to reset everything? Your scores and progress will be lost.")) return;

        // Reset state
        this.totalScore = 0;
        this.wrongQuestions = [];

        // Unlock and clear inputs
        const nameInput = this.querySelector('#student-name');
        const idInput = this.querySelector('#student-id');
        if (nameInput) {
            nameInput.disabled = false;
            nameInput.value = '';
        }
        if (idInput) {
            idInput.disabled = false;
            idInput.value = '';
        }

        // Reset Tally UI
        const scoreSpan = this.querySelector('#score-tally');
        const totalSpan = this.querySelector('#total-tally');
        if (scoreSpan) scoreSpan.textContent = "0";
        if (totalSpan) totalSpan.textContent = this.absoluteTotalQuestions;

        // Reset All Chapters
        this.querySelectorAll('.chapter-card').forEach(card => {
            // Re-enable quizzes
            const quizId = `quiz-${card.id}`;
            const quizContainer = card.querySelector(`#${quizId}`);
            if (quizContainer) {
                quizContainer.classList.remove('quiz-hidden-checked', 'locked-open', 'locked-delay');
                delete quizContainer.dataset.checked;

                // Re-enable "Check" button
                const checkBtn = quizContainer.querySelector('button[data-action="check-quiz"]');
                if (checkBtn) {
                    checkBtn.disabled = false;
                    checkBtn.textContent = "Check";
                    checkBtn.style.opacity = "1";
                    checkBtn.style.cursor = "pointer";
                }

                // Re-enable radio buttons and clear selection
                quizContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.disabled = false;
                    radio.checked = false;
                });

                // Clear feedbacks
                quizContainer.querySelectorAll('.feedback').forEach(f => {
                    f.textContent = '';
                    f.className = 'feedback';
                });
            }

            // Reset translation visibility
            const transDetails = card.querySelector('.translation-details');
            if (transDetails) {
                transDetails.classList.remove('translation-hidden-checked');
                transDetails.open = false;
            }

            // Reset lock messages
            const lockMsg = card.querySelector('.quiz-lock-message');
            if (lockMsg) {
                lockMsg.classList.remove('visible');
                lockMsg.textContent = '';
            }
        });

        // Clear all lockout timers
        this.lockoutTimers.forEach((timer) => clearInterval(timer));
        this.lockoutTimers.clear();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    disconnectedCallback() {
        if (this.synth) {
            this.synth.cancel();
        }
        if (this._visibilityObserver) {
            this._visibilityObserver.disconnect();
        }
    }
}

customElements.define('tj-chapter-book', TjChapterBook);
