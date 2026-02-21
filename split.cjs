const fs = require('fs');

const content = fs.readFileSync('src/tj-pronunciation/index.js', 'utf8');
const lines = content.split('\n');

// The styles block is lines 1 to 380 (indexes 1 to 380)
// wait, we only want the actual CSS string.
// Let's find exactly where styles starts and ends.
const startIndex = lines.findIndex(l => l.includes('const styles = `'));
const endIndex = lines.findIndex((l, index) => index > startIndex && l.trim() === '`;');

if (startIndex >= 0 && endIndex > startIndex) {
    const css = lines.slice(startIndex + 1, endIndex).join('\n');
    fs.writeFileSync('src/tj-pronunciation/styles.css', css);
    
    // Now rewrite index.js
    const newJsLines = [
        "import stylesText from './styles.css?inline';",
        ...lines.slice(0, startIndex),
        ...lines.slice(endIndex + 1)
    ];
    let newJs = newJsLines.join('\n');
    newJs = newJs.replace('styleEl.textContent = styles;', 'styleEl.textContent = stylesText;');
    
    fs.writeFileSync('src/tj-pronunciation/index.js', newJs);
    console.log('Successfully split files');
} else {
    console.log('Could not find styles block');
}
