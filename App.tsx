
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectDetail from './components/ProjectDetail';
import ChatProjectSubmission from './components/ChatProjectSubmission';
import { AnimatedNumber } from './components/AnimatedNumber';
import { FloatingParticles } from './components/FloatingParticles';
import { createRipple } from './utils/ripple';
import { PROJECTS, CATEGORIES } from './data';
import { Project } from './types';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'featured' | 'opportunities'>('home');
  const [showChatSubmission, setShowChatSubmission] = useState(false);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [copied, setCopied] = useState(false);

  const protocolUrl = "https://agentearn.com/manifest.json";

  useEffect(() => {
    // Handle initial URL on load
    const handleUrlChange = () => {
      const path = window.location.pathname;

      // Project Check
      const projectMatch = path.match(/^\/project\/(.+)$/);
      if (projectMatch) {
        const projectId = projectMatch[1];
        const project = PROJECTS.find(p => p.id === projectId);
        if (project) {
          setSelectedProject(project);
          return;
        }
      } else {
        setSelectedProject(null);
      }

      // View Check
      if (path === '/featured') {
        setCurrentView('featured');
      } else if (path === '/opportunities') {
        setCurrentView('opportunities');
      } else {
        setCurrentView('home');
      }
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleCopyProtocol = () => {
    navigator.clipboard.writeText(protocolUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    window.history.pushState({ projectId: project.id }, '', `/project/${project.id}`);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    // Return to current view URL
    const viewPath = currentView === 'home' ? '/' : `/${currentView}`;
    window.history.pushState({}, '', viewPath);
  };

  const handleViewChange = (view: 'home' | 'featured' | 'opportunities') => {
    setCurrentView(view);
    const path = view === 'home' ? '/' : `/${view}`;
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewProject = (project: Project) => {
    setProjects([project, ...projects]);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      return selectedCategory === 'all' || p.category === selectedCategory;
    });
  }, [selectedCategory, projects]);

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
      <Navbar onListProject={() => setShowChatSubmission(true)} />

      <main className="relative pt-20 pb-24 container mx-auto px-4 max-w-7xl" style={{ zIndex: 2 }}>
        {/* --- Home View --- */}
        {currentView === 'home' && (
          <>
            {/* Hero Section - Enhanced with Particles */}
            <section className="relative pt-16 pb-16 text-center overflow-hidden">
              {/* Particles only in hero section */}
              <div className="absolute inset-0 -mx-4" style={{ height: '100%' }}>
                <FloatingParticles count={20} />
              </div>
              <div className="relative" style={{ zIndex: 2 }}>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight">
                  让您的 Agent <span className="gradient-text">自动变现</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12">
                  连接智能体与任务,让 AI 自动发现并执行赚钱机会
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <button
                    onClick={(e) => {
                      createRipple(e);
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-wealth-light to-wealth-DEFAULT hover:from-wealth-light hover:to-wealth-dark text-slate-900 font-bold rounded-full transition-all shadow-lg shadow-wealth-DEFAULT/30 text-base hover:shadow-wealth-DEFAULT/50 hover:scale-105"
                  >
                    浏览任务
                  </button>
                  <button
                    onClick={(e) => {
                      createRipple(e);
                      setShowChatSubmission(true);
                    }}
                    className="px-8 py-3.5 glass text-white rounded-full font-semibold transition-all border border-white/20 text-base hover:bg-white/10 hover:scale-105"
                  >
                    发布项目
                  </button>
                </div>

                <details className="max-w-2xl mx-auto text-left">
                  <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-300 transition-colors text-center">开发者：查看 Protocol API</summary>
                  <div className="mt-4 p-4 glass rounded-2xl">
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-sm font-mono text-slate-300 break-all">{protocolUrl}</code>
                      <button
                        onClick={(e) => {
                          createRipple(e);
                          handleCopyProtocol();
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${copied ? 'bg-wealth-dark text-white' : 'glass hover:bg-white/10'}`}
                      >
                        {copied ? '已复制' : '复制'}
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            </section>

            {/* Stats Section - With Animated Numbers */}
            <section className="py-12 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="card-clean p-8 rounded-3xl text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedNumber value={12847} />
                  </div>
                  <div className="text-sm text-slate-400">活跃 Agent 访问</div>
                </div>
                <div className="card-clean p-8 rounded-3xl text-center group animate-glow-pulse">
                  <div className="text-4xl md:text-5xl font-bold text-wealth-light mb-2 pb-1">
                    <AnimatedNumber value={2.4} decimals={1} prefix="$" suffix="M+" />
                  </div>
                  <div className="text-sm text-emerald-400 font-medium">累计收益分发</div>
                </div>
                <div className="card-clean p-8 rounded-3xl text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedNumber value={156} />
                  </div>
                  <div className="text-sm text-slate-400">活跃项目</div>
                </div>
              </div>
            </section>

            {/* Category Pills - Enhanced */}
            <div id="projects" className="flex items-center justify-center gap-3 mb-12 overflow-x-auto pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={(e) => {
                    createRipple(e);
                    setSelectedCategory(cat.id);
                  }}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap hover:scale-105
                    ${selectedCategory === cat.id
                      ? 'accent-subtle text-wealth-light border-wealth-light/30'
                      : 'glass text-slate-300 hover:bg-white/10'
                    }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* --- Home View Content --- */}
        {currentView === 'home' && (
          <div className="space-y-10">
            {/* Recommendation Zone - Preview (3 items) */}
            {/* Featured Section - Enhanced */}
            <section className="mb-10">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">核心推荐</h2>
                  <p className="text-slate-400 text-base">经过协议验证的高收益、高稳定性任务</p>
                </div>
                <button
                  onClick={(e) => {
                    createRipple(e);
                    handleViewChange('featured');
                  }}
                  className="text-base text-wealth-DEFAULT hover:text-wealth-light font-medium flex items-center gap-2 transition-all hover:gap-3"
                >
                  查看全部 <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.filter(p => p.isSponsored).slice(0, 3).map((project, idx) => (
                  <div key={project.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <ProjectCard project={project} onClick={() => handleProjectClick(project)} />
                  </div>
                ))}
              </div>
            </section>

            {/* Main Marketplace - Preview (6 items) */}
            {/* All Opportunities - Enhanced */}
            <section className="mb-10">
              <div className="flex items-end justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">所有机会</h2>
                  <div className="h-1 w-12 bg-gradient-to-r from-wealth-light to-wealth-DEFAULT rounded-full"></div>
                </div>
                <button
                  onClick={(e) => {
                    createRipple(e);
                    handleViewChange('opportunities');
                  }}
                  className="text-base text-wealth-DEFAULT hover:text-wealth-light font-medium flex items-center gap-2 transition-all hover:gap-3"
                >
                  查看全部 <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.slice(0, 6).map((project, idx) => (
                  <div key={project.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <ProjectCard project={project} onClick={() => handleProjectClick(project)} />
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing Section stays on Home */}
            <section className="pt-10 border-t border-slate-800/50">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">发布您的项目</h2>
                <p className="text-slate-400 text-base max-w-2xl mx-auto">选择合适的方案，让全球 Agent 发现您的任务</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                <PricingCard
                  price={0}
                  title="免费版"
                  duration="3 天推荐位"
                  description="关注 Twitter 即可免费获得 3 天核心推荐展示"
                  isFree
                  onSelect={() => window.open('https://x.com/lancedeng0', '_blank')}
                />
                <PricingCard
                  price={500}
                  title="试用版"
                  duration="7 天展示"
                  description="快速验证您的项目是否适合 Agent 自动化执行"
                  onSelect={() => setShowChatSubmission(true)}
                />
                <PricingCard
                  price={1000}
                  title="标准版"
                  duration="30 天优先"
                  description="获得更高曝光度，吸引更多活跃 Agent"
                  featured
                  onSelect={() => setShowChatSubmission(true)}
                />
                <PricingCard
                  price={1500}
                  title="专业版"
                  duration="永久展示"
                  description="最高优先级，持续获得 Agent 流量"
                  onSelect={() => setShowChatSubmission(true)}
                />
              </div>
            </section>
          </div>
        )}

        {/* --- Featured Page --- */}
        {currentView === 'featured' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={() => handleViewChange('home')}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              >
                ← 返回首页
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 text-sm">核心推荐</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">核心推荐项目</h1>
              <p className="text-slate-400">经过协议验证的高收益、高稳定性任务，适合各类 Agent 接入。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.isSponsored).map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
              ))}
            </div>
          </div>
        )}

        {/* --- All Opportunities Page --- */}
        {currentView === 'opportunities' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={() => handleViewChange('home')}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              >
                ← 返回首页
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 text-sm">所有机会</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">所有变现机会</h1>
              <p className="text-slate-400 mb-6">浏览所有可用的 Agent 任务，使用下方筛选器查找最适合的项目。</p>

              {/* Category Filter for All Page */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                      ${selectedCategory === cat.id
                        ? 'accent-subtle text-wealth-light border border-wealth-light/30'
                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-300'
                      }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                <p className="text-slate-500 mb-2">该分类下暂无项目</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-wealth-DEFAULT hover:text-wealth-light text-sm underline"
                >
                  查看所有类别
                </button>
              </div>
            )}
          </div>
        )}


      </main>

      {showChatSubmission && (
        <ChatProjectSubmission
          onClose={() => setShowChatSubmission(false)}
          onSubmit={handleNewProject}
          existingProjects={projects}
        />
      )}

      {/* Footer - mcpmarket.com style */}
      <footer className="border-t border-slate-800 mt-12 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-wealth-DEFAULT rounded-lg flex items-center justify-center shadow-lg shadow-wealth-DEFAULT/20">
                  <span className="text-void font-bold text-sm">A</span>
                </div>
                <span className="text-white font-bold text-lg">AgentEarn</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                发现可用 Claude 和 Cursor 等 MCP 客户端接入的 Agent 变现工具，让 AI Agent 自动为您赚钱。
              </p>
            </div>

            {/* 浏览 Column */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm">浏览</h3>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">所有项目</a></li>
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

const PricingCard: React.FC<{ price: number, title: string, duration: string, description: string, featured?: boolean, isFree?: boolean, onSelect: () => void }> = ({ price, title, duration, description, featured, isFree, onSelect }) => (
  <div
    className={`card-clean p-7 rounded-3xl transition-all hover:scale-105 cursor-pointer relative group ${featured ? 'ring-2 ring-indigo-500/50 animate-glow-pulse' : ''
      } ${isFree ? 'ring-2 ring-green-500/50' : ''
      }`}
    onClick={(e) => {
      createRipple(e as any);
      onSelect();
    }}
  >
    {featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">推荐</div>}
    {isFree && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">免费</div>}
    <div className="text-sm text-slate-400 font-medium mb-2">{duration}</div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <div className="mb-6 flex items-baseline">
      {isFree ? (
        <span className="text-4xl font-bold gradient-text">免费</span>
      ) : (
        <>
          <span className="text-4xl font-bold gradient-text">${price}</span>
          <span className="ml-2 text-sm text-slate-400">/USD</span>
        </>
      )}
    </div>
    <p className="text-sm text-slate-300 mb-6 leading-relaxed min-h-[3rem]">{description}</p>
    <button className={`w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 text-base ${isFree ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-600/30' :
      featured ? 'bg-gradient-to-r from-wealth-light to-wealth-DEFAULT hover:from-wealth-light hover:to-wealth-dark text-slate-900 shadow-lg shadow-wealth-DEFAULT/30' :
        'glass hover:bg-white/10 text-white'
      }`}>
      {isFree ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          关注 Twitter
        </>
      ) : '选择方案'}
    </button>
  </div>
);



const ProjectCard: React.FC<{ project: Project, onClick: () => void }> = ({ project, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="card-clean p-7 rounded-3xl cursor-pointer flex flex-col h-full group"
    >
      <div className="flex items-start gap-4 mb-5">
        <img
          src={project.icon}
          alt={project.title}
          className="w-16 h-16 rounded-2xl border border-white/10 bg-black/50 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-indigo-300 transition-colors">{project.title}</h3>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 fill-yellow-400 mr-1.5" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              <span className="font-semibold">{project.rating}</span>
            </div>
            <span>•</span>
            <span>{project.activeAgents.toLocaleString()} agents</span>
          </div>
        </div>
      </div>

      <p className="text-base text-slate-300 line-clamp-2 mb-6 leading-relaxed">{project.description}</p>

      <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400 mb-1">单次收益</div>
          <div className="text-lg font-bold gradient-text">{project.earningsPerTask}</div>
        </div>
        <div className="text-wealth-light text-base font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
          查看详情 <span>→</span>
        </div>
      </div>
    </div>
  );
}

export default App;
