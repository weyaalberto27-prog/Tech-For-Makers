const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

code = code.replace(/db = getFirestore\(app\);\s*\}\);\s*\}/, "db = getFirestore(app);\n    }");
fs.writeFileSync('src/firebase.ts', code);
