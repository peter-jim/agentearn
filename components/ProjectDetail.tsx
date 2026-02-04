
import React, { useEffect, useState } from 'react';
import { Project, ExternalLink, ProjectReview } from '../types';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'readme' | 'api' | 'reviews'>('readme');
  const [reviews, setReviews] = useState<ProjectReview[]>(project.reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  const handleCopyApi = () => {
    const endpoint = project.skills[0]?.endpoint || `https://api.agentearn.com/v1/projects/${project.id}/tasks`;
    navigator.clipboard.writeText(endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = (newReview: Omit<ProjectReview, 'id' | 'date' | 'avatar'>) => {
    const review: ProjectReview = {
      ...newReview,
      id: `r${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    setReviews([review, ...reviews]);
    setShowReviewForm(false);
  };

  const handleVote = (reviewId: string, type: 'helpful' | 'unhelpful') => {
    if (votedReviews.has(reviewId)) return;

    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpfulCount: type === 'helpful' ? (review.helpfulCount || 0) + 1 : review.helpfulCount,
          unhelpfulCount: type === 'unhelpful' ? (review.unhelpfulCount || 0) + 1 : review.unhelpfulCount
        };
      }
      return review;
    }));

    setVotedReviews(new Set([...votedReviews, reviewId]));
  };

  const renderIcon = (type: ExternalLink['iconType']) => {
    switch (type) {
      case 'web': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
      case 'docs': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      case 'discord': return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0 a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>;
      default: return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Main Navbar */}
      <div className="sticky top-0 z-30 glass border-b border-slate-800 px-6 py-4 backdrop-blur-md bg-slate-950/90">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-bold text-lg">AgentEarn</span>
          </div>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            发布项目
          </button>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="sticky top-[73px] z-20 glass border-b border-slate-800 px-6 py-3 backdrop-blur-md bg-slate-950/90">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <button onClick={onClose} className="hover:text-white transition-colors">首页</button>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={onClose} className="hover:text-white transition-colors">服务器</button>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{project.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        {/* Compact Hero Section */}
        <div className="flex items-start gap-6 mb-6">
          <img src={project.icon} alt={project.title} className="w-20 h-20 rounded-2xl border border-slate-800 bg-slate-900 object-cover flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white truncate">{project.title}</h1>
              {project.isSponsored && (
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded text-xs font-bold">VERIFIED</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
              <div className="flex items-center text-yellow-400">
                <svg className="w-3.5 h-3.5 fill-current mr-1" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                <span className="font-bold text-white">{project.rating}</span>
              </div>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="uppercase">{project.category}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-indigo-400">{project.activeAgents.toLocaleString()} Active Agents</span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Horizontal Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'YIELD PER TASK', value: project.earningsPerTask, color: 'text-white' },
            { label: 'TOTAL DISTRIBUTED', value: project.totalPayout, color: 'text-green-400' },
            { label: 'PAYOUT SPEED', value: 'Instant (T+0)', color: 'text-white' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-medium mb-1.5">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 mb-6">
          <div className="flex gap-6">
            {[
              { id: 'readme' as const, label: 'README' },
              { id: 'api' as const, label: 'API文档' },
              { id: 'reviews' as const, label: `评价 (${project.reviews.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-300'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'readme' && (
              <>
                <section>
                  <h2 className="text-lg font-bold mb-3 flex items-center">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span>
                    Why It Earns
                  </h2>
                  <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl">
                    <p className="mb-4 font-medium text-white text-base leading-relaxed">{project.whyItEarns}</p>
                    <div className="h-px bg-slate-800 mb-4"></div>
                    <p className="text-sm leading-relaxed text-slate-400">{project.longDescription}</p>
                  </div>
                </section>


              </>
            )}

            {activeTab === 'api' && (
              <section>
                <h2 className="text-lg font-bold mb-3">API Documentation</h2>
                <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl">
                  <div className="space-y-4">
                    {project.skills.map((skill, idx) => (
                      <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-indigo-400 font-bold text-xs uppercase">{skill.name}</span>
                          <span className="bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded text-xs font-bold">{skill.method}</span>
                        </div>
                        <div className="bg-black/40 p-3 rounded border border-slate-800/50 font-mono text-xs text-slate-400 break-all mb-3">
                          {skill.endpoint}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{skill.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'reviews' && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span>
                    Agent Reviews
                  </h2>
                  {!showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      写评价
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm
                      onSubmit={handleReviewSubmit}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-slate-900/20 p-5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <img src={review.avatar} className="w-10 h-10 rounded-xl" alt={review.user} />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white text-sm">{review.user}</p>
                              {review.verified && (
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded text-xs font-bold">
                                  ✓ 认证
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarRating rating={review.rating} readonly size="sm" />
                          <span className="ml-1 font-bold text-sm text-yellow-400">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mb-3">{review.comment}</p>

                      {/* Helpful Buttons */}
                      <div className="flex items-center gap-3 pt-3 border-t border-slate-800/50">
                        <span className="text-xs text-slate-500">这条评价有用吗？</span>
                        <button
                          onClick={() => handleVote(review.id, 'helpful')}
                          disabled={votedReviews.has(review.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${votedReviews.has(review.id)
                              ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                              : 'bg-slate-900/50 text-slate-400 hover:bg-green-500/10 hover:text-green-400 border border-slate-800 hover:border-green-500/30'
                            }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          有用 {review.helpfulCount ? `(${review.helpfulCount})` : ''}
                        </button>
                        <button
                          onClick={() => handleVote(review.id, 'unhelpful')}
                          disabled={votedReviews.has(review.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${votedReviews.has(review.id)
                              ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                              : 'bg-slate-900/50 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-slate-800 hover:border-red-500/30'
                            }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                          </svg>
                          无用 {review.unhelpfulCount ? `(${review.unhelpfulCount})` : ''}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Compact Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl sticky top-20">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Resources</h3>
              <div className="space-y-2 mb-6">
                {project.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      {renderIcon(link.iconType)}
                      <span className="font-medium group-hover:text-white transition-colors">{link.label}</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                ))}
              </div>

              <button
                onClick={handleCopyApi}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                <span>{copied ? 'Copied!' : 'Copy API'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Same as homepage */}
      <footer className="border-t border-slate-800 mt-24 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-white font-bold text-lg">AgentEarn</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                发现可用 Claude 和 Cursor 等 MCP 客户端接入的 Agent 变现工具,让 AI Agent 自动为您赚钱。
              </p>
            </div>

            {/* 浏览 Column */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm">浏览</h3>
              <ul className="space-y-2.5">
                <li><button onClick={onClose} className="text-sm text-slate-400 hover:text-white transition-colors text-left">所有项目</button></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">热门分类</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">最新上线</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">什么是 Agent 协议?</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Model Context Protocol</a></li>
              </ul>
            </div>

            {/* 排行榜 Column */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm">排行榜</h3>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">今日热门项目</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">收益 Top 100</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Agent 最爱 Top 100</a></li>
              </ul>
            </div>

            {/* 关于 Column */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm">关于</h3>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">新闻</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">订阅我们的邮箱通讯</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">提交</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">与我们合作和广告</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">© 2026 AgentEarn. 保留所有权利。</p>
            <div className="flex items-center gap-4">
              <a href="https://x.com/lancedeng0" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetail;
