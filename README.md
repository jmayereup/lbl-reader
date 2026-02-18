# TJ Components

A collection of premium, interactive web components for language learning, designed to be easily embedded into blogs or websites.

## CDN & Quick Start

You can use these components directly without downloading them by linking to the GitHub Pages CDN:

```html
<!-- Components -->
<script src="https://jmayereup.github.io/tj-components/lbl-reader.js" defer></script>
<script src="https://jmayereup.github.io/tj-components/grammar-hearts.js" defer></script>
<script src="https://jmayereup.github.io/tj-components/tj-info-gap.js" defer></script>
<script src="https://jmayereup.github.io/tj-components/tj-listening.js" defer></script>
<script src="https://jmayereup.github.io/tj-components/speed-review.js" defer></script>
<script src="https://jmayereup.github.io/tj-components/tj-quiz-element.js" defer></script>
<script src="https://jmayereup.github.io/tj-components/tj-chapter-book.js" defer></script>

<!-- Required Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

## Global Features

### 📄 Report Cards
Most components now include a "Report Card" feature. Students are prompted for their nickname and student number, generating a modal report card that they can screenshot and send to their teacher.

### 🎧 Unified Voice Selection
A consistent, icon-based voice selection overlay is available on components with Text-to-Speech. It automatically suggests the "Best" available voice for the target language while allowing students to choose alternatives.

### 🔗 Share as Quiz
By appending `?quiz=1` to the URL, components like `tj-listening` will hide transcripts and other "help" elements, turning the activity into a pure assessment mode.

---

## Components

### 1. LBL Reader (`<lbl-reader>`)
An interactive story reader with word highlighting, TTS, and automatic memory matching activities.

#### Usage
```html
<lbl-reader lang-original="en" lang-translation="th" story-title="My Daily Routine">
[
  {
    "original": "I wake up at 7 AM every day.",
    "fullTranslation": "ฉันตื่นนอนตอน 7 โมงเช้าทุกวัน",
    "translationOptions": ["ตื่นนอน", "นอนหลับ", "แปรงฟัน"],
    "correctTranslationIndex": 0,
    "highlightIndex": 1
  }
]
</lbl-reader>
```

---

### 2. Grammar Hearts (`<grammar-hearts>`)
A gamified grammar practice component with multiple-choice, fill-in-the-blank, and sentence scrambling.

#### Usage
```html
<grammar-hearts hearts="3" round-size="10">
{
  "title": "Daily Routines Quiz",
  "hint": {
    "summary": "Present Simple vs Continuous",
    "content": "Use **Present Simple** for habits."
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "She ___ (work) every day.",
      "options": ["works", "is working"],
      "correctIndex": 0
    }
  ]
}
</grammar-hearts>
```

---

### 3. Info Gap (`<tj-info-gap>`)
A communication-focused component for paired or single-player practice.

#### Attributes
- `player_count`: (Optional) Defaults to 2.

#### JSON Example
```json
{
  "topic": "Ordering Delivery",
  "scenario_description": "Ask your partner the questions.",
  "player_count": 2,
  "blocks": [
    {
      "text_holder_id": 1,
      "text": "Wanchai wants pad thai.",
      "questions": [
        { "asker_id": 2, "question": "What does he want?", "options": ["Pad Thai", "Rice"], "correct_answer": "Pad Thai" }
      ]
    }
  ]
}
```

---

### 4. Listening (`<tj-listening>`)
A comprehensive listening lesson including vocabulary preview, dialogue playback, and comprehension quiz.

#### Attributes
- `audio-listening`: (Optional) URL to an MP3 for the main dialogue.

#### JSON Example
```json
{
  "title": "Ordering Food",
  "lang": "en-US",
  "intro": { "text": "Listen to the waiter..." },
  "vocab": [
    { "word": "bill", "definition": "Charges for food.", "example": "Bill please." }
  ],
  "listening": {
    "transcript": "Waiter: Hello...",
    "questions": [
      { "question": "What did they order?", "options": ["Food", "Drink"], "correct": "Food" }
    ]
  }
}
```

---

### 5. Speed Review (`tj-speed-review`)
A fast-paced review activity with a countdown timer.

#### Attributes
- `time-limit`: Seconds per question (default: 15).
- `round-size`: Number of questions from pool (default: 10).

---

### 6. Quiz Element (`<tj-quiz-element>`)
A flexible quiz component supporting reading passages, vocabulary matching, and cloze (fill-in-the-blank) sections. Optimized for Google Apps Script integration.

#### Usage
```html
<tj-quiz-element submission-url="YOUR_GAS_URL">
  My Quiz Title
  ---text
  This is a reading passage...
  ---instructions
  Choose the best answer for each question.
  ---questions-3
  Q: What happened?
  A: Nothing
  A: Everything [correct]
  ---vocab-5
  Word: Definition
  Concept: Explanation
  ---cloze-2
  The [cat] sat on the [mat].
</tj-quiz-element>
```

#### Key Features
- **Limiters**: Append `-N` to any section header (e.g., `---questions-3`) to display exactly N random items from that section.
- **Instructions**: Use `---instructions` to add a header and body text between activities.
- **Vocab Syntax**: Use `Word: Definition` (one per line) for vocabulary matching sections.

---

### 7. Chapter Book (`<tj-chapter-book>`)
A multi-chapter reading companion with built-in TTS, translation toggles, and per-chapter comprehension quizzes.

#### Usage
```html
<tj-chapter-book>
{
  "title": "My Adventure",
  "chapters": [
    {
      "title": "Chapter 1",
      "text": "Once upon a time...",
      "translation": "กาลครั้งหนึ่ง...",
      "quiz": [
        { "question": "Who was there?", "options": ["Hero", "Villain"], "answer": 0 }
      ]
    }
  ]
}
</tj-chapter-book>
```

---

## How to use in a Blog (WordPress, Blogger, etc.)

1.  **Add Script Tags**: Add the CDN script tags to your blog post (Custom HTML block).
2.  **Embed Component**: Paste the component tag and your JSON data directly into the post.
3.  **Fonts**: Ensure the Google Fonts link is included.
