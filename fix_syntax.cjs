const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/if \(\!is503 && \!is429\) console\.error\(err\); = err\.status === 503 \|\| \(err\.message && err\.message\.includes\("503"\)\);/g, 
  "if (!is503 && !is429) console.error(err);");

fs.writeFileSync('server.ts', code);
