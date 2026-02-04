import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProjectDraft, Project } from '../types';
import { ChatAI } from '../utils/chatAI';
import MessageBubble from './MessageBubble';

interface ChatProjectSubmissionProps {
    onClose: () => void;
    onSubmit: (project: Project) => void;
}

const ChatProjectSubmission: React.FC<ChatProjectSubmissionProps> = ({ onClose, onSubmit }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isAITyping, setIsAITyping] = useState(false);
    const [chatAI] = useState(() => new ChatAI());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [draft, setDraft] = useState<ProjectDraft>({});
    const [editingField, setEditingField] = useState<string | null>(null);

    useEffect(() => {
        // Initialize with AI greeting
        const initialMessage = chatAI.getInitialMessage();
        setMessages([initialMessage]);
        inputRef.current?.focus();
    }, [chatAI]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Update draft whenever chat AI processes input
        setDraft(chatAI.getProjectDraft());
    }, [messages, chatAI]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || isAITyping) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Show AI typing indicator
        setIsAITyping(true);
        const typingMessage: ChatMessage = {
            id: 'typing',
            role: 'ai',
            content: '',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        // Simulate AI thinking time
        setTimeout(() => {
            const { aiResponse } = chatAI.processUserInput(userMessage.content);

            // Remove typing indicator and add AI response
            setMessages(prev => prev.filter(m => m.id !== 'typing').concat(aiResponse));
            setIsAITyping(false);
            setDraft(chatAI.getProjectDraft());
        }, 800);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFieldUpdate = (field: keyof ProjectDraft, value: string) => {
        const updatedDraft = { ...draft, [field]: value };
        setDraft(updatedDraft);
        // Update the chatAI internal state as well
        Object.assign(chatAI.getProjectDraft(), updatedDraft);
        setEditingField(null);
    };

    const handleConfirmProject = () => {
        const currentDraft = chatAI.getProjectDraft();

        // Create a complete project object
        const newProject: Project = {
            id: `p${Date.now()}`,
            title: currentDraft.title || 'Untitled Project',
            description: currentDraft.description || '',
            longDescription: currentDraft.longDescription || '',
            category: currentDraft.category || 'dev',
            icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${Date.now()}`,
            rating: 0,
            reviews: [],
            activeAgents: 0,
            earningsPerTask: currentDraft.earningsPerTask || '$0.00',
            totalPayout: '$0',
            isSponsored: false,
            whyItEarns: currentDraft.whyItEarns || '',
            rules: [],
            popularity: 0,
            skills: [{
                name: currentDraft.title || 'API',
                endpoint: currentDraft.apiEndpoint || '',
                method: currentDraft.apiMethod || 'POST',
                description: currentDraft.description || '',
                parameters: {}
            }],
            externalLinks: [
                ...(currentDraft.websiteUrl ? [{
                    label: 'Website',
                    url: currentDraft.websiteUrl,
                    iconType: 'web' as const
                }] : []),
                ...(currentDraft.docsUrl ? [{
                    label: 'Documentation',
                    url: currentDraft.docsUrl,
                    iconType: 'docs' as const
                }] : [])
            ]
        };

        onSubmit(newProject);
        onClose();
    };

    const EditableField: React.FC<{
        label: string;
        field: keyof ProjectDraft;
        value: string | undefined;
        placeholder?: string;
        multiline?: boolean;
    }> = ({ label, field, value, placeholder = '未填写', multiline = false }) => {
        const [tempValue, setTempValue] = useState(value || '');
        const isEditing = editingField === field;

        useEffect(() => {
            setTempValue(value || '');
        }, [value]);

        const handleSave = () => {
            handleFieldUpdate(field, tempValue);
        };

        const handleCancel = () => {
            setTempValue(value || '');
            setEditingField(null);
        };

        return (
            <div className="group">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                {isEditing ? (
                    <div className="space-y-2">
                        {multiline ? (
                            <textarea
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="w-full bg-slate-800 border border-indigo-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400 resize-none"
                                rows={3}
                                autoFocus
                            />
                        ) : (
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="w-full bg-slate-800 border border-indigo-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400"
                                autoFocus
                            />
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded transition-colors"
                            >
                                保存
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-1.5 rounded transition-colors"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => setEditingField(field)}
                        className="cursor-pointer hover:bg-slate-800/50 rounded p-2 -m-2 transition-colors relative"
                    >
                        <p className={`text-sm ${value ? 'text-white font-medium' : 'text-slate-500'} ${multiline ? 'line-clamp-4' : ''}`}>
                            {value || placeholder}
                        </p>
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-950 z-50 flex">
            {/* Left Sidebar - Dashboard */}
            <div className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h3 className="text-white font-bold text-sm mb-1">Dashboard</h3>
                    <p className="text-xs text-slate-500">管理自己的账户</p>
                </div>
                <div className="flex-1 p-4 space-y-3">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">我的项目</p>
                        <p className="text-xl font-bold text-white">0</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">总收益</p>
                        <p className="text-xl font-bold text-green-400">$0.00</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">活跃Agent</p>
                        <p className="text-xl font-bold text-indigo-400">0</p>
                    </div>
                </div>
            </div>

            {/* Center - Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/90 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white font-bold">AgentEarn 助手</h2>
                            <p className="text-xs text-slate-400">帮你快速发布项目</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="max-w-3xl mx-auto">
                        {messages.map(message => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/90 backdrop-blur-md">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="输入你的回答..."
                                disabled={isAITyping}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isAITyping}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            按 Enter 发送，Shift + Enter 换行
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Project Info */}
            <div className="w-80 border-l border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h3 className="text-white font-bold text-sm mb-1">已经配置的信息</h3>
                    <p className="text-xs text-slate-500">点击任意字段可直接编辑</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Logo */}
                    <div>
                        <p className="text-xs text-slate-500 mb-2">项目Logo</p>
                        <div className="w-20 h-20 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center">
                            {draft.title ? (
                                <span className="text-2xl font-bold text-indigo-400">
                                    {draft.title.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Editable Fields */}
                    <EditableField label="项目名称" field="title" value={draft.title} placeholder="点击输入项目名称" />
                    <EditableField label="类别" field="category" value={draft.category} placeholder="点击选择类别" />
                    <EditableField label="简短描述" field="description" value={draft.description} placeholder="点击输入简短描述" />
                    <EditableField label="详细说明" field="longDescription" value={draft.longDescription} placeholder="点击输入详细说明" multiline />
                    <EditableField label="收益模式" field="whyItEarns" value={draft.whyItEarns} placeholder="点击输入收益模式" multiline />
                    <EditableField label="每任务收益" field="earningsPerTask" value={draft.earningsPerTask} placeholder="例如：$0.50" />
                    <EditableField label="API端点" field="apiEndpoint" value={draft.apiEndpoint} placeholder="https://api.example.com/v1" />
                    <EditableField label="官网链接" field="websiteUrl" value={draft.websiteUrl} placeholder="https://example.com" />
                </div>

                {/* Confirm Button */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleConfirmProject}
                        disabled={!draft.title || !draft.description}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        确认发布
                    </button>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        {!draft.title || !draft.description ? '请至少填写项目名称和描述' : '信息已完整，可以发布'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatProjectSubmission;
