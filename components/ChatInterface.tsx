import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Minimize2, Maximize2, Bot } from 'lucide-react';
import { getChatResponseStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

interface ChatInterfaceProps {
  onClose: () => void;
  isOpen: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose, isOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: '你好，我是你的灵性向导。关于命理、星象或内心的困惑，尽可问我。', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));

      const streamResult = await getChatResponseStream(history, userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      let fullText = "";
      
      // Add placeholder message
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', timestamp: Date.now() }]);

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
             fullText += c.text;
             setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
        }
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: '抱歉，灵性连接暂时中断...', timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-paper-50 rounded-2xl shadow-2xl flex flex-col border border-gold-400/20 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-ink-900 text-paper-50 p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400">
             <Bot size={18} />
           </div>
           <div>
             <h3 className="font-serif font-bold text-sm">灵性向导</h3>
             <div className="text-[10px] text-gray-400 flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
             </div>
           </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={18}/></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-ink-800 text-white rounded-br-none' 
                : 'bg-white text-ink-900 border border-ink-900/5 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-xl border border-ink-900/5 rounded-bl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white rounded-b-2xl border-t border-ink-900/5">
         <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="询问星象或运势..."
              className="flex-1 bg-paper-100 border border-ink-900/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center hover:bg-gold-600 transition disabled:opacity-50"
            >
              <Send size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;