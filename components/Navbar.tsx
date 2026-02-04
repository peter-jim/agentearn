
import React from 'react';

interface NavbarProps {
  onListProject: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onListProject }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-wealth-DEFAULT rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-wealth-DEFAULT/20">A</div>
          <span className="text-white font-bold tracking-tight">AgentEarn</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onListProject}
          className="px-6 py-2.5 bg-gradient-to-r from-wealth-light to-wealth-DEFAULT hover:from-wealth-light hover:to-wealth-dark text-void rounded-lg font-bold transition-all shadow-lg shadow-wealth-DEFAULT/20"
        >
          发布项目
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
