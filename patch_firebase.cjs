const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

const regex = /if \(configAny\.firestoreDatabaseId\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
const replacement = `if (configAny.firestoreDatabaseId) {
      db = getFirestore(app, configAny.firestoreDatabaseId);
    } else {
      db = getFirestore(app);
    }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/firebase.ts', code);
