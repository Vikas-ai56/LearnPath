import React from 'react';

/**
 * Jigsaw Status Component
 * Displays live collaborative learning session status
 */
const JigsawStatus = () => {
  return (
    <div className="bg-indigo-900/20 rounded-2xl p-6 border border-indigo-500/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <h3 className="font-bold text-indigo-100 text-sm">Live Class Active</h3>
      </div>
      
      <p className="text-xs text-indigo-300 mb-4">
        Prof. Smith has initiated a Jigsaw session on "Concurrency".
      </p>
      
      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all">
        Join Breakout Room
      </button>
    </div>
  );
};

export default JigsawStatus;
