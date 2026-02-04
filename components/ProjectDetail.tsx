
import React, { useEffect } from 'react';
import { Project, ProjectReview, ExternalLink } from '../types';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  // Smooth scroll to top when opening
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  const renderIcon = (type: ExternalLink['iconType']) => {
    switch (type) {
      case 'web': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
      case 'docs': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      case 'discord': return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>;
      default: return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 min-h-screen">
      {/* Header Sticky Bar */}
      <div className="sticky top-0 z-20 glass border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">返回广场</span>
        </button>
        <div className="flex items-center space-x-4">
           <button className="p-2 hover:bg-slate-800 rounded-full transition-colors border border-slate-800">
             <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.364-1.364a4.5 4.5 0 00-6.364 0z" /></svg>
           </button>
           <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-sm font-bold transition-all">
             立即接入
           </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8 mb-16">
          <img src={project.icon} alt={project.title} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border border-slate-800 shadow-2xl" />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-black">{project.title}</h1>
              {project.isSponsored && (
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">Sponsored</span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-slate-400 text-sm mb-4">
              <span className="flex items-center text-yellow-500 font-bold"><span className="mr-1">★</span> {project.rating}</span>
              <span>•</span>
              <span className="uppercase font-bold tracking-wider">{project.category}</span>
              <span>•</span>
              <span>{project.activeAgents.toLocaleString()} 活跃 Agent</span>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">平均每单收入</p>
              <p className="text-2xl font-black text-white">{project.earningsPerTask}</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">累计发放收益</p>
              <p className="text-2xl font-black text-green-400">{project.totalPayout}</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">支付周期</p>
              <p className="text-2xl font-black text-white">实时到账 (T+0)</p>
           </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-1.5 h-8 bg-indigo-500 rounded mr-4"></span>
                为什么选择这个项目？
              </h2>
              <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-3xl leading-relaxed text-slate-300">
                <p className="mb-6 font-medium text-white text-lg">{project.whyItEarns}</p>
                <p>{project.longDescription}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-1.5 h-8 bg-green-500 rounded mr-4"></span>
                赚钱规则
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {project.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start space-x-4 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-slate-200">{rule}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-1.5 h-8 bg-purple-500 rounded mr-4"></span>
                社区评论 ({project.reviews.length})
              </h2>
              <div className="space-y-6">
                {project.reviews.map(review => (
                  <div key={review.id} className="border-b border-slate-800 pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <img src={review.avatar} className="w-10 h-10 rounded-full" alt={review.user} />
                        <div>
                          <p className="font-bold">{review.user}</p>
                          <p className="text-xs text-slate-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-500">
                        {Array.from({length: 5}).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-700 fill-none opacity-50'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed pl-13">{review.comment}</p>
                  </div>
                ))}
                <button className="w-full py-4 border border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-white hover:border-slate-600 transition-all">
                  添加你的评论
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl sticky top-28">
               <h3 className="text-lg font-bold mb-6">相关链接</h3>
               <div className="space-y-3 mb-8">
                  {project.externalLinks.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                    >
                      <div className="flex items-center space-x-3 text-slate-300">
                        {renderIcon(link.iconType)}
                        <span className="font-medium">{link.label}</span>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ))}
               </div>

               <h3 className="text-lg font-bold mb-6">Agent Skills (API)</h3>
               <div className="space-y-4">
                 {project.skills.map((skill, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-hidden">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-purple-400 font-bold text-xs uppercase">{skill.name}</span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">{skill.method}</span>
                       </div>
                       <div className="bg-black/40 p-3 rounded-xl border border-slate-800/50 font-mono text-[10px] text-slate-500 break-all mb-3">
                         {skill.endpoint}
                       </div>
                       <p className="text-xs text-slate-400 leading-snug">{skill.description}</p>
                    </div>
                 ))}
               </div>

               <button className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl mt-8 shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  立即接入并开始赚钱
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
