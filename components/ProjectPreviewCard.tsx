import React from 'react';
import { ProjectDraft } from '../types';

interface ProjectPreviewCardProps {
    draft: ProjectDraft;
    onConfirm: () => void;
    onEdit: () => void;
}

const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({ draft, onConfirm, onEdit }) => {
    return (
        <div className="bg-slate-900/50 border-2 border-indigo-500/50 rounded-xl p-6 mb-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    项目预览
                </h3>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded text-xs font-bold">
                    草稿
                </span>
            </div>

            <div className="space-y-3 mb-6">
                <div>
                    <p className="text-xs text-slate-500 mb-1">项目名称</p>
                    <p className="text-white font-bold">{draft.title || '未填写'}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 mb-1">类别</p>
                    <p className="text-slate-300">{draft.category || '未填写'}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 mb-1">简短描述</p>
                    <p className="text-slate-300 text-sm">{draft.description || '未填写'}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 mb-1">详细说明</p>
                    <p className="text-slate-300 text-sm line-clamp-3">{draft.longDescription || '未填写'}</p>
                </div>

                <div>
                    <p className="text-xs text-slate-500 mb-1">收益模式</p>
                    <p className="text-slate-300 text-sm">{draft.whyItEarns || '未填写'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">每任务收益</p>
                        <p className="text-green-400 font-bold">{draft.earningsPerTask || '未填写'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">API端点</p>
                        <p className="text-slate-300 text-xs font-mono truncate">{draft.apiEndpoint || '未填写'}</p>
                    </div>
                </div>

                {draft.websiteUrl && (
                    <div>
                        <p className="text-xs text-slate-500 mb-1">官网链接</p>
                        <a href={draft.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm hover:underline">
                            {draft.websiteUrl}
                        </a>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    确认发布
                </button>
                <button
                    onClick={onEdit}
                    className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                    继续编辑
                </button>
            </div>
        </div>
    );
};

export default ProjectPreviewCard;
