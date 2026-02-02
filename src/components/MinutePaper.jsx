import React from 'react';
import { MessageSquare, Sparkles, RefreshCw, X } from 'lucide-react';

/**
 * Minute Paper Component
 * AI-powered reflection and feedback system
 */
const MinutePaper = ({ 
  paperInput, 
  setPaperInput, 
  paperResponse, 
  isPaperLoading, 
  onSubmit, 
  onReset 
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="text-emerald-400 w-5 h-5" /> Minute Paper
      </h3>
      
      <p className="text-xs text-slate-400 mb-4">
        The AI uses this to find gaps in your understanding.
      </p>
      
      {!paperResponse ? (
        <>
          <textarea 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="What was the most confusing concept today?"
            rows={3}
            value={paperInput}
            onChange={(e) => setPaperInput(e.target.value)}
          ></textarea>
          
          <button 
            onClick={onSubmit}
            disabled={isPaperLoading || !paperInput}
            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isPaperLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            Submit to AI Mentor
          </button>
        </>
      ) : (
        <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-lg animate-in fade-in">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-indigo-200 text-xs uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Mentor Response
            </h4>
            <button 
              onClick={onReset} 
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-slate-200 leading-relaxed italic">
            "{paperResponse}"
          </p>
        </div>
      )}
    </div>
  );
};

export default MinutePaper;
