const fs = require('fs');

let chatCode = fs.readFileSync('src/components/AIAssistantChat.tsx', 'utf8');
chatCode = chatCode.replace(/console\.error\(err\);/g, `
      const is429 = err && err.message && (err.message.includes("429") || err.message.includes("quota") || err.message.includes("RESOURCE_EXHAUSTED"));
      const is503 = err && err.message && err.message.includes("503");
      if (!is429 && !is503) {
        console.error(err);
      }
`);
fs.writeFileSync('src/components/AIAssistantChat.tsx', chatCode);

let allvaCode = fs.readFileSync('src/components/AllvaCreator.tsx', 'utf8');
allvaCode = allvaCode.replace(/alert\(errMsg\);/g, `
        const is429 = typeof errMsg === 'string' && (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED"));
        if (is429) {
          alert("Limite de uso da IA atingido. Por favor aguarde um momento.");
        } else {
          alert(typeof errMsg === 'string' && errMsg.length > 200 ? "Erro na comunicação com a IA." : errMsg);
        }
`);
allvaCode = allvaCode.replace(/console\.error\("Erro ao gerar lógica:", e\);/g, `if (e && !String(e).includes("429")) console.error("Erro ao gerar lógica:", e);`);
allvaCode = allvaCode.replace(/console\.error\(e\);/g, `if (e && !String(e).includes("429") && !String(e).includes("RESOURCE_EXHAUSTED")) console.error(e);`);
fs.writeFileSync('src/components/AllvaCreator.tsx', allvaCode);

let canvasCode = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');
canvasCode = canvasCode.replace(/console\.error\(err\);/g, `
      const is429 = err && err.message && (err.message.includes("429") || err.message.includes("quota") || err.message.includes("RESOURCE_EXHAUSTED"));
      if (!is429) {
        console.error(err);
      }
`);
fs.writeFileSync('src/components/CanvasEditor.tsx', canvasCode);
