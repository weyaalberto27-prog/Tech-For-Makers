const fs = require('fs');

// Also in AIAssistantChat, make sure we fallback correctly if not logged in
let chatCode = fs.readFileSync('src/components/AIAssistantChat.tsx', 'utf8');
chatCode = chatCode.replace(/if \(user && db && \!auth\?\.isDummy && \!auth\?\.isAnonymous\) \{/g, `
    const isBypassedGuest = typeof window !== 'undefined' && (window as any).guestAuthBypass === true;
    if (user && db && !auth?.isDummy && !auth?.isAnonymous && !isBypassedGuest) {
`);
// Let's modify the useEffect hook block entirely for saving:
const regex = /if \(user && db && \!auth\?\.isDummy && \!auth\?\.isAnonymous && \!isBypassedGuest\) \{([\s\S]*?)catch\(console\.error\);\s*\} else \{([\s\S]*?)\}/;
chatCode = chatCode.replace(regex, `if (user && db && !auth?.isDummy && !auth?.isAnonymous && !isBypassedGuest) {$1catch(console.error);
    } else {$2}`);
fs.writeFileSync('src/components/AIAssistantChat.tsx', chatCode);

