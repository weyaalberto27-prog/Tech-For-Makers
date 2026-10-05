const fs = require('fs');

let allvaCode = fs.readFileSync('src/components/AllvaCreator.tsx', 'utf8');
// Let's remove the quota check completely so users aren't bothered with limits
allvaCode = allvaCode.replace(/if \(aiQuota <= 0\) \{[\s\S]*?return;\s*\}/g, ``);
fs.writeFileSync('src/components/AllvaCreator.tsx', allvaCode);

