const fs = require('fs');
let content = fs.readFileSync('src/tj-pronunciation/index.js', 'utf8');
content = content.replace(/\\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');
fs.writeFileSync('src/tj-pronunciation/index.js', content);
