'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

export default function ChatWidget({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: text }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { id: data.chatMessageId, text: data.message, sender: 'ai' }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg = error.name === 'AbortError' 
        ? "The connection timed out. Please try again." 
        : "I'm sorry, I encountered an error connecting to my servers.";
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: errorMsg, sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const submitFeedback = async (chatMessageId: string, isHelpful: boolean) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatMessageId, isHelpful }),
      });
      alert('Thank you for your feedback! This helps us improve.');
    } catch (error) {
      console.error('Failed to submit feedback', error);
    }
  };

  const toggleVoiceInput = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      // Auto-send voice input
      handleSendMessage(transcript);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform z-50"
      >
        <MessageSquare size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] flex flex-col glass-panel overflow-hidden z-50">
      {/* Header */}
      <div className="bg-white/80 border-b border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Policy Assist AI</h3>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
            </span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <div className="text-4xl mb-4">👋</div>
            <p>Hi! Ask me anything about your policies, claims, or coverage.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`p-3 rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'}`}>
              {msg.text}
            </div>
            {msg.sender === 'ai' && msg.id !== Date.now().toString() && (
              <div className="flex gap-2 mt-1 ml-1">
                <button onClick={() => submitFeedback(msg.id, true)} className="text-slate-400 hover:text-blue-500 transition-colors" title="Helpful">
                  <ThumbsUp size={14} />
                </button>
                <button onClick={() => submitFeedback(msg.id, false)} className="text-slate-400 hover:text-red-500 transition-colors" title="Not Helpful">
                  <ThumbsDown size={14} />
                </button>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="self-start max-w-[85%] bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-blue-500" />
            <span className="text-sm text-slate-500">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-end gap-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(inputValue);
            }
          }}
          placeholder="Type your message..."
          className="flex-1 max-h-32 min-h-[44px] bg-slate-100 rounded-xl px-4 py-2 outline-none resize-none"
          rows={1}
        />
        <button 
          onClick={toggleVoiceInput}
          className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          <Mic size={20} />
        </button>
        <button 
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim()}
          className="p-3 rounded-full bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
