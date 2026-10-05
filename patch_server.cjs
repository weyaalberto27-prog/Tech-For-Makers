const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The original models were:
// gemini-3.6-flash
// gemini-3.1-flash-image

code = code.replace(/gemini-2\.0-flash/g, 'gemini-3.6-flash');
// The image model is the 5th occurrence probably. Let's just do a string replace for the image prompt route
code = code.replace(/model: "gemini-3\.6-flash",\s*contents: \{ parts: \[\{ text: imagePrompt \}\] \}/g, 'model: "gemini-3.1-flash-image",\n          contents: { parts: [{ text: imagePrompt }] }');

fs.writeFileSync('server.ts', code);
