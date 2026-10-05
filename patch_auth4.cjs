const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/setIsAuthenticated\(false\);/g, `// setIsAuthenticated(false);`);
fs.writeFileSync('src/App.tsx', appCode);

