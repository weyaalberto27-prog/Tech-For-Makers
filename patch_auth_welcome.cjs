const fs = require('fs');

// We are going to ensure that ANY user gets authenticated automatically.
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
// ensure welcome screen doesn't block loading
appCode = appCode.replace(/if \(!isAuthenticated\) \{[\s\S]*?\} \/>;\s*\}/, `if (false) {
    return null;
  }`);
fs.writeFileSync('src/App.tsx', appCode);
