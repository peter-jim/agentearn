import { ChatMessage, ProjectDraft, ConversationStep } from '../types';
import { CATEGORIES } from '../data';

export class ChatAI {
    private currentStep: ConversationStep = 'greeting';
    private projectDraft: ProjectDraft = {};

    getInitialMessage(): ChatMessage {
        return {
            id: '1',
            role: 'ai',
            content: '👋 你好！我是AgentEarn助手，我会帮你发布项目。首先，你的项目叫什么名字？',
            timestamp: new Date()
        };
    }

    processUserInput(userMessage: string): { aiResponse: ChatMessage; shouldShowPreview: boolean } {
        const trimmedInput = userMessage.trim();

        switch (this.currentStep) {
            case 'greeting':
            case 'title':
                this.projectDraft.title = trimmedInput;
                this.currentStep = 'category';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: `很好！"${trimmedInput}" 是什么类型的项目呢？\n\n${this.getCategoryOptions()}`,
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };

            case 'category':
                const category = this.extractCategory(trimmedInput);
                this.projectDraft.category = category;
                this.currentStep = 'description';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: `明白了！请用一句话描述 "${this.projectDraft.title}" 的核心功能。`,
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };

            case 'description':
                this.projectDraft.description = trimmedInput;
                this.currentStep = 'longDescription';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: '太棒了！能详细介绍一下项目的功能和特点吗？',
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };

            case 'longDescription':
                this.projectDraft.longDescription = trimmedInput;
                this.currentStep = 'whyItEarns';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: '收到！Agent如何通过这个项目赚钱呢？请描述收益模式。',
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };

            case 'whyItEarns':
                this.projectDraft.whyItEarns = trimmedInput;
                this.currentStep = 'earnings';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: '好的！每个任务能赚多少钱？（例如：$0.50 / 1k requests）',
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };

            case 'earnings':
                this.projectDraft.earningsPerTask = trimmedInput;
                this.currentStep = 'api';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: '请提供API端点地址（例如：https://api.example.com/v1/tasks）',
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };

            case 'api':
                this.projectDraft.apiEndpoint = trimmedInput;
                this.projectDraft.apiMethod = 'POST';
                this.currentStep = 'links';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: '有官网链接吗？（如果没有，请输入"跳过"）',
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };

            case 'links':
                if (trimmedInput.toLowerCase() !== '跳过') {
                    this.projectDraft.websiteUrl = trimmedInput;
                }
                this.currentStep = 'preview';
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: '✅ 太好了！我已经收集到所有信息。请查看下方的项目预览，确认无误后即可发布！',
                        timestamp: new Date()
                    },
                    shouldShowPreview: true
                };

            default:
                return {
                    aiResponse: {
                        id: Date.now().toString(),
                        role: 'ai',
                        content: '抱歉，出现了错误。请重新开始。',
                        timestamp: new Date()
                    },
                    shouldShowPreview: false
                };
        }
    }

    private getCategoryOptions(): string {
        return CATEGORIES
            .filter(cat => cat.id !== 'all')
            .map((cat, idx) => `${idx + 1}. ${cat.name} ${cat.icon}`)
            .join('\n');
    }

    private extractCategory(input: string): string {
        const lowerInput = input.toLowerCase();

        // Check if input is a number
        const num = parseInt(input);
        if (!isNaN(num) && num >= 1 && num <= 6) {
            const categories = CATEGORIES.filter(cat => cat.id !== 'all');
            return categories[num - 1]?.id || 'dev';
        }

        // Check if input matches category name
        const category = CATEGORIES.find(cat =>
            lowerInput.includes(cat.name.toLowerCase()) ||
            lowerInput.includes(cat.id)
        );

        return category?.id || 'dev';
    }

    getProjectDraft(): ProjectDraft {
        return this.projectDraft;
    }

    getCurrentStep(): ConversationStep {
        return this.currentStep;
    }

    reset(): void {
        this.currentStep = 'greeting';
        this.projectDraft = {};
    }
}
