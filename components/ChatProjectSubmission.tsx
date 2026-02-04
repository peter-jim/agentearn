import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProjectDraft, Project } from '../types';
import { ChatAI } from '../utils/chatAI';
import MessageBubble from './MessageBubble';

interface ChatProjectSubmissionProps {
    onClose: () => void;
    onSubmit: (project: Project) => void;
    existingProjects?: Project[];
}

type MainTab = 'chat' | 'projects';

const ChatProjectSubmission: React.FC<ChatProjectSubmissionProps> = ({ onClose, onSubmit, existingProjects = [] }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isAITyping, setIsAITyping] = useState(false);
    const [chatAI] = useState(() => new ChatAI());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [draft, setDraft] = useState<ProjectDraft>({});
    const [editingField, setEditingField] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<MainTab>('chat');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const initialMessage = chatAI.getInitialMessage();
        setMessages([initialMessage]);
        inputRef.current?.focus();
    }, [chatAI]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        setDraft(chatAI.getProjectDraft());
    }, [messages, chatAI]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || isAITyping) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        setIsAITyping(true);
        const typingMessage: ChatMessage = {
            id: 'typing',
            role: 'ai',
            content: '',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        setTimeout(() => {
            const { aiResponse } = chatAI.processUserInput(userMessage.content);
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
        Object.assign(chatAI.getProjectDraft(), updatedDraft);
        setEditingField(null);
    };

    const handleConfirmProject = () => {
        const currentDraft = chatAI.getProjectDraft();

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
            {/* Left Sidebar - Tab Navigation (always visible) */}
            <div className="w-48 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-wealth-DEFAULT rounded-lg flex items-center justify-center shadow-lg shadow-wealth-DEFAULT/20">
                        <svg className="w-5 h-5 text-void" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-xs truncate">AgentEarn</h3>
                        <p className="text-xs text-slate-500 truncate">助手</p>
                    </div>
                </div>

                {/* Tab Buttons */}
                <div className="flex-1 p-3 space-y-2">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className="w-full px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all"
                        style={activeTab === 'chat' ? { backgroundColor: '#05D69E', color: '#0B0F19', boxShadow: '0 10px 15px -3px rgba(5, 214, 158, 0.2)' } : {}}
                    >
                        <div className={`flex items-center gap-2 ${activeTab !== 'chat' ? 'text-slate-400 hover:text-slate-300' : ''}`}>
                            <span className="text-base">💬</span>
                            <span>聊天</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className="w-full px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all"
                        style={activeTab === 'projects' ? { backgroundColor: '#05D69E', color: '#0B0F19', boxShadow: '0 10px 15px -3px rgba(5, 214, 158, 0.2)' } : {}}
                    >
                        <div className={`flex items-center gap-2 ${activeTab !== 'projects' ? 'text-slate-400 hover:text-slate-300' : ''}`}>
                            <span className="text-base">📦</span>
                            <div className="flex-1">
                                <div>我的项目</div>
                                <div className={`text-xs ${activeTab === 'projects' ? 'opacity-70' : 'opacity-70'}`}>({existingProjects.length})</div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Close Button */}
                <div className="p-3 border-t border-slate-800">
                    <button
                        onClick={onClose}
                        className="w-full px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        关闭
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex">
                {/* Chat Tab */}
                {activeTab === 'chat' && (
                    <>
                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col">
                            {/* Messages */}
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
                                            className="bg-wealth-DEFAULT hover:bg-wealth-dark disabled:bg-slate-700 disabled:cursor-not-allowed text-void p-3 rounded-lg transition-colors shadow-lg shadow-wealth-DEFAULT/20"
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

                                <EditableField label="项目名称" field="title" value={draft.title} placeholder="点击输入项目名称" />
                                <EditableField label="类别" field="category" value={draft.category} placeholder="点击选择类别" />
                                <EditableField label="简短描述" field="description" value={draft.description} placeholder="点击输入简短描述" />
                                <EditableField label="详细说明" field="longDescription" value={draft.longDescription} placeholder="点击输入详细说明" multiline />
                                <EditableField label="收益模式" field="whyItEarns" value={draft.whyItEarns} placeholder="点击输入收益模式" multiline />
                                <EditableField label="每任务收益" field="earningsPerTask" value={draft.earningsPerTask} placeholder="例如：$0.50" />
                                <EditableField label="API端点" field="apiEndpoint" value={draft.apiEndpoint} placeholder="https://api.example.com/v1" />
                                <EditableField label="官网链接" field="websiteUrl" value={draft.websiteUrl} placeholder="https://example.com" />
                            </div>

                            <div className="p-4 border-t border-slate-800">
                                <button
                                    onClick={handleConfirmProject}
                                    disabled={!draft.title || !draft.description}
                                    className="w-full bg-wealth-DEFAULT hover:bg-wealth-dark disabled:bg-slate-700 disabled:cursor-not-allowed text-void font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-wealth-DEFAULT/20"
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
                    </>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {!selectedProject ? (
                            // Project Grid View
                            <>
                                <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                                    <div className="max-w-6xl mx-auto">
                                        <h3 className="text-xl font-bold text-white mb-6">我的项目</h3>
                                        {existingProjects.length === 0 ? (
                                            <div className="text-center py-20">
                                                <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="text-slate-500 mb-2">暂无项目</p>
                                                <button
                                                    onClick={() => setActiveTab('chat')}
                                                    className="text-indigo-400 hover:text-indigo-300 text-sm underline"
                                                >
                                                    去创建第一个项目
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {existingProjects.map(project => (
                                                    <div
                                                        key={project.id}
                                                        onClick={() => setSelectedProject(project)}
                                                        className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 cursor-pointer transition-all hover:border-indigo-500"
                                                    >
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <img src={project.icon} className="w-12 h-12 rounded-lg" alt={project.title} />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-bold text-white truncate">{project.title}</h4>
                                                                <p className="text-xs text-slate-500">{project.category}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{project.description}</p>
                                                        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                                                            <div>
                                                                <span className="text-slate-500">Agent: </span>
                                                                <span className="text-indigo-400 font-bold">{project.activeAgents}</span>
                                                            </div>
                                                            <div className="text-green-400 font-bold">{project.totalPayout}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Full-Width Project Detail View
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Breadcrumb Navigation */}
                                <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
                                    <div className="flex items-center gap-2 text-sm">
                                        <button
                                            onClick={() => setSelectedProject(null)}
                                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            我的项目
                                        </button>
                                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span className="text-white font-medium">{selectedProject.title}</span>
                                    </div>
                                </div>

                                {/* Project Detail Content */}
                                <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
                                    <div className="max-w-4xl mx-auto space-y-8">
                                        {/* Header */}
                                        <div className="flex items-start gap-6">
                                            <img src={selectedProject.icon} className="w-24 h-24 rounded-2xl shadow-lg" alt={selectedProject.title} />
                                            <div className="flex-1">
                                                <h1 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h1>
                                                <p className="text-slate-400 mb-4">{selectedProject.category}</p>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <span className="text-white font-bold">{selectedProject.activeAgents}</span>
                                                        <span className="text-slate-500 text-sm">活跃Agent</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-white font-bold">{selectedProject.totalPayout}</span>
                                                        <span className="text-slate-500 text-sm">总收益</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                            <h2 className="text-lg font-bold text-white mb-3">项目描述</h2>
                                            <p className="text-slate-300 leading-relaxed">{selectedProject.description}</p>
                                        </div>

                                        {/* Long Description */}
                                        {selectedProject.longDescription && (
                                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                                <h2 className="text-lg font-bold text-white mb-3">详细说明</h2>
                                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{selectedProject.longDescription}</p>
                                            </div>
                                        )}

                                        {/* Earnings Info */}
                                        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-800/30">
                                            <h2 className="text-lg font-bold text-white mb-3">收益信息</h2>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-slate-400">每任务收益</span>
                                                <span className="text-2xl font-bold text-green-400">{selectedProject.earningsPerTask}</span>
                                            </div>
                                            {selectedProject.whyItEarns && (
                                                <p className="text-slate-300 text-sm leading-relaxed">{selectedProject.whyItEarns}</p>
                                            )}
                                        </div>

                                        {/* API Information */}
                                        {selectedProject.skills && selectedProject.skills.length > 0 && (
                                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                                <h2 className="text-lg font-bold text-white mb-4">API信息</h2>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-slate-500 text-sm w-20 flex-shrink-0">端点:</span>
                                                        <code className="text-indigo-400 text-sm font-mono break-all flex-1">{selectedProject.skills[0].endpoint}</code>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-slate-500 text-sm w-20 flex-shrink-0">方法:</span>
                                                        <span className="text-white text-sm font-bold">{selectedProject.skills[0].method}</span>
                                                    </div>
                                                    {selectedProject.skills[0].description && (
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-slate-500 text-sm w-20 flex-shrink-0">说明:</span>
                                                            <span className="text-slate-300 text-sm flex-1">{selectedProject.skills[0].description}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* External Links */}
                                        {selectedProject.externalLinks && selectedProject.externalLinks.length > 0 && (
                                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                                <h2 className="text-lg font-bold text-white mb-4">外部链接</h2>
                                                <div className="space-y-3">
                                                    {selectedProject.externalLinks.map((link, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 text-indigo-400 hover:text-indigo-300 transition-colors group"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                            <span className="group-hover:underline">{link.label}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatProjectSubmission;
