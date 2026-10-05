const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(/\/\/\s*always evaluate\s*setIsAuthenticated\(!!user \|\| !!\(window as any\)\.guestAuthBypass\);\s*\}/g, `
            // always evaluate
            setIsAuthenticated(!!user || !!(window as any).guestAuthBypass);
`);

fs.writeFileSync('src/App.tsx', appCode);

