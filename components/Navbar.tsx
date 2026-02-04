
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
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onListProject}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all"
        >
          发布项目
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
