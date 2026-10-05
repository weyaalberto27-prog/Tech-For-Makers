const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/if \(!\(window as any\)\.guestAuthBypass\) \{/g, `// always evaluate`);
fs.writeFileSync('src/App.tsx', appCode);

let welcomeCode = fs.readFileSync('src/components/WelcomeScreen.tsx', 'utf8');
welcomeCode = welcomeCode.replace(/<button\s+onClick=\{handleGuestSignIn\}/g, `<button\n                onClick={() => { (window as any).guestAuthBypass = true; onComplete(); }}\n                `);
welcomeCode = welcomeCode.replace(/const handleGuestSignIn = async \(\) => \{[\s\S]*?\} catch \(err: any\) \{[\s\S]*?\} finally \{[\s\S]*?\}\s*\};/g, `
  const handleGuestSignIn = async () => {
    (window as any).guestAuthBypass = true;
    onComplete();
  };`);
fs.writeFileSync('src/components/WelcomeScreen.tsx', welcomeCode);
