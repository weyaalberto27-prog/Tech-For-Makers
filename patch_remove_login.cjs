const fs = require('fs');

// We are going to ensure that ANY user gets authenticated automatically.
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(/if \(!isAuthenticated\) \{[\s\S]*?\} \/>;\s*\}/, `if (!isAuthenticated) {
    return <WelcomeScreen onComplete={() => {
      (window as any).guestAuthBypass = true;
      setIsAuthenticated(true);
    }} />;
  }`);

appCode = appCode.replace(/const \[isAuthenticated, setIsAuthenticated\] = useState<boolean \| null>\(null\);/g, `const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);
  useEffect(() => {
    (window as any).guestAuthBypass = true;
  }, []);`);

fs.writeFileSync('src/App.tsx', appCode);

