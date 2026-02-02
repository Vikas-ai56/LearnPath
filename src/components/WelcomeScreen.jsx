import React from 'react';
import { Cpu, Activity, Sparkles, Users, ChevronRight } from 'lucide-react';

/**
 * Welcome Screen Component
 * Landing page with feature highlights
 */
const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <div className="z-10 max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/30">
             <Cpu className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          LearnPath
        </h1>
        
        <p className="text-xl text-slate-400 leading-relaxed">
          The <span className="text-indigo-400 font-bold flex-inline items-center gap-1">
            <Sparkles className="w-4 h-4 inline" /> AI-powered
          </span> adaptive platform for engineering excellence. 
          Stop consuming static content. Start building your knowledge graph.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-8">
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
             <Activity className="text-emerald-400 mb-2" />
             <h3 className="font-bold">Adaptive Integrity</h3>
             <p className="text-xs text-slate-500">Curriculum adjusts to your actual competency.</p>
          </div>
          
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
             <Sparkles className="text-amber-400 mb-2" />
             <h3 className="font-bold">Gemini Tutors</h3>
             <p className="text-xs text-slate-500">Real-time code debugging and concept simplification.</p>
          </div>
          
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
             <Users className="text-blue-400 mb-2" />
             <h3 className="font-bold">Digital Jigsaw</h3>
             <p className="text-xs text-slate-500">Collaborative breakout rooms for peer teaching.</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="mt-8 bg-white text-slate-900 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
        >
          Start Placement Assessment <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
