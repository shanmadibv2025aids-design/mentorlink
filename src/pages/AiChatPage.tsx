import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mentorService } from '../services/api';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Sparkles, Bot, MessageSquare } from 'lucide-react';

export const AiChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mentorId = searchParams.get('mentorId');

  const { data: mentor } = useQuery({
    queryKey: ['chatMentor', mentorId],
    queryFn: () => (mentorId ? mentorService.getMentorById(mentorId) : null),
    enabled: !!mentorId,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-400" />
            {mentor ? `Chat with ${mentor.name}` : 'AI Career Advisor & Mentor Assistant'}
          </h1>
          <p className="text-xs text-slate-400">
            Real-time interactive career guidance, interview preparation, and technical Q&A.
          </p>
        </div>
      </div>

      <ChatWindow mentor={mentor || undefined} />

    </div>
  );
};
