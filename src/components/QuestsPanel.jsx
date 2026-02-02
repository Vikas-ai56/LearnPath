import React from 'react';
import { Award } from 'lucide-react';

/**
 * Engineering Quests Component
 * Displays gamified learning challenges
 */
const QuestsPanel = ({ quests }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Award className="text-amber-500 w-5 h-5" /> Engineering Quests
      </h3>
      
      <div className="space-y-4">
        {quests.map(quest => (
          <div 
            key={quest.id} 
            className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-slate-200">{quest.title}</h4>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-1 rounded">
                {quest.reward}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mb-3">{quest.desc}</p>
            
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all" 
                style={{ width: `${quest.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestsPanel;
