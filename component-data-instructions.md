# Component Data Instructions

This document explains how to pass data to the web components in this library, detailing the different delivery methods, how `tj-quiz-element` differs, and why the property method is advantageous.

## 1. How Components Expect Data

All components in the `tj-components` library uniformly check for their configuration data in a specific order of precedence, supporting four different delivery methods:

1. **Property Method:** Setting the JS property directly (e.g., `element.config = data`)
2. **Attribute Method:** Using an HTML attribute (e.g., `<tj-component config='{"key": "value"}'>`)
3. **Script Tag Method:** Placing a script tag inside the component (e.g., `<script type="application/json">...</script>`)
4. **Text Content Method:** Placing raw text directly inside the component tags (e.g., `<tj-component>...</tj-component>`)

### Standard Components (JSON Format)
Most components (such as `tj-chapter-book`, `tj-info-gap`, `tj-speed-review`, `tj-listening`, etc.) expect their configuration data to be structured as **JSON**. If the data is passed as a string via an attribute, script tag, or text content, the component uses `JSON.parse()` to decode it into a JavaScript object.

### The `tj-quiz-element` Difference (Markdown-like Format)
Unlike the standard components, `tj-quiz-element` expects a **custom Markdown-like text string** instead of JSON. 
It analyzes the text by splitting it at `---` dividers and then parses specific labeled sections.

Headers include (but are not limited to):
- `text` or `text-listening` (for reading passages)
- `vocab` or `vocab-N` (for vocabulary matching)
- `cloze` or `cloze-N` (for fill-in-the-blank)
- `instructions` (for instruction blocks)
- `questions` or `questions-N` (for multiple choice questions)
- `audio` (e.g., `audio-src = URL`)

Because it utilizes line breaks and specific formatting, using `<script type="text/markdown">` or raw text content is generally the cleanest way to author `tj-quiz-element` content directly in HTML. This avoids the severe quote-escaping issues that would emerge if you tried to stuff multiline markdown into an HTML attribute.

## 2. Advantages of the Property Method (`element.config`)

Setting the data via the JavaScript property (`element.config = data;`) provides several major advantages over using HTML attributes (`element.setAttribute('config', '...')`):

- **No Serialization Overhead:** You can pass JavaScript Objects directly without calling `JSON.stringify()`. The component can bypass `JSON.parse()`, improving performance—especially for large datasets.
- **Cleaner DOM (No Element Bloat):** Massive JSON structures turn into extremely long string values in HTML attributes. Using properties keeps your DOM tree clean, performant, and easy to inspect in developer tools.
- **No Escaping Issues:** Quotes inside quotes (`'{"title": "Let\'s Go!"}'`) cause endless syntax and escaping issues in HTML attributes. Properties ignore HTML parsing entirely, preventing these quoting conflicts.
- **Modern Framework Integration:** Modern frontend frameworks (like React, Vue, Lit, and Svelte) strongly prefer binding complex structured state (objects/arrays) to DOM *properties* rather than stringified HTML *attributes*. Supporting the `config` property makes these components inherently framework-agnostic and easy to implement.
