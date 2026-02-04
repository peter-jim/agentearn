import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
    message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isAI = message.role === 'ai';

    return (
        <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
            <div className={`flex items-start gap-3 max-w-[80%] ${!isAI && 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}>
                    {isAI ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                </div>

                {/* Message Content */}
                <div className={`rounded-2xl px-4 py-3 ${isAI
                        ? 'bg-slate-800 text-slate-100'
                        : 'bg-indigo-600 text-white'
                    }`}>
                    {message.isTyping ? (
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
