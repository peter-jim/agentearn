
import React from 'react';

interface NavbarProps {
  onListProject: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onListProject }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">A</div>
          <span className="text-xl font-bold tracking-tight">AgentEarn</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
          <a href="#" className="text-white transition-colors">赚钱广场</a>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={onListProject}
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          提交项目
        </button>
        <button 
          onClick={onListProject}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center transition-all border border-slate-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Power Your Agents
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
