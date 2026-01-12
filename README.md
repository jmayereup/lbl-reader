# LBL Reader & Grammar Hearts

A collection of interactive web components for language learning, designed to be easily embedded into blogs or websites.

## Components

### 1. LBL Reader (`<lbl-reader>`)
An interactive story reader that highlights words, provides text-to-speech, and includes vocabulary and memory activities.

#### Usage
```html
<script src="path/to/lbl-reader.js" defer></script>

<lbl-reader 
  lang-original="en" 
  lang-translation="th" 
  story-title="My Daily Routine">
[
  {
    "original": "I wake up at 7 AM every day.",
    "fullTranslation": "ฉันตื่นนอนตอน 7 โมงเช้าทุกวัน",
    "translationOptions": ["ตื่นนอน", "นอนหลับ", "แปรงฟัน"],
    "correctTranslationIndex": 0,
    "highlightIndex": 1
  },
  {
    "original": "Then I drink a cup of coffee.",
    "fullTranslation": "หลังจากนั้นฉันดื่มกาแฟหนึ่งถ้วย",
    "translationOptions": ["ดื่ม", "กิน", "ทำ"],
    "correctTranslationIndex": 0,
    "highlightIndex": 2
  }
]
</lbl-reader>
```

#### Attributes
- `lang-original`: The language code for the story (e.g., "en", "es").
- `lang-translation`: The language code for translations (e.g., "th", "fr").
- `story-title`: The title shown in reports.
- `lesson-id`: (Optional) Used for deep linking in mobile browsers.

---

### 2. Grammar Hearts (`<grammar-hearts>`)
A gamified grammar practice component with multiple-choice, fill-in-the-blank, and sentence scrambling activities.

#### Usage
```html
<script src="path/to/grammar-hearts.js" defer></script>

<grammar-hearts hearts="3" round-size="10">
[
{
  "title": "Daily Routines Quiz",
  "hint": {
    "summary": "Present Simple vs Present Continuous",
    "content": "Use **Present Simple** for habits. Use **Present Continuous** for actions happening now."
  },
  "questions": [
    {
      "type": "multiple-choice",
      "instruction": "Choose the correct form:",
      "question": "She ___ (work) every day.",
      "options": ["works", "is working", "work"],
      "correctIndex": 0,
      "explanation": "We use **Present Simple** for habits."
    },
    {
      "type": "fill-in-the-blank",
      "instruction": "Fill in the blank:",
      "question": "I ___ to school right now.",
      "answer": "am walking",
      "explanation": "Action happening **right now**."
    },
    {
      "type": "scramble",
      "instruction": "Unscramble the sentence:",
      "sentence": "They are playing football now.",
      "explanation": "Subject + are + verb-ing."
    }
  ]
}
]
</grammar-hearts>
```

#### Attributes
- `hearts`: Number of lives before game over (default: 3).
- `round-size`: Number of questions per round (default: 5).

### Speed Review (`tj-speed-review`)

A fast-paced review activity with a countdown timer. Points are awarded based on how quickly the student answers.

**Attributes:**
- `time-limit`: Seconds per question (default: `15`).
- `round-size`: Number of questions to pick from the pool (default: `10`).

**JSON Schema:**
```json
[
  {
    "title": "Topic Title",
    "questions": [
      {
        "category": "Optional Label",
        "question": "The question text...",
        "options": ["Choice A", "Choice B", "Choice C"],
        "answer": "Choice A",
        "explanation": "Markdown **feedback**..."
      }
    ]
  }
]
```

## How to use in a Blog (WordPress, Blogger, etc.)

1.  **Upload the JavaScript files**: Host `lbl-reader.js` and `grammar-hearts.js` on your server or a CDN.
2.  **Add the Script Tags**: Add the script tags to your blog post (using a "Custom HTML" block).
3.  **Embed the Component**: Paste the HTML for the component and your JSON data directly into the post.
4.  **Fonts**: These components look best with the 'Outfit' and 'Inter' fonts. You can add them with:
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    ```
