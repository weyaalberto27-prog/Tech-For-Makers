const fs = require('fs');
let chatCode = fs.readFileSync('src/components/AIAssistantChat.tsx', 'utf8');

const regex = /const user = auth\?\.currentUser;\s*const isBypassedGuest = typeof window !== 'undefined' && \(window as any\)\.guestAuthBypass === true;\s*if \(user && db && \!auth\?\.isDummy && \!auth\?\.isAnonymous && \!isBypassedGuest\) \{/g;

chatCode = chatCode.replace(regex, `const user = auth?.currentUser;
    const isBypassedGuest = typeof window !== 'undefined' && (window as any).guestAuthBypass === true;
    if (user && db && !auth?.isDummy && !auth?.isAnonymous && !isBypassedGuest) {`);

fs.writeFileSync('src/components/AIAssistantChat.tsx', chatCode);

