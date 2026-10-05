const fs = require('fs');
let code = fs.readFileSync('src/components/AIAssistantChat.tsx', 'utf8');

if (!code.includes('handleFirestoreError')) {
  code = code.replace(
    "import { db, auth } from '../firebase';",
    "import { db, auth, handleFirestoreError, OperationType } from '../firebase';"
  );
}

const regex = /\}, \(err\) => \{\s*console\.error\("Error loading chat history:", err\);\s*\}\);/;
const replacement = `}, (err) => {
           console.error("Error loading chat history:", err);
           // handleFirestoreError(err, OperationType.GET, 'user_chats/' + user.uid);
        });`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AIAssistantChat.tsx', code);
