
class TjQuizElement extends HTMLElement {
    static get observedAttributes() {
        return ['submission-url'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.questionBank = [];
        this.passages = []; // support multiple text sections
        this.instructions = []; // store instruction-only sections
        this.questionGroups = []; // questions grouped by preceding text section (sectionId) or null for global
        this.orderedSections = []; // preserve original section order
        this.currentQuestions = [];
        this.score = 0;
        this.questionsAnswered = 0;
        this.questionsToDisplay = 5;
        this.totalQuestions = 0; // Will be set based on actual question count
        this.audioPlayer = null;
        this.utterance = null;
        this.audioSrc = '';
        this.currentAudioButton = null; // currently-playing passage audio button (for icon state)
        this.submissionUrl = ''; // Set via submission-url attribute
        this.title = '';
        this.passage = '';
        this.vocabularySections = []; // Array of vocabulary sections
        this.vocabUserChoices = {}; // Track what user selected for each word (section-word key)
        this.vocabScore = 0;
        this.vocabSubmitted = false; // Track if vocab answers have been submitted
        this.clozeSections = []; // Array of cloze sections
        this.clozeAnswers = {}; // User's answers for each blank (section-blank key)
        this.clozeScore = 0;
        this.clozeSubmitted = false;
        this.userQuestionAnswers = {}; // map questionIndex -> selected value (for MC questions)
        this.quizUnlocked = false; // track whether students completed the info gate
        this.autoSubmissionInProgress = false;
        this.scoreSubmitted = false;
    }

    attributeChangedCallback(name, newValue) {
        if (name === 'submission-url') {
            this.submissionUrl = newValue;
        }
    }

    connectedCallback() {
        // Store the original content before rendering shadow DOM
        this.originalContent = this.textContent;

        // Get submission URL from attribute if provided (overrides config file)
        if (this.hasAttribute('submission-url')) {
            this.submissionUrl = this.getAttribute('submission-url');
        }

        this.loadTemplate();
        this.parseContent();
        this.setupEventListeners();
        this.generateQuiz();
        this.lockQuizContent();
    }

    loadTemplate() {
        // Inline styles and template (no external file fetching)
        const template = document.createElement('template');
        template.innerHTML = `<style>${this.getBaseStyles()}</style>${this.getTemplate()}`;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    parseContent() {
        const content = this.originalContent || this.textContent;
        console.log('Parsing content:', content.substring(0, 200) + '...');

        // Split content by --- sections
        const sections = content.split('---').map(s => s.trim());

        if (sections.length >= 1) {
            // First section is the title (first line)
            const titleSection = sections[0].trim();
            const lines = titleSection.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            if (lines.length > 0) {
                this.title = lines[0]; // First line is title
            }
        }

        // Parse each labeled section. Support multiple text sections and associate subsequent questions with the most recent text.
        let lastSectionType = null;
        let lastTextSectionId = null;
        for (let i = 1; i < sections.length; i++) {
            const section = sections[i];
            // Preserve original line breaks in the section body. We only trim the header line.
            const rawLines = section.split('\n');
            if (rawLines.length === 0) continue;

            const originalHeader = (rawLines[0] || '').trim();
            const sectionHeader = originalHeader.toLowerCase();
            // Join the remaining lines exactly as they were (preserve blank lines/newlines)
            const sectionContent = rawLines.slice(1).join('\n');

            // Check for numbered sections like vocab-5 or questions-3
            if (sectionHeader.startsWith('vocab')) {
                const match = sectionHeader.match(/vocab(?:-(\d+))?/);
                const vocabCount = match && match[1] ? parseInt(match[1]) : null;
                this.parseVocabulary(sectionContent, vocabCount);
                this.orderedSections.push({ type: 'vocab', data: { vocabCount } });
                lastSectionType = 'vocab';
            } else if (sectionHeader.startsWith('cloze')) {
                const match = sectionHeader.match(/cloze(?:-(\d+))?/);
                const clozeCount = match && match[1] ? parseInt(match[1]) : null;
                this.parseCloze(sectionContent, clozeCount);
                this.orderedSections.push({ type: 'cloze', data: { clozeCount, text: sectionContent } });
                lastSectionType = 'cloze';
            } else if (sectionHeader.startsWith('instructions')) {
                const instructionId = this.passages.length;
                const { heading, body } = this.extractHeadingAndBody(sectionContent, `Instructions ${this.instructions.length + 1}`);
                this.instructions.push({ sectionId: instructionId, heading, body });
                this.passages.push({ text: body || heading, sectionId: instructionId, listening: false, isInstruction: true });
                this.orderedSections.push({ type: 'instructions', sectionId: instructionId, heading, body });
                lastTextSectionId = instructionId;
                lastSectionType = 'instructions';
            } else if (sectionHeader.startsWith('questions')) {
                const match = sectionHeader.match(/questions(?:-(\d+))?/);
                const questionCount = match && match[1] ? parseInt(match[1]) : null;
                // parseQuestions returns the full parsed bank (no truncation here)
                const parsedQuestions = this.parseQuestions(sectionContent);
                // If the last section was a text, attach these questions to that text's sectionId
                if ((lastSectionType === 'text' || lastSectionType === 'instructions') && lastTextSectionId !== null) {
                    this.questionGroups.push({ sectionId: lastTextSectionId, questions: parsedQuestions, maxQuestions: questionCount });
                    this.orderedSections.push({ type: 'questions', sectionId: lastTextSectionId, questions: parsedQuestions, maxQuestions: questionCount });
                } else {
                    // Global questions (not tied to a text section)
                    this.questionGroups.push({ sectionId: null, questions: parsedQuestions, maxQuestions: questionCount });
                    this.orderedSections.push({ type: 'questions', sectionId: null, questions: parsedQuestions, maxQuestions: questionCount });
                }
                lastSectionType = 'questions';
            } else {
                switch (sectionHeader) {
                    case 'text':
                    case 'text-listening':
                        // Support multiple text sections, including listening-only sections
                        const isListening = sectionHeader === 'text-listening';
                        const newSectionId = this.passages.length;
                        this.passages.push({ text: sectionContent, sectionId: newSectionId, listening: isListening });
                        // Update single-passage fallback for older code paths
                        this.passage = sectionContent;
                        lastTextSectionId = newSectionId;
                        this.orderedSections.push({ type: 'text', sectionId: newSectionId, text: sectionContent, listening: isListening });
                        lastSectionType = 'text';
                        break;
                    case 'audio':
                        this.parseAudio(sectionContent);
                        lastSectionType = 'audio';
                        break;
                    default:
                        lastSectionType = null;
                }
            }
        }

        // Update the rendered content
        this.shadowRoot.getElementById('quizTitle').textContent = this.title || 'TJ Quiz Element';
        this.shadowRoot.getElementById('quizDescription').textContent = 'Read the passage, then answer the questions below.';
        this.shadowRoot.getElementById('passageText').textContent = this.passage;

        const totalQuestionsParsed = this.questionGroups.reduce((sum, g) => sum + (g.questions ? g.questions.length : 0), 0);
        console.log('Parsed:', {
            title: this.title,
            passages: this.passages.length,
            passageLength: this.passage.length,
            vocabularySections: this.vocabularySections.length,
            clozeSections: this.clozeSections.length,
            audioSrc: this.audioSrc,
            questionsCount: totalQuestionsParsed
        });
    }

    parseVocabulary(vocabSection, maxWords = null) {
        if (!vocabSection) return;

        // Parse vocabulary. Prefer newline-separated pairs (one per line):
        // Word: Definition
        // If no newlines are present, fall back to comma-separated pairs.
        const lines = vocabSection.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

        // Candidate raw pairs: prefer line-splitting, otherwise treat the whole
        // block as a single candidate (legacy single-line comma-separated).
        const candidatePairs = lines.length > 0 ? lines.slice() : [vocabSection.trim()];

        // Helper to parse raw pairs into a vocab map
        const parsePairsToMap = (pairs) => {
            const m = {};
            pairs.forEach(pair => {
                const idx = pair.indexOf(':');
                if (idx === -1) return;
                const word = pair.slice(0, idx).trim();
                const definition = pair.slice(idx + 1).trim().replace(/,$/, '');
                if (word && definition) m[word] = definition;
            });
            return m;
        };

        // First parse using candidate pairs
        let allVocab = parsePairsToMap(candidatePairs);

        // If we only found one (or zero) vocab entry from line-splitting AND the
        // original block contains commas, assume the author used comma-separated
        // pairs on a single line and reparse using comma-splitting.
        if (Object.keys(allVocab).length <= 1 && vocabSection.indexOf(',') !== -1) {
            const commaPairs = vocabSection.split(',').map(p => p.trim()).filter(Boolean);
            allVocab = parsePairsToMap(commaPairs);
        }

        let finalVocab;
        // If maxWords is specified, randomly select that many words
        if (maxWords && Object.keys(allVocab).length > maxWords) {
            const vocabEntries = Object.entries(allVocab);
            this.shuffleArray(vocabEntries);
            const selectedEntries = vocabEntries.slice(0, maxWords);
            finalVocab = Object.fromEntries(selectedEntries);
        } else {
            finalVocab = allVocab;
        }

        // Add this vocabulary section to the array
        this.vocabularySections.push({
            vocabulary: finalVocab,
            sectionId: this.vocabularySections.length
        });

        console.log('Vocabulary section parsed. Words in this section:', Object.keys(finalVocab).length, 'Max words:', maxWords);
    }

    parseAudio(audioSection) {
        if (!audioSection) return;

        // Look for audio-src = URL
        const audioMatch = audioSection.match(/audio-src\s*=\s*(.+)/);
        if (audioMatch) {
            this.audioSrc = audioMatch[1].trim();
        }
    }

    parseCloze(clozeSection, maxBlanks = null) {
        if (!clozeSection) return;

        // Extract words marked with asterisks
        const asteriskMatches = clozeSection.match(/\*([^*]+)\*/g);
        let clozeWords = [];
        if (asteriskMatches) {
            clozeWords = asteriskMatches.map(match => match.replace(/\*/g, ''));

            // If maxBlanks is specified, randomly select that many words to remove
            if (maxBlanks && clozeWords.length > maxBlanks) {
                this.shuffleArray(clozeWords);
                clozeWords = clozeWords.slice(0, maxBlanks);
            }
        }

        // Add this cloze section to the array
        this.clozeSections.push({
            text: clozeSection,
            words: clozeWords,
            sectionId: this.clozeSections.length
        });

        console.log('Cloze section parsed. Total words available:', asteriskMatches ? asteriskMatches.length : 0, 'Words to remove:', clozeWords.length, 'Max blanks:', maxBlanks);
    }

    parseQuestions(questionsSection, maxQuestions = null) {
        if (!questionsSection) return [];

        const lines = questionsSection.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let currentQuestion = null;
        const tempQuestionBank = [];

        for (const line of lines) {
            if (line.startsWith('Q:') || line.startsWith('Q.')) {
                // New question
                if (currentQuestion) {
                    tempQuestionBank.push(currentQuestion);
                }
                currentQuestion = {
                    q: line.substring(2).trim(),
                    o: [],
                    a: '',
                    e: '' // explanation
                };
            } else if (line.startsWith('A:') && currentQuestion) {
                // Answer option
                const answerText = line.substring(2).trim();
                const isCorrect = answerText.includes('[correct]');
                const cleanAnswer = answerText.replace('[correct]', '').trim();

                currentQuestion.o.push(cleanAnswer);
                if (isCorrect) {
                    currentQuestion.a = cleanAnswer;
                }
            } else if (line.startsWith('E:') && currentQuestion) {
                // Explanation
                currentQuestion.e = line.substring(2).trim();
            }
        }

        // Don't forget the last question
        if (currentQuestion) {
            tempQuestionBank.push(currentQuestion);
        }

        // Always return the full parsed question bank here. Selection of a subset
        // for a single try is done during generateQuiz so --questions-N applies per try.
        console.log('Questions parsed. Total questions parsed:', tempQuestionBank.length, 'Max questions (deferred):', maxQuestions);
        return tempQuestionBank;
    }

    extractHeadingAndBody(text, fallbackHeading = 'Instructions') {
        const lines = (text || '').split('\n');
        let heading = '';
        const bodyLines = [];

        for (const line of lines) {
            if (!heading && line.trim().length > 0) {
                heading = line.trim();
            } else {
                bodyLines.push(line);
            }
        }

        if (!heading) heading = fallbackHeading;
        const body = bodyLines.join('\n').trim();
        return { heading, body };
    }

    generateVocabMatching() {
        const vocabSection = this.shadowRoot.getElementById('vocabSection');
        const vocabGrid = this.shadowRoot.getElementById('vocabGrid');

        if (this.vocabularySections.length === 0) {
            vocabSection.classList.add('hidden');
            return;
        }

        vocabSection.classList.remove('hidden');
        vocabGrid.innerHTML = '';

        // Reset vocabulary tracking
        this.vocabScore = 0;
        this.vocabUserChoices = {};
        this.vocabSubmitted = false;

        // Generate a section for each vocabulary set
        this.vocabularySections.forEach((vocabSectionData, sectionIndex) => {
            const { vocabulary, sectionId } = vocabSectionData;
            if (!vocabulary) return; // Skip if vocabulary is undefined

            // Create section header if there are multiple vocabulary sections
            if (this.vocabularySections.length > 1) {
                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'vocab-section-header';
                sectionHeader.innerHTML = `<h4>Vocabulary Set ${sectionIndex + 1}</h4>`;
                vocabGrid.appendChild(sectionHeader);
            }

            const words = Object.keys(vocabulary);
            const allDefinitions = Object.values(vocabulary);

            // Shuffle definitions to make it more challenging
            this.shuffleArray(allDefinitions);

            // Create table for this vocabulary section
            const tableContainer = document.createElement('div');
            tableContainer.className = 'vocab-grid-table';

            // Create definition header row
            const headerRow = document.createElement('div');
            headerRow.className = 'vocab-grid-header';

            // Word column header
            const wordHeaderCell = document.createElement('div');
            wordHeaderCell.className = 'vocab-grid-header-cell';
            wordHeaderCell.textContent = 'Word';
            headerRow.appendChild(wordHeaderCell);

            // Definition header cells
            allDefinitions.forEach((definition) => {
                const headerCell = document.createElement('div');
                headerCell.className = 'vocab-grid-header-cell';
                headerCell.textContent = definition;
                headerRow.appendChild(headerCell);
            });

            tableContainer.appendChild(headerRow);

            // Create word rows as 4-choice multiple choice items
            words.forEach((word, wordIndex) => {
                const wordRow = document.createElement('div');
                wordRow.className = 'vocab-grid-row';

                // Word cell
                const wordCell = document.createElement('div');
                wordCell.className = 'vocab-grid-cell vocab-word-cell';
                wordCell.textContent = word;
                wordRow.appendChild(wordCell);

                // Build choices: correct definition + 3 random distractors
                const correctDef = vocabulary[word];
                const otherDefs = allDefinitions.filter(d => d !== correctDef);
                this.shuffleArray(otherDefs);
                const choices = [correctDef, ...otherDefs.slice(0, 3)];
                this.shuffleArray(choices);

                choices.forEach((choiceDef, choiceIndex) => {
                    const optionCell = document.createElement('div');
                    optionCell.className = 'vocab-grid-cell vocab-option-cell';

                    const radioContainer = document.createElement('div');
                    radioContainer.className = 'vocab-radio-container';

                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = `vocab-${sectionId}-${wordIndex}`;
                    radio.value = choiceDef;
                    radio.id = `vocab-${sectionId}-${wordIndex}-${choiceIndex}`;

                    radioContainer.appendChild(radio);
                    optionCell.appendChild(radioContainer);

                    const defLabel = document.createElement('span');
                    defLabel.className = 'vocab-def-label';
                    defLabel.textContent = choiceDef;
                    optionCell.appendChild(defLabel);
                    wordRow.appendChild(optionCell);
                });

                tableContainer.appendChild(wordRow);
            });

            vocabGrid.appendChild(tableContainer);

            // Add spacing between sections if there are multiple
            if (sectionIndex < this.vocabularySections.length - 1) {
                const spacer = document.createElement('div');
                spacer.style.marginBottom = '2rem';
                vocabGrid.appendChild(spacer);
            }
        });
    }

    generateCloze() {
        const clozeSection = this.shadowRoot.getElementById('clozeSection');
        const clozeContainer = this.shadowRoot.getElementById('clozeContainer');

        if (this.clozeSections.length === 0) {
            clozeSection.classList.add('hidden');
            return;
        }

        clozeSection.classList.remove('hidden');

        // Reset cloze tracking
        this.clozeScore = 0;
        this.clozeAnswers = {};
        this.clozeSubmitted = false;

        // Clear the container and rebuild with all cloze sections
        if (!clozeContainer) {
            // Create container if it doesn't exist
            const newContainer = document.createElement('div');
            newContainer.id = 'clozeContainer';
            clozeSection.appendChild(newContainer);
        }

        const container = this.shadowRoot.getElementById('clozeContainer');
        container.innerHTML = '';

        // Generate each cloze section
        this.clozeSections.forEach((clozeData, sectionIndex) => {
            const { text, words, sectionId } = clozeData;

            // Create section wrapper
            const sectionWrapper = document.createElement('div');
            sectionWrapper.className = 'cloze-section-wrapper';

            // Add section header if there are multiple cloze sections
            if (this.clozeSections.length > 1) {
                const sectionHeader = document.createElement('h4');
                sectionHeader.className = 'cloze-section-header';
                sectionHeader.textContent = `Fill in the Blanks - Section ${sectionIndex + 1}`;
                sectionWrapper.appendChild(sectionHeader);
            }

            // Create word bank for this section
            const wordBank = document.createElement('div');
            wordBank.className = 'cloze-word-bank';
            wordBank.innerHTML = `
                <div class="cloze-bank-title">Word Bank</div>
                <div class="cloze-bank-words">
                    ${words.map(word => `<span class="cloze-bank-word">${word}</span>`).join('')}
                </div>
            `;
            sectionWrapper.appendChild(wordBank);

            // Create text with blanks
            const textElement = document.createElement('div');
            textElement.className = 'cloze-text';

            let textWithBlanks = text;
            let blankIndex = 0;

            // Replace selected words with blanks
            words.forEach(word => {
                const regex = new RegExp(`\\*${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*`, 'gi');
                textWithBlanks = textWithBlanks.replace(regex, () => {
                    const inputHtml = `<input type="text" class="cloze-blank" data-answer="${word.toLowerCase()}" data-section-id="${sectionId}" data-blank-index="${blankIndex}" autocomplete="off" spellcheck="false" title="Fill in the blank">`;
                    blankIndex++;
                    return inputHtml;
                });
            });

            // Remove remaining asterisks from words not selected for blanks
            textWithBlanks = textWithBlanks.replace(/\*([^*]+)\*/g, '$1');
            textWithBlanks = this.addLineBreaksToHtml(textWithBlanks);

            textElement.innerHTML = textWithBlanks;
            sectionWrapper.appendChild(textElement);

            // Add spacing between sections if there are multiple
            if (sectionIndex < this.clozeSections.length - 1) {
                sectionWrapper.style.marginBottom = '2rem';
            }

            container.appendChild(sectionWrapper);
        });
    }

    // Render a single vocabulary section inline into the target container
    renderVocabInline(vocabData, targetContainer, displayIndex) {
        const { vocabulary, sectionId } = vocabData;
        const totalSets = this.vocabularySections.length;
        const heading = totalSets > 1 ? `Vocabulary Set ${displayIndex + 1}` : 'Vocabulary';
        const { card, content } = this.createSectionCard(heading, {
            cardClasses: ['vocab-card']
        });

        // build small table similar to global rendering
        const table = document.createElement('div');
        table.className = 'vocab-grid-table';

        const words = Object.keys(vocabulary);
        const allDefinitions = Object.values(vocabulary);

        // shuffle definitions for inline render for variety
        const shuffledDefs = [...allDefinitions];
        this.shuffleArray(shuffledDefs);

        const headerRow = document.createElement('div');
        headerRow.className = 'vocab-grid-header';
        const wordHeaderCell = document.createElement('div');
        wordHeaderCell.className = 'vocab-grid-header-cell';
        wordHeaderCell.textContent = 'Word';
        headerRow.appendChild(wordHeaderCell);
        shuffledDefs.forEach(def => {
            const cell = document.createElement('div');
            cell.className = 'vocab-grid-header-cell';
            cell.textContent = def;
            headerRow.appendChild(cell);
        });
        table.appendChild(headerRow);

        words.forEach((word, wi) => {
            const row = document.createElement('div');
            row.className = 'vocab-grid-row';
            const wordCell = document.createElement('div');
            wordCell.className = 'vocab-grid-cell vocab-word-cell';
            wordCell.textContent = word;
            row.appendChild(wordCell);

            // Build 4 choices per word: correct + 3 distractors
            const correctDef = vocabulary[word];
            const otherDefs = shuffledDefs.filter(d => d !== correctDef);
            const choices = [correctDef, ...otherDefs.slice(0, 3)];
            this.shuffleArray(choices);

            choices.forEach((def, di) => {
                const cell = document.createElement('div');
                cell.className = 'vocab-grid-cell vocab-option-cell';
                // show label for the definition so the mobile stacked layout
                // isn't missing the definition text when the header is hidden
                const radioContainer = document.createElement('div');
                radioContainer.className = 'vocab-radio-container';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `vocab-${sectionId}-${wi}`;
                radio.value = def;
                radio.id = `vocab-${sectionId}-${wi}-${di}`;
                radioContainer.appendChild(radio);
                cell.appendChild(radioContainer);

                const defLabel = document.createElement('span');
                defLabel.className = 'vocab-def-label';
                defLabel.textContent = def;
                cell.appendChild(defLabel);
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        content.appendChild(table);
        targetContainer.appendChild(card);
    }

    // Render a single cloze section inline into the target container
    renderClozeInline(clozeData, targetContainer, displayIndex) {
        const { text, words, sectionId } = clozeData;
        const heading = this.clozeSections.length > 1
            ? `Fill in the Blanks - Section ${displayIndex + 1}`
            : 'Fill in the Blanks';
        const { card, content } = this.createSectionCard(heading, {
            cardClasses: ['cloze-card']
        });

        const wordBank = document.createElement('div');
        wordBank.className = 'cloze-word-bank';
        wordBank.innerHTML = `
            <div class="cloze-bank-title">Word Bank</div>
            <div class="cloze-bank-words">
                ${words.map(word => `<span class="cloze-bank-word">${word}</span>`).join('')}
            </div>
        `;
        content.appendChild(wordBank);

        let textWithBlanks = text;
        let blankIndex = 0;
        words.forEach(word => {
            const regex = new RegExp(`\\*${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*`, 'gi');
            textWithBlanks = textWithBlanks.replace(regex, () => {
                const inputHtml = `<input type="text" class="cloze-blank" data-answer="${word.toLowerCase()}" data-section-id="${sectionId}" data-blank-index="${blankIndex}" autocomplete="off" spellcheck="false" title="Fill in the blank">`;
                blankIndex++;
                return inputHtml;
            });
        });
        textWithBlanks = textWithBlanks.replace(/\*([^*]+)\*/g, '$1');
        textWithBlanks = this.addLineBreaksToHtml(textWithBlanks);
        const textElement = document.createElement('div');
        textElement.className = 'cloze-text';
        textElement.innerHTML = textWithBlanks;
        content.appendChild(textElement);
        targetContainer.appendChild(card);
    }

    handleVocabAnswer(e) {
        if (e.target.type !== 'radio' || !e.target.name.startsWith('vocab-')) return;

        const radio = e.target;
        const nameParts = radio.name.split('-');
        const sectionId = parseInt(nameParts[1]);
        const wordIndex = parseInt(nameParts[2]);

        // Find the vocabulary section and word
        const vocabSection = this.vocabularySections.find(vs => vs.sectionId === sectionId);
        if (!vocabSection || !vocabSection.vocabulary) return;

        const words = Object.keys(vocabSection.vocabulary);
        const word = words[wordIndex];
        const selectedDefinition = radio.value;

        // Store the user's choice with section-word key
        const key = `${sectionId}-${word}`;
        this.vocabUserChoices[key] = selectedDefinition;

        // Check if all vocabulary questions are answered
        const totalVocabWords = this.vocabularySections.reduce((total, section) =>
            total + (section.vocabulary ? Object.keys(section.vocabulary).length : 0), 0);
        const answeredVocabWords = Object.keys(this.vocabUserChoices).length;

        if (answeredVocabWords === totalVocabWords) {
            // Check if all sections are complete to enable score button
            const allQuestionsAnswered = this.totalQuestions === 0 || this.checkAllQuestionsAnswered();
            const allClozeAnswered = this.checkAllClozeAnswered();

            if (allQuestionsAnswered && allClozeAnswered) {
                const checkScoreButton = this.shadowRoot.getElementById('checkScoreButton');
                checkScoreButton.disabled = false;
            }
        }
    }

    handleClozeAnswer(e) {
        if (e.target.type !== 'text' || !e.target.classList.contains('cloze-blank')) return;

        const input = e.target;
        const sectionId = input.dataset.sectionId;
        const blankIndex = input.dataset.blankIndex;
        const userAnswer = input.value.trim().toLowerCase();

        // Store the user's answer with section-blank key
        const key = `${sectionId}-${blankIndex}`;
        this.clozeAnswers[key] = userAnswer;

        // Check if all cloze blanks are filled
        if (this.checkAllClozeAnswered()) {
            // Check if all sections are complete to enable score button
            const vocabComplete = this.vocabularySections.length === 0 ||
                Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords();
            const questionsComplete = this.totalQuestions === 0 || this.checkAllQuestionsAnswered();

            if (vocabComplete && questionsComplete) {
                const checkScoreButton = this.shadowRoot.getElementById('checkScoreButton');
                checkScoreButton.disabled = false;
            }
        }
    }

    checkAllClozeAnswered() {
        const totalBlanks = this.clozeSections.reduce((total, section) =>
            total + section.words.length, 0);
        const filledBlanks = Object.keys(this.clozeAnswers).filter(key =>
            this.clozeAnswers[key].length > 0).length;
        return filledBlanks === totalBlanks;
    }

    getTotalVocabWords() {
        return this.vocabularySections.reduce((total, section) =>
            total + (section.vocabulary ? Object.keys(section.vocabulary).length : 0), 0);
    }

    formatTextWithLineBreaks(text) {
        if (!text) return '';
        const escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return escaped.replace(/\n/g, '<br>');
    }

    addLineBreaksToHtml(htmlString) {
        if (!htmlString) return '';
        return htmlString.replace(/\n/g, '<br>');
    }

    createSectionCard(title, options = {}) {
        const { descriptionHtml = '', cardClasses = [] } = options;
        const card = document.createElement('div');
        const classList = ['section-card', ...cardClasses].filter(Boolean);
        card.className = classList.join(' ');

        const header = document.createElement('div');
        header.className = 'section-card-header';
        header.textContent = title;
        card.appendChild(header);

        if (descriptionHtml) {
            const description = document.createElement('div');
            description.className = 'section-card-description';
            description.innerHTML = descriptionHtml;
            card.appendChild(description);
        }

        const content = document.createElement('div');
        content.className = 'section-card-content';
        card.appendChild(content);

        return { card, content };
    }

    showVocabScore() {
        // Calculate vocabulary score by comparing user choices to correct answers
        this.vocabScore = 0;
        const totalVocab = this.getTotalVocabWords();

        // Show feedback for each vocabulary section
        this.vocabularySections.forEach((vocabSection) => {
            const { vocabulary, sectionId } = vocabSection;
            if (!vocabulary) return; // Skip if vocabulary is undefined
            const words = Object.keys(vocabulary);

            words.forEach((word, wordIndex) => {
                const key = `${sectionId}-${word}`;
                const userDefinition = this.vocabUserChoices[key];
                const correctDefinition = vocabulary[word];
                const isCorrect = userDefinition === correctDefinition;

                if (isCorrect) {
                    this.vocabScore++;
                }

                // Find the selected radio button and its cell
                const radioName = `vocab-${sectionId}-${wordIndex}`;
                const selectedRadio = this.shadowRoot.querySelector(`input[name="${radioName}"]:checked`);

                if (selectedRadio) {
                    // Disable all radio buttons for this word
                    const allRadios = this.shadowRoot.querySelectorAll(`input[name="${radioName}"]`);
                    allRadios.forEach(radio => {
                        radio.disabled = true;
                        const cell = radio.closest('.vocab-option-cell');

                        if (radio.value === correctDefinition) {
                            cell.classList.add('correct');
                        } else if (radio.checked) {
                            cell.classList.add('incorrect');
                        }
                    });
                }
            });
        });

        const vocabScoreElement = this.shadowRoot.getElementById('vocabScore');
        vocabScoreElement.textContent = `Vocabulary Score: ${this.vocabScore}/${totalVocab}`;
        vocabScoreElement.classList.remove('hidden');
        this.vocabSubmitted = true;
    }

    showClozeScore() {
        // Calculate cloze score by comparing user answers to correct answers
        this.clozeScore = 0;
        const totalBlanks = this.clozeSections.reduce((total, section) =>
            total + section.words.length, 0);

        // Show feedback for each cloze blank
        const clozeInputs = this.shadowRoot.querySelectorAll('.cloze-blank');
        clozeInputs.forEach(input => {
            const correctAnswer = input.dataset.answer.toLowerCase();
            const userAnswer = input.value.trim().toLowerCase();
            const isCorrect = userAnswer === correctAnswer;

            if (isCorrect) {
                this.clozeScore++;
                input.classList.add('correct');
            } else {
                input.classList.add('incorrect');
            }

            input.disabled = true;
        });

        const clozeScoreElement = this.shadowRoot.getElementById('clozeScore');
        clozeScoreElement.textContent = `Fill in the Blanks Score: ${this.clozeScore}/${totalBlanks}`;
        clozeScoreElement.classList.remove('hidden');
        this.clozeSubmitted = true;
    }

    setupEventListeners() {
        const quizForm = this.shadowRoot.getElementById('quizForm');
        const sendButton = this.shadowRoot.getElementById('sendButton');
        const tryAgainButton = this.shadowRoot.getElementById('tryAgainButton');
        const themeToggle = this.shadowRoot.querySelector('.theme-toggle');
        const startQuizButton = this.shadowRoot.getElementById('startQuizButton');

        if (quizForm) {
            quizForm.addEventListener('keydown', (e) => {
                if (!this.quizUnlocked && e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        }

        quizForm.addEventListener('change', (e) => {
            this.handleAnswer(e);
            this.handleVocabAnswer(e);
        });
        quizForm.addEventListener('input', (e) => {
            this.handleClozeAnswer(e);
        });
        quizForm.addEventListener('submit', (e) => this.handleSubmit(e));
        sendButton.addEventListener('click', () => this.sendScore());
        tryAgainButton.addEventListener('click', () => this.resetQuiz());
        themeToggle.addEventListener('click', () => this.toggleTheme());
        if (startQuizButton) {
            startQuizButton.addEventListener('click', () => this.handleStartQuiz());
        }

        this.getStudentInputs().forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.remove('invalid');
                }
                if (!this.quizUnlocked) {
                    this.showStudentInfoAlert();
                }
            });
        });

        this.shadowRoot.addEventListener('click', (event) => {
            const passageAudioToggle = event.target.closest('.passage-audio-toggle');
            if (passageAudioToggle) {
                const passageWrapper = passageAudioToggle.closest('.passage-wrapper');
                const passageTextEl = passageWrapper ? passageWrapper.querySelector('.passage-text') : null;
                const text = passageTextEl ? passageTextEl.textContent : '';
                this.handlePassageTTS(passageAudioToggle, text);
                return;
            }

            const audioToggle = event.target.closest('.audio-toggle');
            if (audioToggle) {
                this.handleAudioToggle();
            }
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    setAudioIcon(state) {
        const playIcon = this.shadowRoot.querySelector('.play-icon');
        const pauseIcon = this.shadowRoot.querySelector('.pause-icon');
        if (!playIcon || !pauseIcon) return;

        if (state === 'playing') {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    // Set play/pause icon state for a specific passage audio button
    setPassageAudioIcon(button, state) {
        if (!button) return;
        const playIcon = button.querySelector('.play-icon');
        const pauseIcon = button.querySelector('.pause-icon');
        if (!playIcon || !pauseIcon) return;
        if (state === 'playing') {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    stopAllAudio() {
        if (window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.paused)) {
            window.speechSynthesis.cancel();
        }
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }
        this.setAudioIcon('paused');
        // Reset any passage-specific audio button icons
        if (this.currentAudioButton) {
            this.setPassageAudioIcon(this.currentAudioButton, 'paused');
            this.currentAudioButton = null;
        }
    }

    handleTTS() {
        if (this.audioPlayer && !this.audioPlayer.paused) this.audioPlayer.pause();

        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            this.setAudioIcon('playing');
        } else if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            this.setAudioIcon('paused');
        } else {
            this.utterance = new SpeechSynthesisUtterance(this.passage);
            const lang = "en-US";
            this.utterance.lang = lang;
            const voice = this._getBestVoice(lang);
            if (voice) this.utterance.voice = voice;
            this.utterance.onstart = () => this.setAudioIcon('playing');
            this.utterance.onend = () => this.setAudioIcon('paused');
            this.utterance.onerror = (e) => {
                console.error("TTS Error:", e);
                this.setAudioIcon('paused');
            };
            window.speechSynthesis.speak(this.utterance);
        }
    }

    handleAudioFile() {
        if (window.speechSynthesis.speaking || window.speechSynthesis.paused) window.speechSynthesis.cancel();

        if (!this.audioPlayer) {
            this.audioPlayer = new Audio(this.audioSrc);
            this.audioPlayer.onplaying = () => this.setAudioIcon('playing');
            this.audioPlayer.onpause = () => this.setAudioIcon('paused');
            this.audioPlayer.onended = () => this.setAudioIcon('paused');
            this.audioPlayer.onerror = (e) => {
                console.error("Audio file error. Falling back to TTS.", e);
                this.audioPlayer = null;
                this.handleTTS();
            };
        }
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
        } else {
            this.audioPlayer.pause();
        }
    }

    handleAudioToggle() {
        if (this.audioSrc && this.audioSrc.trim() !== "") {
            this.handleAudioFile();
        } else {
            this.handleTTS();
        }
    }

    // Play/pause TTS for a specific passage button and text
    handlePassageTTS(button, text) {
        if (!button) return;

        // If another passage button is active, stop it first
        if (this.currentAudioButton && this.currentAudioButton !== button) {
            this.stopAllAudio();
        }

        // If speechSynthesis is currently speaking and the same button was used, toggle pause/resume
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            // If the same button triggered while speaking, pause/resume
            if (this.currentAudioButton === button) {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                    this.setPassageAudioIcon(button, 'playing');
                } else {
                    window.speechSynthesis.pause();
                    this.setPassageAudioIcon(button, 'paused');
                }
                return;
            } else {
                // different button - stop and continue to start new utterance
                window.speechSynthesis.cancel();
            }
        }

        // Start new utterance for this passage
        try {
            this.utterance = new SpeechSynthesisUtterance(text || '');
            const lang = "en-US";
            this.utterance.lang = lang;
            const voice = this._getBestVoice(lang);
            if (voice) this.utterance.voice = voice;
            this.utterance.onstart = () => {
                this.setPassageAudioIcon(button, 'playing');
                this.currentAudioButton = button;
            };
            this.utterance.onend = () => {
                this.setPassageAudioIcon(button, 'paused');
                if (this.currentAudioButton === button) this.currentAudioButton = null;
            };
            this.utterance.onerror = (e) => {
                console.error('Passage TTS Error:', e);
                this.setPassageAudioIcon(button, 'paused');
                if (this.currentAudioButton === button) this.currentAudioButton = null;
            };
            window.speechSynthesis.speak(this.utterance);
        } catch (err) {
            console.error('TTS not available:', err);
        }
    }

    createQuestionBlock(q, index) {
        const questionId = `q${index}`;
        const shuffledOptions = [...q.o];
        this.shuffleArray(shuffledOptions);
        const optionsHtml = shuffledOptions.map(option => `
            <label class="option-label">
                <input type="radio" name="${questionId}" value="${option}" class="form-radio" required>
                <span>${option}</span>
            </label>
        `).join('');

        const explanationHtml = q.e ? `<div class="explanation hidden" id="explanation-${questionId}">
            <div class="explanation-content">
                <strong>Explanation:</strong> ${q.e}
            </div>
        </div>` : '';

        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.innerHTML = `
            <p class="question-text">${q.q}</p>
            <div class="options-group">${optionsHtml}</div>
            ${explanationHtml}
        `;
        return questionBlock;
    }

    generateQuiz() {
        const questionsSection = this.shadowRoot.getElementById('questionsSection');
        const readingSection = this.shadowRoot.getElementById('readingSection');
        const checkScoreButton = this.shadowRoot.getElementById('checkScoreButton');
        console.log('generateQuiz called, questions total:', this.totalQuestions);

        // Clear previous questions and reading content
        questionsSection.innerHTML = '';
        // Reset counters and button state
        this.score = 0;
        this.questionsAnswered = 0;
        this.userQuestionAnswers = {};
        checkScoreButton.disabled = true;

        // We'll render vocab and cloze inline according to orderedSections.
        // Hide the global vocab/cloze areas to avoid duplicate rendering.
        const vocabSectionGlobal = this.shadowRoot.getElementById('vocabSection');
        const clozeSectionGlobal = this.shadowRoot.getElementById('clozeSection');
        if (vocabSectionGlobal) vocabSectionGlobal.classList.add('hidden');
        if (clozeSectionGlobal) clozeSectionGlobal.classList.add('hidden');

        // Hide the reading section if there are no text passages
        if (!this.passages || this.passages.length === 0) {
            if (readingSection) readingSection.classList.add('hidden');
        } else {
            if (readingSection) readingSection.classList.remove('hidden');
        }

        // Render sections in original order using orderedSections to keep questions where they appear
        const passageContentArea = this.shadowRoot.querySelector('.passage-content');
        passageContentArea.innerHTML = '';
        const orderedQuestionItems = [];

        // trackers for which parsed vocab/cloze section to render next
        let vocabRenderIndex = 0;
        let clozeRenderIndex = 0;

        this.orderedSections.forEach((sec) => {
            if (sec.type === 'text') {
                // render passage
                const passageWrapper = document.createElement('div');
                passageWrapper.className = 'passage-wrapper';
                const passageHeader = document.createElement('h3');
                passageHeader.className = 'passage-header';
                const passageHeading = sec.heading || `Passage ${sec.sectionId + 1}`;
                passageHeader.textContent = passageHeading;

                // per-passage audio button
                const passageAudioButton = document.createElement('button');
                passageAudioButton.type = 'button';
                passageAudioButton.className = 'passage-audio-toggle';
                passageAudioButton.title = 'Play Passage Audio';
                passageAudioButton.innerHTML = `
                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <svg class="pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                `;
                passageHeader.appendChild(passageAudioButton);
                // Render passage text as separate paragraphs so blank lines create new <p> elements
                passageWrapper.appendChild(passageHeader);
                const paragraphs = sec.text.split(/\n\s*\n/);
                paragraphs.forEach(p => {
                    const passageTextEl = document.createElement('p');
                    passageTextEl.className = 'passage-text';
                    if (sec.listening) passageTextEl.classList.add('listening-hidden');
                    // Set plain text for the paragraph (no <br> conversion)
                    passageTextEl.textContent = p.trim();
                    passageWrapper.appendChild(passageTextEl);
                });

                // container for questions that appear immediately after this text
                const qContainer = document.createElement('div');
                qContainer.className = 'passage-questions';
                // If this passage has questions placed after it in the orderedSections,
                // add the same instruction text used in the main questions section so
                // students see guidance where the questions actually appear.
                const hasQuestionsForThis = this.orderedSections.some(s => s.type === 'questions' && s.sectionId === sec.sectionId);
                if (hasQuestionsForThis) {
                    const qInstruction = document.createElement('p');
                    qInstruction.className = 'reading-instructions';
                    qInstruction.textContent = 'Read each question and select the best answer from the choices below.';
                    qContainer.appendChild(qInstruction);
                }
                passageWrapper.appendChild(qContainer);
                passageContentArea.appendChild(passageWrapper);

                // Questions tied to this passage will be handled by the 'questions' entries
                // in orderedSections below. We only render the passage and its question
                // container here to preserve placement.
            } else if (sec.type === 'instructions') {
                const headingText = sec.heading || `Section ${sec.sectionId + 1}`;
                const descriptionHtml = sec.body ? this.formatTextWithLineBreaks(sec.body) : '';
                const { card, content } = this.createSectionCard(headingText, {
                    descriptionHtml,
                    cardClasses: ['instruction-card']
                });
                passageContentArea.appendChild(card);

                const qContainer = document.createElement('div');
                qContainer.className = 'passage-questions instruction-questions';
                content.appendChild(qContainer);
            } else if (sec.type === 'vocab') {
                // Render this vocabulary section inline at this location (if available)
                const vocabData = this.vocabularySections[vocabRenderIndex++];
                if (vocabData) {
                    this.renderVocabInline(vocabData, passageContentArea, vocabRenderIndex - 1);
                }
            } else if (sec.type === 'cloze') {
                // Render this cloze section inline at this location (if available)
                const clozeData = this.clozeSections[clozeRenderIndex++];
                if (clozeData) {
                    this.renderClozeInline(clozeData, passageContentArea, clozeRenderIndex - 1);
                }
            } else if (sec.type === 'questions') {
                // if questions were placed in orderedSections (global or tied), render them where they appear
                const targetContainer = sec.sectionId !== null ? (this.shadowRoot.querySelectorAll('.passage-questions')[sec.sectionId]) : questionsSection;
                if (sec.questions && sec.questions.length > 0) {
                    // Apply per-section maxQuestions selection at render-time so each try picks new random subset
                    const maxForSection = sec.maxQuestions || null;
                    let questionsForSection = [...sec.questions];
                    if (maxForSection && questionsForSection.length > maxForSection) {
                        this.shuffleArray(questionsForSection);
                        questionsForSection = questionsForSection.slice(0, maxForSection);
                    }
                    questionsForSection.forEach(q => orderedQuestionItems.push({ question: q, container: targetContainer }));
                }
            }
        });

        // Note: orderedSections contains 'questions' entries for global groups as well, so do not double-append globals here

        // Flatten the questions for scoring and render
        this.currentQuestions = orderedQuestionItems.map(i => i.question);
        this.totalQuestions = this.currentQuestions.length;

        // Determine whether any global questions (those targeting questionsSection) exist
        const hasGlobalQuestions = orderedQuestionItems.some(i => i.container === questionsSection);

        if (this.totalQuestions === 0) {
            questionsSection.classList.add('hidden');
        } else {
            // Only show the global questions header/instruction if there are global questions
            if (hasGlobalQuestions) {
                questionsSection.classList.remove('hidden');
                const legendEl = document.createElement('legend');
                legendEl.textContent = 'Multiple Choice Questions';
                questionsSection.appendChild(legendEl);

                const questionsInstruction = document.createElement('p');
                questionsInstruction.className = 'reading-instructions';
                questionsInstruction.textContent = 'Read each question and select the best answer from the choices below.';
                questionsSection.appendChild(questionsInstruction);
            } else {
                // if no globals, keep the section hidden (per-passage questions will have their own instruction)
                questionsSection.classList.add('hidden');
            }

            // Now append question blocks into their containers (passage containers or global)
            this.currentQuestions.forEach((q, idx) => {
                const item = orderedQuestionItems[idx];
                const container = item && item.container ? item.container : questionsSection;
                // Ensure container is visible
                if (container === questionsSection) container.classList.remove('hidden');
                container.appendChild(this.createQuestionBlock(q, idx));
            });
        }
    }

    getStudentInputs() {
        return [
            this.shadowRoot.getElementById('nickname'),
            this.shadowRoot.getElementById('homeroom'),
            this.shadowRoot.getElementById('studentId'),
            this.shadowRoot.getElementById('password')
        ].filter(Boolean);
    }

    showStudentInfoAlert(message = '', type = '') {
        const alert = this.shadowRoot.getElementById('studentInfoAlert');
        if (!alert) return;
        alert.textContent = message;
        alert.className = type ? type : '';
    }

    validateStudentInfoFields(options = {}) {
        const { showAlert = true } = options;
        const inputs = this.getStudentInputs();
        let allValid = true;

        inputs.forEach(input => {
            // Password is not required
            if (input.id === 'password') return;

            if (input.value.trim() === '') {
                allValid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });

        if (showAlert) {
            if (!allValid) {
                this.showStudentInfoAlert('Please fill out all student information fields before continuing.', 'error');
            } else {
                this.showStudentInfoAlert();
            }
        }

        return allValid;
    }

    lockQuizContent() {
        const quizContent = this.shadowRoot.getElementById('quizContent');
        const startButton = this.shadowRoot.getElementById('startQuizButton');
        if (quizContent) quizContent.classList.add('hidden');
        if (startButton) startButton.classList.remove('hidden');
        this.quizUnlocked = false;
        this.showStudentInfoAlert();
    }

    unlockQuizContent() {
        const quizContent = this.shadowRoot.getElementById('quizContent');
        const startButton = this.shadowRoot.getElementById('startQuizButton');
        if (quizContent) quizContent.classList.remove('hidden');
        if (startButton) startButton.classList.add('hidden');
        this.quizUnlocked = true;
    }

    handleStartQuiz() {
        if (!this.validateStudentInfoFields({ showAlert: true })) return;
        this.unlockQuizContent();
        this.showStudentInfoAlert('Information saved! Scroll down to begin the quiz.', 'success');
        const readingSection = this.shadowRoot.getElementById('readingSection');
        try {
            if (readingSection) {
                readingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                this.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (e) {
            this.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    checkInitialCompletion() {
        // If there's only cloze content and no vocab or questions, enable score button immediately
        const hasVocab = this.vocabularySections.length > 0;
        const hasQuestions = this.totalQuestions > 0;
        const hasCloze = this.clozeSections.length > 0;

        if (hasCloze && !hasVocab && !hasQuestions) {
            // Only cloze exists - score button should be enabled when all cloze answers are filled
            // This will be handled by handleClozeAnswer, so we don't need to do anything here
        } else if (!hasCloze && !hasVocab && !hasQuestions) {
            // No interactive content at all - hide the score button
            const checkScoreContainer = this.shadowRoot.getElementById('checkScoreContainer');
            checkScoreContainer.classList.add('hidden');
        }
    }

    checkAllQuestionsAnswered() {
        return this.questionsAnswered === this.totalQuestions;
    }

    showQuestionFeedback() {
        // Iterate through the rendered questions and reveal correct/incorrect states
        this.score = 0; // recalc
        for (let i = 0; i < this.totalQuestions; i++) {
            const questionData = this.currentQuestions[i];
            const qName = `q${i}`;
            const userAnswer = this.userQuestionAnswers[i];

            const radioButtons = this.shadowRoot.querySelectorAll(`input[name="${qName}"]`);
            radioButtons.forEach(radio => {
                const label = radio.closest('.option-label');
                // disable inputs now to prevent changes after checking
                radio.disabled = true;
                let feedbackIcon = label.querySelector('.feedback-icon');
                if (!feedbackIcon) {
                    feedbackIcon = document.createElement('span');
                    feedbackIcon.className = 'feedback-icon';
                    label.appendChild(feedbackIcon);
                }

                if (radio.value === questionData.a) {
                    label.classList.add('correct');
                    feedbackIcon.textContent = '✅';
                }
                if (userAnswer && radio.value === userAnswer && userAnswer !== questionData.a) {
                    label.classList.add('incorrect');
                    feedbackIcon.textContent = '❌';
                }
            });

            // Show explanation if available
            const explanation = this.shadowRoot.getElementById(`explanation-q${i}`);
            if (explanation) explanation.classList.remove('hidden');

            if (userAnswer === questionData.a) this.score++;
        }
    }

    handleAnswer(e) {
        if (e.target.type !== 'radio') return;

        const selectedRadio = e.target;
        const questionName = selectedRadio.name;

        // Skip vocabulary radio buttons - they're handled by handleVocabAnswer
        if (questionName.startsWith('vocab-')) return;

        const questionIndex = parseInt(questionName.substring(1));
        // Record the user's selected answer but do not reveal feedback yet
        this.userQuestionAnswers[questionIndex] = selectedRadio.value;

        // Mark radio as answered to avoid double-counting, but keep enabled so user can change before checking
        selectedRadio.dataset.answered = 'true';

        // Count unique answered questions
        const answeredCount = Object.keys(this.userQuestionAnswers).length;
        this.questionsAnswered = answeredCount;

        // Enable check score button when all questions are answered and vocabulary/cloze are complete
        const vocabComplete = this.vocabularySections.length === 0 || Object.keys(this.vocabUserChoices).length === this.getTotalVocabWords();
        const questionsComplete = this.checkAllQuestionsAnswered();
        const clozeComplete = this.checkAllClozeAnswered();

        if (vocabComplete && questionsComplete && clozeComplete) {
            this.shadowRoot.getElementById('checkScoreButton').disabled = false;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.quizUnlocked) {
            this.showStudentInfoAlert('Please save your student information before taking the quiz.', 'error');
            return;
        }
        if (!this.validateStudentInfoFields({ showAlert: true })) {
            return;
        }
        this.showFinalScore();
    }

    showFinalScore() {
        // Reveal question feedback before calculating final question score
        if (this.totalQuestions > 0) {
            this.showQuestionFeedback();
        }
        // Calculate and show vocabulary score/feedback if vocabulary exists and hasn't been scored yet
        if (this.vocabularySections.length > 0 && !this.vocabSubmitted) {
            this.showVocabScore();
        }

        // Calculate and show cloze score if cloze exists and hasn't been scored yet
        if (this.clozeSections.length > 0 && !this.clozeSubmitted) {
            this.showClozeScore();
        }

        const resultScore = this.shadowRoot.getElementById('resultScore');
        const checkScoreContainer = this.shadowRoot.getElementById('checkScoreContainer');
        const resultArea = this.shadowRoot.getElementById('resultArea');
        const postScoreActions = this.shadowRoot.getElementById('postScoreActions');
        const sendButton = this.shadowRoot.getElementById('sendButton');
        const tryAgainButton = this.shadowRoot.getElementById('tryAgainButton');
        const studentInfoSection = this.shadowRoot.getElementById('studentInfoSection');

        // Calculate total score (vocabulary + cloze + questions)
        const vocabTotal = this.getTotalVocabWords();
        const clozeTotal = this.clozeSections.reduce((total, section) => total + section.words.length, 0);
        const questionTotal = this.totalQuestions;
        const totalPossible = vocabTotal + clozeTotal + questionTotal;
        const totalEarned = this.vocabScore + this.clozeScore + this.score;

        console.log('Final scoring - Vocab total:', vocabTotal, 'Cloze total:', clozeTotal, 'Question total:', questionTotal, 'Total possible:', totalPossible);
        console.log('Final scoring - Vocab score:', this.vocabScore, 'Cloze score:', this.clozeScore, 'Question score:', this.score, 'Total earned:', totalEarned);

        // Get student info
        const nickname = this.shadowRoot.getElementById('nickname').value || '-';
        const homeroom = this.shadowRoot.getElementById('homeroom').value || '-';
        const studentId = this.shadowRoot.getElementById('studentId').value || '-';

        // Get timestamp
        const now = new Date();
        const timestamp = now.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        // Hide student info section
        if (studentInfoSection) {
            studentInfoSection.style.display = 'none';
        }

        // Update score display to show combined score with better formatting
        if (totalPossible > 0) {
            const percentage = Math.round((totalEarned / totalPossible) * 100);

            // Determine how many sections we have
            const sectionsPresent = [];
            if (vocabTotal > 0) sectionsPresent.push('vocab');
            if (clozeTotal > 0) sectionsPresent.push('cloze');
            if (questionTotal > 0) sectionsPresent.push('questions');

            let breakdownHTML = '';
            if (vocabTotal > 0) {
                breakdownHTML += `
                    <div class="score-section">
                        <span class="score-label">Vocabulary:</span>
                        <span class="score-value">${this.vocabScore}/${vocabTotal}</span>
                    </div>`;
            }
            if (clozeTotal > 0) {
                breakdownHTML += `
                    <div class="score-section">
                        <span class="score-label">Fill-in-the-blank:</span>
                        <span class="score-value">${this.clozeScore}/${clozeTotal}</span>
                    </div>`;
            }
            if (questionTotal > 0) {
                breakdownHTML += `
                    <div class="score-section">
                        <span class="score-label">Questions:</span>
                        <span class="score-value">${this.score}/${questionTotal}</span>
                    </div>`;
            }

            resultScore.innerHTML = `
                <div class="score-report-card">
                    <div class="student-details">
                        <div><strong>Name:</strong> ${nickname}</div>
                        <div><strong>ID:</strong> ${studentId}</div>
                        <div><strong>Class:</strong> ${homeroom}</div>
                        <div><strong>Date:</strong> ${timestamp}</div>
                    </div>
                    <div class="score-summary">
                        <div class="score-main-compact">${totalEarned} / ${totalPossible} (${percentage}%)</div>
                    </div>
                    <div class="score-breakdown-compact">
                        ${breakdownHTML}
                    </div>
                </div>
            `;
        } else {
            // Fallback for 0 total possible
             resultScore.innerHTML = `
                <div class="score-report-card">
                    <div class="student-details">
                        <div><strong>Name:</strong> ${nickname}</div>
                        <div><strong>ID:</strong> ${studentId}</div>
                        <div><strong>Class:</strong> ${homeroom}</div>
                        <div><strong>Date:</strong> ${timestamp}</div>
                    </div>
                    <div class="score-summary">
                        <div class="score-main-compact">0 / 0 (0%)</div>
                    </div>
                </div>
            `;
        }

        const scorePercentage = totalPossible > 0 ? totalEarned / totalPossible : 0;
        resultScore.className = '';
        // We don't need high/medium/low classes on resultScore anymore as we use custom styling inside, 
        // but we can keep them if they affect other things. 
        
        // Hide the check score button once results are shown
        if (checkScoreContainer) {
            checkScoreContainer.classList.add('hidden');
        }

        if (postScoreActions) {
            postScoreActions.classList.remove('hidden');
        }
        if (resultArea) {
            resultArea.classList.remove('hidden');
        }
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.textContent = 'Resend Score to Teacher';
            sendButton.classList.add('hidden');
        }
        if (tryAgainButton) {
            tryAgainButton.disabled = false;
        }

        if (resultArea) {
            try {
                resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (e) {
                this.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        this.stopAllAudio();
        this.sendScore(true);
    }

    async sendScore(autoTriggered = false) {
        if (this.autoSubmissionInProgress) {
            return;
        }

        const validationMessage = this.shadowRoot.getElementById('validationMessage');
        const sendButton = this.shadowRoot.getElementById('sendButton');
        const tryAgainButton = this.shadowRoot.getElementById('tryAgainButton');

        const infoValid = this.validateStudentInfoFields({ showAlert: true });
        if (!infoValid) {
            if (validationMessage) {
                validationMessage.textContent = 'Please fill out all student information fields.';
                validationMessage.className = 'error';
            }
            if (sendButton && autoTriggered) {
                sendButton.classList.remove('hidden');
                sendButton.disabled = false;
            }
            return;
        }

        const vocabTotal = this.getTotalVocabWords();
        const clozeTotal = this.clozeSections.reduce((total, section) => total + section.words.length, 0);
        const questionTotal = this.totalQuestions;
        const totalPossible = vocabTotal + clozeTotal + questionTotal;
        const totalEarned = this.vocabScore + this.clozeScore + this.score;

        const studentData = {
            quizName: this.title,
            nickname: this.shadowRoot.getElementById('nickname').value,
            homeroom: this.shadowRoot.getElementById('homeroom').value,
            studentId: this.shadowRoot.getElementById('studentId').value,
            score: totalEarned,
            total: totalPossible,
            timestamp: new Date().toISOString()
        };

        if (!this.submissionUrl) {
            if (validationMessage) {
                validationMessage.textContent = '⚠️ No submission URL configured.';
                validationMessage.className = 'error';
            }
            if (sendButton) {
                sendButton.textContent = 'No Submission URL';
                sendButton.disabled = true;
                sendButton.classList.remove('hidden');
            }
            if (tryAgainButton) {
                tryAgainButton.disabled = false;
            }
            return;
        }

        this.autoSubmissionInProgress = true;
        if (sendButton) {
            if (autoTriggered) {
                sendButton.classList.add('hidden');
            } else {
                sendButton.disabled = true;
                sendButton.textContent = 'Sending...';
            }
        }
        if (validationMessage) {
            validationMessage.textContent = autoTriggered ? 'Submitting your score to your teacher...' : '';
            validationMessage.className = '';
        }
        if (tryAgainButton) {
            tryAgainButton.disabled = true;
        }

        // Check for submission password
        const passwordInput = this.shadowRoot.getElementById('password');
        const password = passwordInput ? passwordInput.value.trim() : '';
        const IS_REMOTE_CODE = '6767';

        if (password !== IS_REMOTE_CODE) {
            if (validationMessage) {
                validationMessage.textContent = 'ℹ️ Local Mode: Results displayed for screenshot only.';
                validationMessage.className = 'info';
            }
            if (sendButton) {
                sendButton.textContent = 'Submission Disabled (No Password)';
                sendButton.disabled = true;
                sendButton.classList.remove('hidden');
            }
            if (tryAgainButton) {
                tryAgainButton.disabled = false;
            }
            this.autoSubmissionInProgress = false;
            return;
        }

        try {
            // Using mode: 'no-cors' and text/plain to avoid CORS preflight issues with Google Apps Script
            // Note: Google Apps Script redirects after POST, which often fails CORS preflight
            await fetch(this.submissionUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(studentData)
            });

            // With no-cors, we can't actually read the response or know for sure if it succeeded.
            // We assume success if no error was thrown during fetch.
            if (validationMessage) {
                validationMessage.textContent = '✅ Score sent to your teacher.';
                validationMessage.className = 'success';
            }
            if (sendButton) {
                sendButton.textContent = 'Score Sent';
                sendButton.disabled = true;
                sendButton.classList.add('hidden');
            }
            if (tryAgainButton) {
                tryAgainButton.disabled = false;
            }
            this.scoreSubmitted = true;
        } catch (error) {
            console.error('Error:', error);
            if (validationMessage) {
                validationMessage.textContent = '⚠️ Error: Could not submit score. Please try again.';
                validationMessage.className = 'error';
            }
            if (sendButton) {
                sendButton.textContent = autoTriggered ? 'Send Score Again' : 'Try Sending Again';
                sendButton.disabled = false;
                sendButton.classList.remove('hidden');
            }
            if (tryAgainButton) {
                tryAgainButton.disabled = false;
            }
        } finally {
            this.autoSubmissionInProgress = false;
        }
    }

    resetQuiz() {
        const quizForm = this.shadowRoot.getElementById('quizForm');
        const resultArea = this.shadowRoot.getElementById('resultArea');
        const postScoreActions = this.shadowRoot.getElementById('postScoreActions');
        const checkScoreContainer = this.shadowRoot.getElementById('checkScoreContainer');
        const validationMessage = this.shadowRoot.getElementById('validationMessage');
        const sendButton = this.shadowRoot.getElementById('sendButton');
        const tryAgainButton = this.shadowRoot.getElementById('tryAgainButton');
        const studentInputs = this.getStudentInputs();
        const studentInfoSection = this.shadowRoot.getElementById('studentInfoSection');

        quizForm.reset();
        if (studentInfoSection) studentInfoSection.style.display = '';
        if (resultArea) resultArea.classList.add('hidden');
        if (postScoreActions) postScoreActions.classList.add('hidden');
        if (checkScoreContainer) checkScoreContainer.classList.remove('hidden');
        if (validationMessage) {
            validationMessage.textContent = '';
            validationMessage.className = '';
        }

        studentInputs.forEach(input => {
            input.classList.remove('invalid');
            input.disabled = false;
        });
        this.showStudentInfoAlert();

        this.userQuestionAnswers = {};
        this.questionsAnswered = 0;
        this.score = 0;
        this.vocabUserChoices = {};
        this.vocabScore = 0;
        this.vocabSubmitted = false;
        this.clozeAnswers = {};
        this.clozeScore = 0;
        this.clozeSubmitted = false;
        this.scoreSubmitted = false;
        this.autoSubmissionInProgress = false;

        const allRadios = Array.from(this.shadowRoot.querySelectorAll('input[type="radio"]'));
        allRadios.forEach(radio => {
            radio.disabled = false;
            try { delete radio.dataset.answered; } catch (e) { }
        });

        const allLabels = Array.from(this.shadowRoot.querySelectorAll('.option-label'));
        allLabels.forEach(label => {
            label.classList.remove('correct', 'incorrect');
            const feedback = label.querySelector('.feedback-icon');
            if (feedback) feedback.remove();
            label.style.cursor = '';
        });

        const allExplanations = Array.from(this.shadowRoot.querySelectorAll('.explanation'));
        allExplanations.forEach(exp => exp.classList.add('hidden'));

        if (sendButton) {
            sendButton.disabled = false;
            sendButton.textContent = 'Resend Score to Teacher';
            sendButton.classList.add('hidden');
        }
        if (tryAgainButton) {
            tryAgainButton.disabled = false;
        }

        this.stopAllAudio();
        this.generateQuiz();

        const checkBtn = this.shadowRoot.getElementById('checkScoreButton');
        if (checkBtn) {
            checkBtn.disabled = true;
        }
        this.lockQuizContent();
    }

    toggleTheme() {
        this.classList.toggle('dark');
        const isDark = this.classList.contains('dark');
        this.shadowRoot.querySelector('.light-icon').classList.toggle('hidden', isDark);
        this.shadowRoot.querySelector('.dark-icon').classList.toggle('hidden', !isDark);
    }

    getBaseStyles() {
        return `
:host {
    display: block;
    --bg-light: #f1f5f9;
    --text-light: #1e293b;
    --card-bg-light: #ffffff;
    --card-shadow-light: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --border-light: #e2e8f0;
    --input-bg-light: #f8fafc;
    --input-border-light: #cbd5e1;
    --subtle-text-light: #475569;
    --primary-color: #4f46e5;
    --primary-hover: #4338ca;
    --primary-text: #ffffff;
    --green-color: #16a34a;
    --green-hover: #15803d;
    --green-light-bg: #dcfce7;
    --red-color: #ef4444;
    --red-light-bg: #fee2e2;
    --yellow-color: #eab308;
    --slate-color: #64748b;
    --slate-hover: #475569;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Utility: hide elements when not needed */
.hidden {
    display: none !important;
}

:host(.dark) {
    --bg-light: #0f172a;
    --text-light: #e2e8f0;
    --card-bg-light: #1e293b;
    --card-shadow-light: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
    --border-light: #334155;
    --input-bg-light: #334155;
    --input-border-light: #475569;
    --subtle-text-light: #87abdd;
    --green-light-bg: #14532d;
    --red-light-bg: #7f1d1d;
}

.quiz-wrapper * {
    box-sizing: border-box;
}

.quiz-wrapper {
     font-family: var(--font-sans);
     background-color: var(--bg-light);
     color: var(--text-light);
     line-height: 1.6;
     transition: background-color 0.3s, color 0.3s;
     padding: 1rem 0;
}

.quiz-wrapper p {
    font-size: 1em; 
    margin-bottom: 1rem;
}

.container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 1rem;
}

.quiz-card {
    background-color: var(--card-bg-light);
    border-radius: 0.75rem;
    box-shadow: var(--card-shadow-light);
    overflow: hidden;
    transition: background-color 0.3s;
}

.quiz-header {
    background-color: var(--primary-color);
    color: var(--primary-text);
    padding: 1.5rem 1.5rem 2rem 1.5rem;
    position: relative;
}
 .quiz-header h1 {
    font-size: 1.5em; 
    font-weight: 700;
    margin: 0;
 }
 .quiz-header p {
     margin-top: 0.5rem;
     color: #e0e7ff;
     opacity: 0.9;
     font-size: 0.9375em;
 }

.theme-toggle {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25em;
}
 .theme-toggle:hover {
     background-color: rgba(255, 255, 255, 0.2);
 }

form {
    padding: 1.5rem;
}

@media (min-width: 640px) {
    form {
        padding: 2rem;
    }
}

fieldset {
    border: none;
    padding: 0;
    margin: 0;
    margin-bottom: 2rem;
}

.legend-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;
}

legend {
    font-size: 1.125em;
    font-weight: 600;
    color: var(--text-light);
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
    width: auto;
}

/* Make cloze and vocab section headings match the Reading Passage style */
fieldset > legend {
    display: block;
    font-size: 1.125em;
    font-weight: 700;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    color: var(--text-light);
    border-bottom: 1px solid var(--border-light);
}

/* Add consistent spacing for section content similar to the passage card */
#vocabSection .vocab-grid-table,
#clozeSection .cloze-word-bank,
#clozeSection .cloze-text {
    margin-top: 1rem;
}

.reading-instructions {
    font-size: 0.9em;
    font-style: italic;
    margin-bottom: 1rem;
    margin-top: 1rem;
        
}

/* Generic instruction style used across the form to distinguish from passage paragraphs */
.instruction {
    font-size: 0.9em;
    color: var(--subtle-text-light);
    font-style: italic;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
    line-height: 1.45;
}

.audio-toggle {
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 9999px;
    background-color: var(--primary-color);
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-text);
    transition: background-color 0.2s;
}
.audio-toggle:hover {
    background-color: var(--primary-hover);
}
.audio-toggle svg {
    width: 1.5em;
    height: 1.5em;
}

/* Per-passage audio button -- styled to match the top play button */
.passage-audio-toggle {
    cursor: pointer;
    padding: 0.5rem 0.6rem;
    border-radius: 0.5rem;
    background-color: #ffffff;
    border: 1px solid var(--border-light);
    color: var(--text-light);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    transition: transform 0.12s, box-shadow 0.12s;
}
.passage-audio-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}
.passage-audio-toggle .play-icon, .passage-audio-toggle .pause-icon {
    width: 1.1rem;
    height: 1.1rem;
}

/* Make passage wrappers more spacious */
.passage-wrapper {
    padding: 1rem 1.25rem;
    border-radius: 0.5rem;
    background: transparent;
    margin-bottom: 1rem;
}
.passage-wrapper {
    position: relative;
}
.passage-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.passage-text {
    margin-top: 0.75rem;
}

/* Visually hide text but keep it in the DOM for TTS and accessibility */
.listening-hidden {
    position: absolute !important;
    clip: rect(1px, 1px, 1px, 1px); /* IE6,7 */
    clip-path: inset(50%); /* modern */
    height: 1px;
    width: 1px;
    overflow: hidden;
    white-space: nowrap;
}

.passage-content {
    background-color: var(--input-bg-light);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-light);
    line-height: 1.7;
}

.section-card {
    background-color: var(--input-bg-light);
    border: 1px solid var(--border-light);
    border-radius: 0.75rem;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
}

.section-card-header {
    font-size: 1.05em;
    font-weight: 600;
    color: var(--text-light);
    margin: 0 0 0.5rem 0;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 0.4rem;
}

.section-card-description {
    font-size: 0.95em;
    color: var(--subtle-text-light);
    line-height: 1.6;
    margin-bottom: 0.75rem;
}

.section-card-content {
    display: block;
}

.instruction-card .section-card-content {
    margin-top: 0.25rem;
}

.instruction-questions {
    margin-top: 0.75rem;
}

.question-block {
     padding-top: 1.5rem;
     border-top: 1px solid var(--border-light);
}
.question-block:first-of-type {
     border-top: none;
     padding-top: 0;
}
 .question-block p.question-text {
     font-weight: 600;
     margin-bottom: 1rem;
     font-size: 1em;
 }

.options-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* slightly tighter spacing to match vocab */
}
.option-label {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem; /* condensed padding */
    background-color: var(--input-bg-light);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.18s, border-color 0.18s;
    border: 1px solid transparent;
    font-size: 0.95em; /* slightly smaller text to match vocab */
}
.option-label:hover {
    background-color: #eef4ff;
}
 :host(.dark) .option-label:hover {
    background-color: #2b3440;
}

.option-label.correct {
    background-color: var(--green-light-bg);
    border-color: var(--green-color);
}
.option-label.incorrect {
    background-color: var(--red-light-bg);
    border-color: var(--red-color);
}
.feedback-icon {
    margin-left: auto;
    font-size: 1.25em;
}

.explanation {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--input-bg-light);
    border-radius: 0.5rem;
    border-left: 4px solid var(--primary-color);
    font-size: 0.9em;
    line-height: 1.5;
}

.explanation-content strong {
    color: var(--primary-color);
}

.form-radio {
    width: 1.125em;
    height: 1.125em;
    margin-right: 0.75em;
    accent-color: var(--primary-color);
    flex-shrink: 0;
}
 .form-radio:disabled {
     cursor: not-allowed;
 }

.form-input {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--input-bg-light);
    border: 1px solid var(--input-border-light);
    border-radius: 0.5rem;
    color: var(--text-light);
    font-size: 1em;
}
 .form-input.invalid {
     border-color: var(--red-color);
 }
 .form-input:disabled {
     background-color: #e2e8f0;
     cursor: not-allowed;
 }
 :host(.dark) .form-input:disabled {
    background-color: #334155;
 }

.input-label {
    display: block;
    font-size: 0.875em;
    font-weight: 500;
    color: var(--subtle-text-light);
    margin-bottom: 0.25rem;
}

.grid-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) {
    .grid-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

.actions-container {
     padding-top: 1.5rem;
     border-top: 1px solid var(--border-light);
     margin-top: 2rem;
}

.button {
    width: 100%;
    font-weight: 600;
    padding: 0.875rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1em;
    transition: all 0.2s ease-in-out;
    border: none;
    cursor: pointer;
}
.button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.button:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.button-primary {
    background-color: var(--primary-color);
    color: var(--primary-text);
}
 .button-primary:hover:not(:disabled) {
     background-color: var(--primary-hover);
 }

.button-green {
    background-color: var(--green-color);
    color: var(--primary-text);
}
 .button-green:hover:not(:disabled) {
     background-color: var(--green-hover);
 }

.button-slate {
    background-color: var(--slate-color);
    color: var(--primary-text);
}
 .button-slate:hover:not(:disabled) {
     background-color: var(--slate-hover);
 }

.post-score-actions {
     display: flex;
     flex-direction: column;
     gap: 1rem;
}
 @media (min-width: 768px) {
     .post-score-actions {
         flex-direction: row-reverse;
     }
 }

.prequiz-actions {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
}

#studentInfoAlert {
    font-size: 0.9em;
    font-weight: 500;
    min-height: 1.5rem;
}
#studentInfoAlert.success {
    color: var(--green-color);
}
#studentInfoAlert.error {
    color: var(--red-color);
}

.result-area {
    padding: 2rem;
    text-align: center;
    border-bottom: 1px solid var(--border-light);
    margin-bottom: 2rem;
}
.result-area h2 {
    font-size: 1.25em;
    font-weight: 600;
    margin: 0;
}
#resultScore {
    text-align: center;
    margin: 1.5rem 0;
}

.score-main {
    font-size: 3em;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.score-percentage {
    font-size: 1.5em;
    font-weight: 600;
    opacity: 0.8;
    margin-bottom: 1rem;
}

.score-breakdown {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
}

.score-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.score-label {
    font-size: 0.9em;
    font-weight: 500;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.score-value {
    font-size: 1.25em;
    font-weight: 600;
}

@media (max-width: 768px) {
    .score-main {
        font-size: 2.5em;
    }
    
    .score-percentage {
        font-size: 1.25em;
    }
    
    .score-breakdown {
        flex-direction: column;
        gap: 1rem;
    }
    
    .score-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: var(--input-bg-light);
        border-radius: 0.5rem;
    }
}

#resultScore.high .score-main { color: var(--green-color); }
#resultScore.medium .score-main { color: var(--yellow-color); }
#resultScore.low .score-main { color: var(--red-color); }

#validationMessage {
     text-align: center;
     margin-bottom: 1rem;
     font-weight: 500;
     min-height: 1.5rem;
     font-size: 0.9em;
}
 #validationMessage.success { color: var(--green-color); }
 #validationMessage.error { color: var(--red-color); }

.hidden {
    display: none !important;
}

/* Vocabulary Grid Table Styles */
.vocab-grid-table {
    display: table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
}

.vocab-grid-header {
    display: none; /* header definitions are replaced by inline option labels */
}

.vocab-grid-header-cell {
    display: table-cell;
    padding: 1rem;
    font-weight: 600;
    text-align: left; /* left-align header text for clarity */
    border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.vocab-grid-header-cell:first-child {
    text-align: left;
    background-color: var(--primary-color);
}

.vocab-grid-header-cell:last-child {
    border-right: none;
}

.vocab-grid-row {
    display: table-row;
    background-color: var(--input-bg-light);
}

:host(.dark) .vocab-grid-row {
    background-color: var(--input-bg-dark);
}

.vocab-grid-row:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
}

:host(.dark) .vocab-grid-row:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.02);
}

.vocab-grid-cell {
    display: table-cell;
    padding: 1rem;
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    vertical-align: middle;
    text-align: left; /* ensure content aligns left by default */
}

.vocab-grid-cell:last-child {
    border-right: none;
}

.vocab-grid-row:last-child .vocab-grid-cell {
    border-bottom: none;
}

.vocab-word-cell {
    font-weight: 600;
    color: var(--text-primary);
    background-color: rgba(var(--primary-color-rgb), 0.05);
}

 .vocab-option-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: flex-start;
    padding: 0.5rem 0.6rem;
    background-color: var(--input-bg-light);
    border-radius: 0.5rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.18s, border-color 0.18s;
    width: 100%;
}

 .vocab-radio-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
    order: -1; /* move radio visually to the left of the label */
    margin-right: 0.5rem;
}

.vocab-radio-container input[type="radio"] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
}

.vocab-radio-container input[type="radio"]:disabled {
    cursor: default;
}

.vocab-option-cell.correct {
    background-color: var(--green-light-bg);
}

.vocab-option-cell.incorrect {
    background-color: var(--red-light-bg);
}

.vocab-option-cell.correct::after {
    content: " ✅";
    margin-left: 0.5rem;
}

.vocab-option-cell.incorrect::after {
    content: " ❌";
    margin-left: 0.5rem;
}

@media (max-width: 768px) {
    .vocab-grid-table {
        font-size: 0.875em;
    }
    
    .vocab-grid-cell {
        padding: 0.75rem 0.5rem;
    }
    
    .vocab-grid-header-cell {
        padding: 0.75rem 0.5rem;
        font-size: 0.8em;
    }

    /* Make the vocab grid responsive on small screens by stacking rows */
    .vocab-grid-table {
        display: block;
        overflow: visible;
        border-radius: 0.5rem;
    }

    .vocab-grid-header {
        display: none; /* hide the wide header on narrow screens */
    }

    .vocab-grid-row {
        display: block;
        margin: 0 0 0.5rem 0;
        background: transparent;
        border-radius: 0.375rem;
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .vocab-grid-cell {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0.5rem 0.75rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
    }

    .vocab-grid-cell:last-child {
        border-bottom: none;
    }

    .vocab-word-cell {
        display: block;
        width: 100%;
        font-weight: 600;
        padding-right: 0.5rem;
    }

    .vocab-option-cell {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-start;
        align-items: center;
        padding: 0.5rem 0.6rem;
        background-color: var(--input-bg-light);
        border-radius: 0.5rem;
        border: 1px solid transparent;
        cursor: pointer;
        transition: background-color 0.18s, border-color 0.18s;
        width: 100%;
    }

    .vocab-option-cell:hover {
        background-color: #e8eef8;
    }

    /* Put the radio to the left visually */
    .vocab-radio-container {
        order: -1;
        margin-right: 0.5rem;
    }

    .vocab-def-label {
        flex: 1 1 auto;
        white-space: normal;
        word-break: break-word;
        color: var(--text-light);
        font-size: 0.95em;
    }
}

.vocab-grid-header-cell {
    display: table-cell;
    padding: 1rem;
    font-weight: 600;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.8em;
}

/* Definition label shown inline on mobile stacked layout, hidden on desktop */
.vocab-def-label {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    color: var(--text-light);
    font-size: 0.95em;
}

@media (max-width: 768px) {
    .vocab-def-label {
        display: inline-block;
        white-space: normal;
        max-width: 60%;
    }
}

.cloze-word-bank {
    background-color: var(--input-bg-light);
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.25rem;
}

:host(.dark) .cloze-word-bank {
    background-color: var(--input-bg-dark);
}

.cloze-bank-title {
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--subtle-text-light);
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.cloze-bank-words {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

.cloze-bank-word {
    background-color: var(--primary-color);
    color: var(--primary-text);
    padding: 0.45rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.9em;
    font-weight: 600;
    cursor: default;
    user-select: none;
    box-shadow: 0 2px 6px rgba(79,70,229,0.08);
}

.cloze-text {
    line-height: 1.8;
    font-size: 1.05em;
    color: var(--text-light);
}

.cloze-blank {
    display: inline-block;
    min-width: 6.5ch; /* slightly narrower blanks to fit inline */
    max-width: 12ch;
    margin: 0 0.35rem;
    padding: 0.15rem 0.4rem;
    border: none;
    border-bottom: 2px solid var(--border-light);
    background: transparent;
    font-size: inherit;
    font-family: inherit;
    color: var(--text-light);
    text-align: center;
    vertical-align: baseline;
    transition: border-color 0.18s, background-color 0.18s;
}

.cloze-blank:focus {
    outline: none;
    border-bottom-color: var(--primary-color);
    background: rgba(79,70,229,0.03);
    border-radius: 0.25rem;
}

.cloze-blank.correct {
    border-bottom-color: var(--green-color);
    background-color: var(--green-light-bg);
}

.cloze-blank.correct {
    border-bottom-color: var(--green-color);
    background-color: var(--green-light-bg);
    border-radius: 0.25rem;
}
.cloze-blank.incorrect {
    border-bottom-color: var(--red-color);
    background-color: var(--red-light-bg);
    border-radius: 0.25rem;
}

.cloze-score {
    text-align: center;
    font-weight: 600;
    margin-top: 1rem;
    font-size: 1.1em;
}

@media (max-width: 768px) {
    .cloze-bank-words {
        gap: 0.375rem;
    }
    
    .cloze-bank-word {
        padding: 0.375rem 0.5rem;
        font-size: 0.8em;
    }
    .cloze-blank { min-width: 5.5ch; }
    
    .cloze-text {
        font-size: 1em;
    }
    
    .cloze-blank {
        min-width: 80px;
        padding: 0.25em 0.375em;
    }
}

/* Section headers for multiple vocab/cloze sections */
.vocab-section-header,
.cloze-section-header {
    margin: 1.5rem 0 1rem 0;
    font-size: 1.1em;
    font-weight: 600;
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.5rem;
}

.cloze-section-wrapper {
    margin-bottom: 2rem;
}

.cloze-section-wrapper:last-child {
    margin-bottom: 0;
}

/* Compact Score Report Styles */
.score-report-card {
    background-color: var(--card-bg-light);
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: left;
}

.student-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 0.5rem;
}

.student-details div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.score-summary {
    text-align: center;
    margin-bottom: 0.5rem;
}

.score-main-compact {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
}

.score-breakdown-compact {
    font-size: 0.9rem;
}

.score-breakdown-compact .score-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
}


`;
    }

    getTemplate() {
        return `
<div class="quiz-wrapper">
        <div class="container">
            <div class="quiz-card">
                <div class="quiz-header">
                    <span class="theme-toggle" title="Toggle Light/Dark Mode">
                        <span class="light-icon">☀️</span>
                        <span class="dark-icon hidden">🌙</span>
                    </span>
                    <h1 id="quizTitle">Interactive Reading</h1>
                    <p id="quizDescription">Read the passage, then answer the questions below.</p>
                </div>

                <form id="quizForm">
                    <fieldset id="studentInfoSection">
                        <legend>Student Information</legend>
                        <p class="student-instructions instruction">Please enter your Nickname, Homeroom, and Student ID before starting the quiz. / กรุณากรอกชื่อเล่น ห้องเรียน และรหัสนักเรียนของคุณก่อนเริ่มทำแบบทดสอบ</p>
                        <div>
                            <label for="nickname" class="input-label">Nickname</label>
                            <input type="text" id="nickname" name="nickname" class="form-input">
                        </div>
                        <div class="grid-container" style="margin-top: 1rem;">
                            <div>
                                <label for="homeroom" class="input-label">Homeroom</label>
                                <input type="text" id="homeroom" name="homeroom" class="form-input">
                            </div>
                            <div>
                                <label for="studentId" class="input-label">Student ID</label>
                                <input type="text" id="studentId" name="studentId" class="form-input">
                            </div>
                        </div>
                        <div class="grid-container" style="margin-top: 1rem;">
                            <div>
                                <label for="password" class="input-label">Submission Password (Optional)</label>
                                <input type="password" id="password" name="password" class="form-input" placeholder="Enter code to submit">
                            </div>
                            <div></div> <!-- Spacer for grid balance -->
                        </div>
                        <div class="prequiz-actions">
                            <button type="button" id="startQuizButton" class="button button-primary mt-4">Start Quiz</button>
                            <p id="studentInfoAlert"></p>
                        </div>
                    </fieldset>

                    <div id="quizContent" class="hidden">
                        <div id="resultArea" class="result-area hidden">
                            <h2 id="resultTitle">Your Score:</h2>
                            <div id="resultScore"></div>
                            <p id="resultMessage">Your score has been sent to your teacher automatically. Use Try Again if you want a new set of questions.</p>
                        </div>

                        <div id="postScoreActions" class="hidden" style="margin-bottom: 2rem;">
                            <p class="postscore-instructions instruction">Scores are sent automatically when you check them. If there is a problem you can resend below or click Try Again for another attempt. / ผลคะแนนจะถูกส่งอัตโนมัติเมื่อคุณกดตรวจคะแนน หากมีปัญหาคุณสามารถส่งอีกครั้งหรือกดลองอีกครั้งได้</p>
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

                        <fieldset id="readingSection">
                            <div class="legend-container">
                                <legend>Reading Passage</legend>
                            </div>
                            <p class="reading-instructions instruction">Click the play button to hear the passage, then read along and answer the questions below.</p>
                            <div class="passage-content">
                                <p id="passageText"></p>
                            </div>
                        </fieldset>

                        <fieldset id="vocabSection" class="hidden">
                            <legend>Vocabulary Matching</legend>
                            <p class="reading-instructions instruction">Select the correct definition for each vocabulary word.</p>
                            <div id="vocabGrid" class="vocab-grid-table"></div>
                            <div id="vocabScore" class="vocab-score hidden"></div>
                        </fieldset>

                        <fieldset id="clozeSection" class="hidden">
                            <legend>Fill in the Blanks</legend>
                            <p class="reading-instructions instruction">Type the missing words from the word bank below.</p>
                            <div id="clozeContainer"></div>
                            <div id="clozeScore" class="cloze-score hidden"></div>
                        </fieldset>

                        <fieldset id="questionsSection">
                            <legend>Comprehension Questions</legend>
                            <p class="reading-instructions instruction">Read each question and select the best answer from the choices below.</p>
                        </fieldset>

                        <div id="checkScoreContainer" class="actions-container">
                            <button type="submit" id="checkScoreButton" class="button button-primary">
                                Check My Score
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
`};
   


    // ── TTS LOGIC (consistent with TTS_GUIDE 1.3) ──────────────────
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
};

// Register the custom element
customElements.define('tj-quiz-element', TjQuizElement);
