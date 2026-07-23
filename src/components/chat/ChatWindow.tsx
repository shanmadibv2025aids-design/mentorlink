import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Mentor } from '../../types';
import { chatService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Lightbulb,
  ArrowDown,
} from 'lucide-react';

interface ChatWindowProps {
  mentor?: Mentor;
  initialMessage?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ mentor, initialMessage }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    const welcomeMsg: ChatMessage = {
      id: 'welcome_1',
      senderId: mentor ? mentor.id : 'ai_guide',
      senderName: mentor ? mentor.name : 'MentorLink AI Career Advisor',
      senderAvatar: mentor ? mentor.avatar : undefined,
      isAi: !mentor,
      text: mentor
        ? `Hello! I'm ${mentor.name}, ${mentor.title} at ${mentor.company}. How can I assist with your career or engineering goals today?`
        : `Hi ${user?.name || 'there'}! I am your AI Mentorship Advisor. Ask me anything about System Design, interview prep, resume optimization, or matching with industry experts.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How do I prepare for Senior Engineer System Design interviews?',
        'Can you review my resume bullet points?',
        'What skills are most in demand for AI engineering?',
      ],
    };

    setMessages([welcomeMsg]);

    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [mentor]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: 'user_msg_' + Date.now(),
      senderId: user?.id || 's1',
      senderName: user?.name || 'Student',
      senderAvatar: user?.avatar,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await chatService.sendMessage({
        mentorId: mentor?.id,
        studentId: user?.id || 's1',
        message: text,
        history: messages,
      });

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] rounded-2xl bg-[#0D0D0D] border border-white/5 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#151515] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {mentor ? (
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
          )}

          <div>
            <h3 className="font-bold text-white text-base">
              {mentor ? mentor.name : 'MentorLink AI Career Advisor'}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {mentor ? `${mentor.title} @ ${mentor.company}` : 'Powered by Gemini 2.0 API'}
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          API Endpoint: POST /chat
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.senderId === user?.id || msg.senderId === 's1';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isUser && (
                <div className="shrink-0 mt-1">
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                </div>
              )}

              <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-500">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                      : 'bg-[#18181B] text-slate-200 rounded-tl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggestions Pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {msg.suggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(suggestion)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3 rounded-2xl bg-[#18181B] text-slate-400 text-xs flex items-center gap-2 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              AI Assistant is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-[#151515]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mentor
                ? `Ask ${mentor.name} a question or topic...`
                : 'Ask AI Assistant for advice, resume review, or matching tips...'
            }
            className="flex-1 px-4 py-3 rounded-xl bg-[#18181B] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-md shadow-blue-500/20 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
