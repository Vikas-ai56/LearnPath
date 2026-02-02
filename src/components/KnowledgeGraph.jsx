import React from 'react';
import { KNOWLEDGE_GRAPH } from '../data/mockData';

/**
 * Knowledge Graph Visualization Component
 * Renders an interactive SVG graph showing curriculum dependencies
 */
const KnowledgeGraph = ({ unlockedNodes, completedNodes, onNodeClick }) => {
  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 p-2 rounded backdrop-blur-sm text-xs text-slate-300 pointer-events-none">
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Mastered</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Unlocked</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-600"></div> Locked</div>
      </div>
      
      <svg className="w-full h-full">
        {/* Draw Edges */}
        {KNOWLEDGE_GRAPH.map(node => {
          return node.prereqs.map(prereqId => {
            const source = KNOWLEDGE_GRAPH.find(n => n.id === prereqId);
            return (
              <line 
                key={`${source.id}-${node.id}`}
                x1={source.x} y1={source.y}
                x2={node.x} y2={node.y}
                stroke="#475569" 
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          });
        })}

        {/* Draw Nodes */}
        {KNOWLEDGE_GRAPH.map(node => {
          const isCompleted = completedNodes.includes(node.id);
          const isUnlocked = unlockedNodes.includes(node.id);
          const isLocked = !isCompleted && !isUnlocked;

          let fill = isCompleted ? '#10B981' : (isUnlocked ? '#F59E0B' : '#475569');
          let stroke = isUnlocked && !isCompleted ? '#F59E0B' : 'none';

          return (
            <g 
              key={node.id} 
              onClick={() => !isLocked && onNodeClick(node)} 
              className={!isLocked ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-not-allowed opacity-50'}
            >
              <circle 
                cx={node.x} cy={node.y} 
                r="35" 
                fill={fill} 
                stroke={stroke}
                strokeWidth="3"
                className="transition-all duration-300"
              />
              <text 
                x={node.x} y={node.y + 5} 
                textAnchor="middle" 
                fill="white" 
                fontSize="10" 
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {node.label.split(' ').map((line, i) => (
                   <tspan x={node.x} dy={i === 0 ? 0 : 12} key={i}>{line}</tspan>
                ))}
              </text>
              {isLocked && (
                <text x={node.x} y={node.y - 45} textAnchor="middle" fill="#94a3b8" fontSize="14">🔒</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default KnowledgeGraph;
