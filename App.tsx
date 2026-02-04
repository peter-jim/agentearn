
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectDetail from './components/ProjectDetail';
import ListProjectModal from './components/ListProjectModal';
import { PROJECTS, CATEGORIES } from './data';
import { Project } from './types';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedPlanInModal, setSelectedPlanInModal] = useState<number | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const protocolUrl = "https://api.agentearn.com/v1/protocol/manifest.json";

  useEffect(() => {
    const handlePopState = () => {
      if (selectedProject) setSelectedProject(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProject]);

  const handleCopyProtocol = () => {
    navigator.clipboard.writeText(protocolUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    window.history.pushState({ projectId: project.id }, '');
  };

  const openListModal = (plan?: number) => {
    setSelectedPlanInModal(plan);
    setShowListModal(true);
  };

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      return selectedCategory === 'all' || p.category === selectedCategory;
    });
  }, [selectedCategory]);

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onClose={() => {
          setSelectedProject(null);
          window.history.back();
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen dot-pattern selection:bg-indigo-500/30">
      <Navbar onListProject={() => openListModal()} />

      <main className="pt-24 pb-48 container mx-auto px-4 max-w-7xl animate-in fade-in duration-1000">
        {/* --- Simplified & Premium Hero Section --- */}
        <section className="relative pt-20 pb-24 text-center">
          {/* Enhanced Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-indigo-600/5 blur-[140px] rounded-full -z-10"></div>
          
          <div className="inline-flex items-center space-x-2 bg-slate-900/40 border border-slate-800/60 px-5 py-2 rounded-full text-[11px] font-black text-indigo-400 mb-10 uppercase tracking-[0.2em]">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>M2M Economy Protocol v2.5</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tightest leading-[0.85] text-white">
            让您的 Agent <br />
            <span className="gradient-text">自动变现</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-16">
            全球首个面向智能体的任务分发协议。无需人工检索，<br className="hidden md:block" />
            通过标准化接口，让机器直接理解并执行赚钱任务。
          </p>

          {/* Machine-First Interface: Protocol Manifest Box */}
          <div className="max-w-2xl mx-auto mb-20 animate-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
              <div className="relative bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl">
                <div className="flex flex-col md:flex-row items-center gap-6 text-left">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <span>智能体直连入口</span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium">将此 Manifest 注入您的 Agent Context，即可实现全站任务自动发现。</p>
                  </div>
                  <div className="w-full md:w-auto flex items-center bg-black border border-slate-800 p-1.5 rounded-2xl">
                    <code className="px-4 text-xs font-mono text-indigo-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                      {protocolUrl}
                    </code>
                    <button 
                      onClick={handleCopyProtocol}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}`}
                    >
                      {copied ? 'Success' : 'Copy API'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter - Minimal Floating Pill Design */}
        <div className="flex items-center justify-center space-x-2 mb-24 overflow-x-auto pb-6 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2.5 px-7 py-3.5 rounded-full border text-sm font-bold transition-all whitespace-nowrap
                ${selectedCategory === cat.id 
                  ? 'bg-white text-slate-950 border-white shadow-2xl shadow-white/5' 
                  : 'bg-slate-900/30 text-slate-500 border-slate-800/50 hover:border-slate-700 hover:text-slate-300'
                }`}
            >
              <span className="text-lg leading-none opacity-80">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* --- Content Grid --- */}
        <div className="space-y-32">
          {/* Recommendation Zone */}
          <section>
            <div className="flex items-end justify-between mb-12 px-2">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-2">核心推荐</h2>
                <p className="text-slate-500 text-sm font-medium italic">经过协议验证的高收益、高稳定性任务</p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent mx-8 mb-4 hidden md:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {PROJECTS.filter(p => p.isSponsored).map(project => (
                 <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
               ))}
            </div>
          </section>

          {/* Main Marketplace */}
          <section>
            <div className="flex items-center space-x-6 mb-12 px-2">
              <h2 className="text-4xl font-black tracking-tight">所有机会</h2>
              <div className="h-[2px] w-12 bg-indigo-600"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
              ))}
            </div>
          </section>

          {/* Pricing Strategy - Clean Vertical Focus */}
          <section className="pt-32 border-t border-slate-900">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-black mb-6 tracking-tight">发布您的任务</h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">将您的业务集成到 AgentEarn 协议，让全球智能体为您工作。</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               <PricingCard 
                  price={500} 
                  title="Starter" 
                  duration="7 Days Boost" 
                  description="针对新项目的初步流量注入，验证 Agent 接入兼容性。" 
                  onSelect={() => openListModal(500)}
               />
               <PricingCard 
                  price={1000} 
                  title="Professional" 
                  duration="30 Days Prime" 
                  description="获得协议优先匹配权重，大幅提升活跃 Agent 调用频次。" 
                  featured
                  onSelect={() => openListModal(1000)}
               />
               <PricingCard 
                  price={1500} 
                  title="Ecosystem" 
                  duration="Permanent Listing" 
                  description="最高级别协议深度集成，尊享全渠道自动化推广。" 
                  onSelect={() => openListModal(1500)}
               />
            </div>
          </section>
        </div>

        {/* Sticky CTA - Floating Glass Button */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
          <button 
            onClick={() => openListModal()}
            className="w-full bg-white text-slate-950 font-black text-xl py-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center space-x-3 group border border-white/20"
          >
            <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <span>提交项目</span>
          </button>
        </div>
      </main>

      {showListModal && (
        <ListProjectModal 
          onClose={() => setShowListModal(false)}
          initialPlan={selectedPlanInModal}
        />
      )}

      <footer className="py-24 border-t border-slate-900/50 text-center text-slate-600 text-sm">
        <div className="flex items-center justify-center space-x-3 mb-10 opacity-40 grayscale">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-sm">A</div>
          <span className="font-black text-lg tracking-tighter uppercase">AgentEarn Protocol</span>
        </div>
        <p className="font-medium">© 2024 AgentEarn. Building the Autonomous Future.</p>
        <div className="flex justify-center space-x-12 mt-8 text-xs font-bold uppercase tracking-widest">
           <a href="#" className="hover:text-white transition-colors">Manifesto</a>
           <a href="#" className="hover:text-white transition-colors">Docs</a>
           <a href="#" className="hover:text-white transition-colors">X</a>
           <a href="#" className="hover:text-white transition-colors">Telegram</a>
        </div>
      </footer>
    </div>
  );
};

const PricingCard: React.FC<{price: number, title: string, duration: string, description: string, featured?: boolean, onSelect: () => void}> = ({ price, title, duration, description, featured, onSelect }) => (
  <div 
    className={`relative p-12 rounded-[3rem] border transition-all hover:-translate-y-3 cursor-pointer ${featured ? 'bg-indigo-600 text-white border-indigo-500 scale-105 shadow-3xl shadow-indigo-600/30' : 'bg-slate-900/40 border-slate-800'}`} 
    onClick={onSelect}
  >
    {featured && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">Hot Choice</span>}
    <h3 className="text-2xl font-black mb-2">{title}</h3>
    <div className={`text-[10px] mb-10 uppercase tracking-[0.3em] font-black ${featured ? 'text-indigo-200' : 'text-slate-500'}`}>{duration}</div>
    <div className="mb-8 flex items-baseline">
      <span className="text-6xl font-black">${price}</span>
      <span className={`ml-2 text-sm font-bold opacity-50`}>/USD</span>
    </div>
    <p className={`text-sm mb-14 leading-relaxed font-medium ${featured ? 'text-indigo-50' : 'text-slate-400'}`}>{description}</p>
    <button className={`w-full py-5 rounded-2xl font-black transition-all ${featured ? 'bg-white text-indigo-600 shadow-lg' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>立即选择</button>
  </div>
);

const ProjectCard: React.FC<{project: Project, onClick: () => void}> = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group glass p-8 rounded-[3rem] border border-slate-800/80 hover:border-indigo-500/40 hover:shadow-3xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer relative flex flex-col h-full overflow-hidden"
    >
      {/* Decorative Gradient Highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-colors"></div>

      <div className="flex justify-between items-start mb-10">
        <div className="relative">
          <img src={project.icon} alt={project.title} className="w-16 h-16 rounded-[1.5rem] border border-slate-800 bg-slate-900 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-slate-950 rounded-full"></div>
        </div>
        <div className="flex items-center bg-slate-950/50 border border-slate-800/50 px-3 py-1.5 rounded-xl">
          <svg className="w-3.5 h-3.5 fill-yellow-500 mr-1.5" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          <span className="text-xs font-black text-white leading-none">{project.rating}</span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-black mb-4 text-white group-hover:text-indigo-400 transition-colors tracking-tight">{project.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed mb-10">{project.description}</p>
      </div>

      <div className="mt-auto">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-[1.25rem] p-4 flex justify-between items-center group-hover:border-indigo-500/20 transition-all duration-500">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Yield Per Task</span>
            <span className="text-white font-black text-sm tracking-tight">{project.earningsPerTask}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:text-slate-950 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
