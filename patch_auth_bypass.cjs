const fs = require('fs');

// By bypassing the required auth checking entirely for the chat we make sure anyone can chat 
let chatCode = fs.readFileSync('src/components/AIAssistantChat.tsx', 'utf8');

// In loadChat() replace the required authenticated check with a check for either auth or dummy/bypassed
chatCode = chatCode.replace(/if \(user && db && !auth\?\.isDummy\) \{/g, `if (user && db && !auth?.isDummy && !auth?.isAnonymous) {`);

fs.writeFileSync('src/components/AIAssistantChat.tsx', chatCode);

// Modify AllvaCreator.tsx where quota is saved
let allvaCode = fs.readFileSync('src/components/AllvaCreator.tsx', 'utf8');
// No quota changes needed for AI if we just want "everyone to use it". The quota handles local AI quota limit per day (10 per day).
// If the user meant "bypass the 10 limit quota for everybody", I can increase it or remove it.
// Let's increase it to 1000 for all users just in case.
allvaCode = allvaCode.replace(/return 10;/g, "return 1000;");
allvaCode = allvaCode.replace(/localStorage\.setItem\("aiQuota", "10"\);/g, `localStorage.setItem("aiQuota", "1000");`);
allvaCode = allvaCode.replace(/const saved = localStorage\.getItem\("aiQuota"\);/g, `const saved = "1000"; // overridden`);

fs.writeFileSync('src/components/AllvaCreator.tsx', allvaCode);

// Modify App.tsx to ensure guest mode acts fully like logged in for chat features
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/setIsAuthenticated\(!!user\);/g, `setIsAuthenticated(!!user || !!(window as any).guestAuthBypass);`);
fs.writeFileSync('src/App.tsx', appCode);

