import React from 'react';
import { Cpu, Activity, Zap } from 'lucide-react';

/**
 * Navigation Component
 * Top navigation bar with user profile
 */
const Navigation = ({ userProfile }) => {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="text-indigo-500 w-6 h-6" />
          <span className="font-bold text-lg tracking-tight text-white">LearnPath</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-2 text-slate-400">
                <Activity className="w-4 h-4 text-emerald-500" /> 
                Theta: {userProfile.thetaScore.toFixed(2)}
             </div>
             <div className="flex items-center gap-2 text-slate-400">
                <Zap className="w-4 h-4 text-amber-500" /> 
                {userProfile.streak} Day Streak
             </div>
          </div>
          
          <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
            <span className="text-sm font-medium text-white">{userProfile.name}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
              AE
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
