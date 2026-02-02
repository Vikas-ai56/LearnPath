import React from 'react';
import { Target } from 'lucide-react';
import { BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KnowledgeGraph from './KnowledgeGraph';

/**
 * Main Action Banner Component
 */
const ActionBanner = ({ userProfile, setUserProfile }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 border border-indigo-500/30 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Continue your Path</h2>
        <p className="text-indigo-200 mb-6 max-w-lg">
          Your adaptive analysis suggests focusing on <strong>Data Structures</strong> next. 
          This is a high-leverage node unlocking 3 future paths.
        </p>
        
        <div className="flex gap-4">
          <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all">
            Resume: Data Structures
          </button>
          
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 rounded-lg border border-white/10">
            <span className="text-sm text-slate-300">Style:</span>
            <select 
              value={userProfile.learningStyle} 
              onChange={(e) => setUserProfile({...userProfile, learningStyle: e.target.value})}
              className="bg-transparent text-white font-medium focus:outline-none text-sm"
            >
              <option value="visual">Visual (Diagrams)</option>
              <option value="text">Read/Write (Docs)</option>
              <option value="kinesthetic">Kinesthetic (Code)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Decorator */}
      <div className="absolute right-0 bottom-0 opacity-10">
        <svg width="300" height="300" viewBox="0 0 200 200">
          <path d="M40,160 Q100,60 160,160" stroke="white" strokeWidth="20" fill="none" />
        </svg>
      </div>
    </div>
  );
};

/**
 * Knowledge Graph Container Component
 */
const GraphContainer = ({ unlockedNodes, completedNodes, onNodeClick }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Target className="text-indigo-400 w-5 h-5" /> Dependency Graph
        </h3>
        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Live View</span>
      </div>
      
      <KnowledgeGraph 
        unlockedNodes={unlockedNodes} 
        completedNodes={completedNodes} 
        onNodeClick={onNodeClick} 
      />
    </div>
  );
};

/**
 * Competency Growth Chart Component
 */
const CompetencyChart = () => {
  const chartData = [
    { day: 'M', score: 0.2 }, 
    { day: 'T', score: 0.5 }, 
    { day: 'W', score: 0.8 }, 
    { day: 'T', score: 1.2 }, 
    { day: 'F', score: 1.5 }, 
    { day: 'S', score: 2.1 }, 
    { day: 'S', score: 2.3 }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <BarChart2 className="text-indigo-400 w-5 h-5" /> Competency Growth
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#818cf8" 
              strokeWidth={3} 
              dot={{r: 4, fill: '#6366f1'}} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * Dashboard Main Content Component
 * Contains the main learning interface
 */
const DashboardContent = ({ 
  userProfile, 
  setUserProfile, 
  unlockedNodes, 
  completedNodes, 
  setActiveNode 
}) => {
  return (
    <div className="col-span-12 lg:col-span-8 space-y-6">
      <ActionBanner userProfile={userProfile} setUserProfile={setUserProfile} />
      
      <GraphContainer 
        unlockedNodes={unlockedNodes} 
        completedNodes={completedNodes} 
        onNodeClick={(node) => setActiveNode(node)} 
      />
      
      <CompetencyChart />
    </div>
  );
};

export default DashboardContent;
