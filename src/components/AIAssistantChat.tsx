import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, Sparkles, Copy, Check, MessageSquarePlus, Trash2, Paperclip, Image as ImageIcon } from 'lucide-react';
import { useEditor } from '../store';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'react-markdown';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const isBlock = match || String(children).includes('\n');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isBlock) {
    return (
      <div className="relative my-3 bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center px-3 py-1.5 bg-black/40 border-b border-white/10">
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{match ? match[1] : 'Code'}</span>
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            title="Copiar código"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px] font-medium">{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
        <div className="p-3 overflow-x-auto text-xs font-mono text-gray-200">
          <code className={className} {...props}>{children}</code>
        </div>
      </div>
    );
  }

  return <code className="bg-black/30 px-1.5 py-0.5 rounded text-teal-300 font-mono text-xs border border-white/5" {...props}>{children}</code>;
};

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  imageBase64?: string;
}

export function AIAssistantChat({ onClose, inline, onAddParts }: { onClose: () => void, inline?: boolean, onAddParts?: (parts: any[]) => void }) {
  const { mode, userMode, activeTutorialId, elements, pcbElements, addElement } = useEditor();

  const getInitialMessage = () => {
    if (activeTutorialId === 'blink') {
      return 'Olá! Bem-vindo ao exemplo Pisca LED! Vamos ligar o LED ao Arduino e programá-lo passo-a-passo.\n1. Adicione um resistor em série com o LED.\n2. Ligue o resistor ao pino 13 do Arduino.\n3. Ligue o GND do LED ao GND do Arduino.\nDiga "próximo" quando quiser avançar, ou pergunte se tiver dúvidas.';
    } else if (activeTutorialId === 'motor') {
      return 'Olá! Exemplo de Controle de Motor DC carregado. O motor precisa de mais energia, por isso temos uma bateria de 9V.\nLigue a bateria ao motor e intercale o botão (Switch) para poder ligar e desligar. Diga "ajuda" para ver mais passos.';
    } else if (activeTutorialId === 'simple') {
      return 'Olá! Circuito simples com LED e bateria. Tente ligar o pólo positivo (+) da bateria ao resistor, e do resistor ao ânodo (pino longo) do LED. Dúvidas? Pergunte-me!';
    }
    if (onAddParts) return 'Olá! Sou a Allva AI. Estou no modo de Construção 3D. Posso criar estruturas arquitetônicas detalhadas e realistas (como carros complexos, casas detalhadas, drones) usando formas geométricas. O que vamos construir de forma hiper-realista hoje?';
    return 'Olá! Sou a sua Assistente IA de Eletrónica. Em que posso ajudá-lo com o seu circuito hoje?';
  };

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    const loadChat = () => {
      const user = auth?.currentUser;
      if (user && db && !auth?.isDummy) {
        const docRef = doc(db, 'user_chats', user.uid);
        unsubscribe = onSnapshot(docRef, (snap) => {
           if (!isMounted) return;
           if (snap.exists()) {
             setMessages(snap.data().messages || []);
           } else {
             setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
           }
        }, (err) => {
           console.error("Error loading chat history:", err);
        });
      } else {
        try {
          const saved = localStorage.getItem('ai_chat_history');
          if (saved) {
             const parsed = JSON.parse(saved);
             if (parsed && parsed.length > 0) {
               setMessages(parsed);
               return;
             }
          }
        } catch(e) {}
        setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
      }
    };
    
    const authUnsub = (auth as any)?.onAuthStateChanged?.(() => {
       loadChat();
    });
    
    if (!(auth as any)?.onAuthStateChanged) {
        loadChat();
    }

    return () => {
       isMounted = false;
       unsubscribe();
       if (authUnsub) authUnsub();
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const user = auth?.currentUser;
    if (user && db && !auth?.isDummy) {
      setDoc(doc(db, 'user_chats', user.uid), { messages, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    } else {
      localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);
  const [inputValue, setInputValue] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTutorialId) {
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
    }
  }, [activeTutorialId]);
  
  const handleNewChat = () => {
    setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  
  const handleSend = async () => {
    if ((!inputValue.trim() && !attachedImage) || isTyping) return;
    
    const userText = inputValue.trim() || (attachedImage ? "Imagem anexada." : "");
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: userText,
      ...(attachedImage && { imageBase64: attachedImage })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setAttachedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMsg],
          mode,
          circuit: mode === 'schematic' ? elements : pcbElements,
          allvaCreatorMode: !!onAddParts
        })
      });
      let data;
      try {
        if (!response.ok) {
           const errText = await response.text();
           let errMsg = 'Erro na API';
           try { errMsg = JSON.parse(errText).error || errMsg; } catch(e) {}
           throw new Error(errMsg);
        }
        data = await response.json();
      } catch(e: any) {
         throw new Error(e.message || "Erro na conexão");
      }
      
      let replyText = data.reply || "Desculpe, não consegui gerar uma resposta.";
      
      // Auto-complete logic
      const jsonMatch = replyText.match(/\x60\x60\x60json\n([\s\S]*?)\n\x60\x60\x60/);
      if (jsonMatch) {
        try {
          const actionData = JSON.parse(jsonMatch[1]);
          if (actionData.action === 'build_3d' && onAddParts) {
             replyText = replyText.replace(jsonMatch[0], '\n*(Construindo objeto 3D na tela...)*\n');
             if (actionData.parts) {
               onAddParts(actionData.parts);
             }
          }
          else if (actionData.action === 'autocomplete') {
             replyText = replyText.replace(jsonMatch[0], '\n*(Auto-completando circuito na tela...)*\n');
             if (actionData.components) {
               actionData.components.forEach((c: any) => {
                 addElement({
                                      type: 'component',
                   componentType: c.type,
                   x: c.x || 0,
                   y: c.y || 0,
                   rotation: 0,
                   name: c.type.toUpperCase(),
                   value: c.value
                 });
               });
             }
             if (actionData.wires) {
                actionData.wires.forEach((w: any) => {
                  addElement({
                                        type: 'wire',
                    points: w.points
                  });
                });
             }
          }
        } catch(e) {
          console.error("JSON parse error from AI:", e);
        }
      }

      const newAiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: replyText };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (err: any) {
      console.error(err);
      let errorText = "Ocorreu um erro ao comunicar com a IA. Por favor, tente novamente.";
      if (err.message && err.message.includes("503")) {
          errorText = "A IA está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
      } else if (err.message && err.message.includes("overloaded")) {
          errorText = "A IA está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
      } else if (err.message && err.message.includes("high demand")) {
          errorText = "A IA está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
      } else if (err.message) {
          errorText = "Erro: " + err.message;
      }
      const newAiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: errorText };
      setMessages(prev => [...prev, newAiMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className={`flex flex-col ${inline ? "h-full w-full" : "h-[40vh] md:h-full bg-[#16161a] border-t md:border-t-0 md:border-r border-[#2d2d33] w-full md:w-80 shrink-0 shadow-2xl relative z-40 rounded-t-xl md:rounded-none"}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d2d33] bg-[#121215] rounded-t-xl md:rounded-none">
        <div className="flex items-center text-teal-400">
          <Sparkles className="w-4 h-4 mr-2" />
          <h3 className="text-sm font-bold tracking-wide">Assistente IA</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleNewChat} className="text-gray-400 hover:text-teal-400 transition p-1 rounded hover:bg-[#2d2d33]" title="Novo Chat">
            <MessageSquarePlus className="w-4 h-4" />
          </button>
          <button onClick={handleNewChat} className="text-gray-400 hover:text-red-400 transition p-1 rounded hover:bg-[#2d2d33]" title="Limpar Histórico">
            <Trash2 className="w-4 h-4" />
          </button>
          {!inline && <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-[#2d2d33]" title="Fechar">
            <X className="w-4 h-4" />
          </button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0f0f13]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-[#2d2d33] text-gray-200 rounded-tl-none border border-[#3d3d45]'}`}>
               {msg.sender === 'ai' && (
                 <div className="flex items-center mb-1 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                   <Bot className="w-3 h-3 mr-1" />
                   Allva AI
                 </div>
               )}
               {msg.imageBase64 && (
                 <div className="mb-2 max-w-[200px] rounded overflow-hidden border border-black/20">
                   <img src={msg.imageBase64} alt="Attached" className="w-full h-auto" />
                 </div>
               )}
               <div className="whitespace-pre-wrap break-words markdown-body text-[13px]">
                 {msg.sender === 'user' ? (
                   msg.text
                 ) : (
                   <Markdown
                     components={{
                       code: CodeBlock,
                       p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                       strong: ({node, ...props}) => <strong className="font-bold text-teal-300" {...props} />,
                       ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                       ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                       li: ({node, ...props}) => <li {...props} />,
                     }}
                   >
                     {msg.text}
                   </Markdown>
                 )}
               </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-[#2d2d33] text-gray-200 rounded-lg p-3 rounded-tl-none border border-[#3d3d45] flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#121215] border-t border-[#2d2d33]">
        <div className="flex flex-col bg-[#0f0f13] border border-[#2d2d33] rounded-lg p-1 focus-within:border-teal-500 transition-colors">
          {attachedImage && (
            <div className="relative inline-block m-2 w-16 h-16 rounded border border-[#2d2d33] overflow-hidden group">
              <img src={attachedImage} alt="attachment" className="w-full h-full object-cover" />
              <button 
                onClick={() => setAttachedImage(null)}
                className="absolute top-0.5 right-0.5 bg-black/70 rounded p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-center w-full">
            <button 
              type="button"
              className="p-1.5 text-gray-500 hover:text-teal-400 transition-colors rounded-md hover:bg-[#2d2d33]"
              title="Anexar imagem"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setAttachedImage(ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre o circuito..."
              className="flex-1 bg-transparent border-none text-sm text-white px-3 py-1.5 focus:outline-none placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={(!inputValue.trim() && !attachedImage) || isTyping}
              className="p-1.5 text-teal-500 hover:text-teal-400 disabled:text-gray-600 disabled:hover:text-gray-600 transition-colors rounded-md hover:bg-[#2d2d33]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        {userMode === 'beginner' && (
          <p className="text-[9px] text-gray-500 text-center mt-2">Dica: A IA pode sugerir ligações e código para os componentes.</p>
        )}
      </div>
    </div>
  );
}
