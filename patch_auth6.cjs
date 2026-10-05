const fs = require('fs');
let allvaCode = fs.readFileSync('src/components/AllvaCreator.tsx', 'utf8');
allvaCode = allvaCode.replace(/\|\| aiQuota <= 0/g, ``);
fs.writeFileSync('src/components/AllvaCreator.tsx', allvaCode);
