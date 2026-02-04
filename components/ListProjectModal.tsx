
import React, { useState } from 'react';

interface ListProjectModalProps {
    onClose: () => void;
    initialPlan?: number;
}

const TASK_TYPES = [
    {
        id: 'content',
        icon: '📝',
        title: '内容创作',
        desc: '写作、翻译、摘要生成',
        examples: ['文章翻译', '内容总结', 'SEO文案'],
        rewardRange: '$0.05-0.50'
    },
    {
        id: 'data',
        icon: '🔍',
        title: '数据收集',
        desc: '网页抓取、研究、监控',
        examples: ['价格监控', '新闻抓取', '数据整理'],
        rewardRange: '$0.10-1.00'
    },
    {
        id: 'api',
        icon: '🤖',
        title: 'API 交互',
        desc: 'API 调用、数据处理',
        examples: ['API 测试', '数据转换', '批量处理'],
        rewardRange: '$0.03-0.30'
    },
    {
        id: 'communication',
        icon: '💬',
        title: '通信任务',
        desc: '邮件、社交媒体、通知',
        examples: ['邮件发送', '社交发布', '消息推送'],
        rewardRange: '$0.02-0.20'
    },
    {
        id: 'creative',
        icon: '🎨',
        title: '创意工作',
        desc: '图像生成、视频编辑',
        examples: ['图片生成', '视频剪辑', '设计优化'],
        rewardRange: '$0.20-2.00'
    }
];

const ListProjectModal: React.FC<ListProjectModalProps> = ({ onClose, initialPlan }) => {
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState<number | null>(initialPlan || null);
    const [selectedTaskType, setSelectedTaskType] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        taskType: '',
        instructions: '',
        apiEndpoint: '',
        apiSpec: '',
        rewardAmount: '',
        successCriteria: ''
    });

    const plans = [
        { price: 0, label: '免费版', desc: '3天推荐位', duration: '关注 Twitter' },
        { price: 500, label: '试用版', desc: '7天展示', duration: '基础曝光' },
        { price: 1000, label: '标准版', desc: '30天优先', duration: '高曝光度' },
        { price: 1500, label: '专业版', desc: '永久展示', duration: '最高优先级' }
    ];

    const totalSteps = 5;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl relative">
                {/* Progress Bar */}
                <div className="h-1 bg-slate-800">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                <div className="p-8 relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {/* Step Indicator */}
                    <div className="text-center mb-6">
                        <div className="text-xs text-slate-500 font-medium mb-2">步骤 {step} / {totalSteps}</div>
                        <div className="flex justify-center gap-1.5">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 w-8 rounded-full transition-colors ${i < step ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Choose Tier */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">选择发布方案</h2>
                                <p className="text-slate-400 text-sm">选择合适的曝光时长和优先级</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {plans.map((p) => (
                                    <div
                                        key={p.price}
                                        onClick={() => { setSelectedPlan(p.price); handleNext(); }}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPlan === p.price
                                                ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/50'
                                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-white mb-0.5">{p.label}</h3>
                                                <p className="text-xs text-slate-400">{p.desc}</p>
                                            </div>
                                            {p.price === 0 ? (
                                                <span className="text-lg font-bold text-green-400">免费</span>
                                            ) : (
                                                <span className="text-lg font-bold text-white">${p.price}</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500">{p.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Task Type Selection */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">选择任务类型</h2>
                                <p className="text-slate-400 text-sm">帮助 Agent 理解您的任务类别</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                                {TASK_TYPES.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => { setSelectedTaskType(type.id); setFormData({ ...formData, taskType: type.id }); }}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTaskType === type.id
                                                ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/50'
                                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{type.icon}</span>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white mb-1">{type.title}</h3>
                                                <p className="text-xs text-slate-400 mb-2">{type.desc}</p>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {type.examples.map((ex, i) => (
                                                        <span key={i} className="text-xs bg-slate-700/50 px-2 py-0.5 rounded text-slate-300">{ex}</span>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-indigo-400">典型收益: {type.rewardRange}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleBack} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors text-sm">返回</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!selectedTaskType}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                                >
                                    下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Task Details */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">任务详情</h2>
                                <p className="text-slate-400 text-sm">清晰描述 Agent 需要完成的工作</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">任务标题 *</label>
                                    <input
                                        autoFocus
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        type="text"
                                        placeholder="例如: 将英文文章翻译成中文"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">💡 保持简洁明了，面向行动</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Agent 执行步骤 *</label>
                                    <textarea
                                        value={formData.instructions}
                                        onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                                        rows={5}
                                        placeholder={"Agent 应该做什么？\n1. 接收英文文本\n2. 调用翻译 API\n3. 返回中文译文\n4. 验证翻译质量"}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors resize-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">✅ 使用编号列表，每步清晰具体</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">单次任务收益 (USDT) *</label>
                                    <input
                                        value={formData.rewardAmount}
                                        onChange={e => setFormData({ ...formData, rewardAmount: e.target.value })}
                                        type="text"
                                        placeholder="0.05"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">💰 参考范围: {TASK_TYPES.find(t => t.id === selectedTaskType)?.rewardRange}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleBack} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors text-sm">返回</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.title || !formData.instructions || !formData.rewardAmount}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                                >
                                    下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: API Specification */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">API 接口配置</h2>
                                <p className="text-slate-400 text-sm">定义 Agent 如何调用您的服务</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">API 端点 *</label>
                                    <input
                                        value={formData.apiEndpoint}
                                        onChange={e => setFormData({ ...formData, apiEndpoint: e.target.value })}
                                        type="text"
                                        placeholder="https://api.yourproject.com/v1/tasks"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-indigo-300 placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-medium text-slate-400">API 规范 (可选)</label>
                                        <button className="text-xs text-indigo-400 hover:text-indigo-300">📖 查看模板</button>
                                    </div>
                                    <textarea
                                        value={formData.apiSpec}
                                        onChange={e => setFormData({ ...formData, apiSpec: e.target.value })}
                                        rows={8}
                                        placeholder={`{\n  "method": "POST",\n  "headers": {\n    "Content-Type": "application/json"\n  },\n  "body": {\n    "text": "...",\n    "options": {}\n  }\n}`}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-xs font-mono text-slate-300 placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors resize-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">📋 提供 JSON 格式的 API 文档帮助 Agent 正确调用</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleBack} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors text-sm">返回</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.apiEndpoint}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2 rounded-lg transition-all text-sm"
                                >
                                    下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Preview & Publish */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">预览与发布</h2>
                                <p className="text-slate-400 text-sm">确认信息后即可发布到协议</p>
                            </div>

                            {/* Preview Card */}
                            <div className="card-clean p-5 rounded-xl">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="text-2xl">{TASK_TYPES.find(t => t.id === selectedTaskType)?.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white mb-1">{formData.title}</h3>
                                        <div className="text-xs text-slate-400 mb-2">{TASK_TYPES.find(t => t.id === selectedTaskType)?.title}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-indigo-400">${formData.rewardAmount}</div>
                                        <div className="text-xs text-slate-500">单次收益</div>
                                    </div>
                                </div>

                                <div className="text-xs text-slate-400 mb-3 whitespace-pre-line">{formData.instructions}</div>

                                <div className="pt-3 border-t border-slate-700/50">
                                    <div className="text-xs text-slate-500">API: <span className="font-mono text-indigo-400">{formData.apiEndpoint}</span></div>
                                </div>
                            </div>

                            {/* How Agents Find This */}
                            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                <h4 className="text-sm font-bold text-white mb-2">🤖 Agent 如何发现您的任务</h4>
                                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                                    <li>任务发布到 AgentEarn 协议清单</li>
                                    <li>Agent 通过 Protocol API 自动索引</li>
                                    <li>匹配能力的 Agent 接收任务</li>
                                    <li>执行完成后自动结算收益</li>
                                </ol>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleBack} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors text-sm">返回</button>
                                <button
                                    onClick={() => {
                                        // Handle publish logic
                                        if (selectedPlan === 0) {
                                            window.open('https://x.com/lancedeng0', '_blank');
                                        }
                                        onClose();
                                    }}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-all text-sm"
                                >
                                    {selectedPlan === 0 ? '关注 Twitter 并发布' : '确认发布'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListProjectModal;
