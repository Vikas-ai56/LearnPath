import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Users, 
  CheckCircle, 
  Settings, 
  Sparkles,
  RefreshCw,
  Zap,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Code,
  Video,
  FileText,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { callGemini } from '../api/gemini';

/**
 * Enhanced Learning Module Component
 * Multiple teaching modes: Visual, Code, Video, Theory, Practice, Interactive
 */
const LearningModule = ({ node, mode, onClose, onComplete }) => {
  const [code, setCode] = useState('// Write your solution here...\n// Task: Implement a function to reverse a linked list\n\nfunction solve(head) {\n  \n}');
  const [output, setOutput] = useState(null);
  const [activeTab, setActiveTab] = useState('learn'); // learn | code | practice | jigsaw
  const [teachingMode, setTeachingMode] = useState(mode); // visual | theory | interactive | video
  const [aiExplanation, setAiExplanation] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDebugLoading, setIsDebugLoading] = useState(false);
  
  // Practice mode state
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  
  // Interactive simulation state
  const [simulationStep, setSimulationStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // GEMINI FEATURE 1: Concept Explainer
  const handleAiExplain = async () => {
    setIsAiLoading(true);
    const prompt = `You are an expert computer science professor. Explain the concept of "${node.label}" clearly and concisely to an undergraduate student in ${teachingMode} style. Use an analogy if helpful. Keep it under 150 words.`;
    const text = await callGemini(prompt);
    setAiExplanation(text);
    setIsAiLoading(false);
  };

  // GEMINI FEATURE 2: Code Debugger
  const handleDebug = async () => {
    setIsDebugLoading(true);
    setOutput({ status: 'running' });
    
    const prompt = `You are a strict code judge API. Analyze the following code for the topic "${node.label}". 
    Code:
    ${code}
    
    Return a response in this format:
    1. Does it compile? (Yes/No)
    2. Estimated Time Complexity: (e.g., O(n))
    3. One specific hint or improvement suggestion.
    Keep it brief and technical.`;

    const text = await callGemini(prompt);
    
    setOutput({
      status: 'success',
      stdout: text, // Displaying raw AI response as console output
      metrics: {
        time: 'AI Estimate',
        memory: '~Calculated',
        efficiency_percentile: 88
      },
      hint: null
    });
    setIsDebugLoading(false);
  };

  // Interactive simulation controls
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
  };

  const stepForward = () => {
    setSimulationStep(prev => Math.min(prev + 1, 5));
  };

  const stepBackward = () => {
    setSimulationStep(prev => Math.max(prev - 1, 0));
  };

  const resetSimulation = () => {
    setSimulationStep(0);
    setIsSimulating(false);
  };

  const renderContent = () => {
    if (mode === 'visual') {
      return (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center">
            <h4 className="text-indigo-400 mb-4 text-sm font-bold uppercase tracking-wide">Interactive Visualization</h4>
            <div className="h-64 flex items-center justify-center relative">
               <div className="absolute w-32 h-32 border-4 border-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
               </div>
               <div className="absolute w-full h-1 bg-slate-700 top-1/2 -z-10"></div>
               <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-slate-800 p-2 rounded border border-slate-600">Input</div>
               <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-800 p-2 rounded border border-slate-600">Output</div>
            </div>
            <p className="text-slate-400 text-sm mt-4">Visual representation of data flow for {node.label}.</p>
          </div>
          
          {/* AI Explainer Section */}
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-5 rounded-xl border border-indigo-500/30">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> AI Concept Tutor
              </h3>
              {!aiExplanation && (
                <button 
                  onClick={handleAiExplain}
                  disabled={isAiLoading}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-all"
                >
                  {isAiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Explain {node.label}
                </button>
              )}
            </div>
            
            {isAiLoading && (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700/50 rounded w-full"></div>
                <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
              </div>
            )}
            
            {aiExplanation && (
              <div className="prose prose-invert text-sm text-indigo-100 leading-relaxed animate-in fade-in">
                {aiExplanation}
              </div>
            )}
          </div>
        </div>
      );
    } 
    
    // Text Mode
    return (
      <div className="prose prose-invert max-w-none space-y-4">
        <h3 className="text-2xl font-bold text-white">Understanding {node.label}</h3>
        <p className="text-slate-300">
          In computer science, <strong>{node.label}</strong> is a fundamental concept used to manage complexity. 
          It allows us to abstract away implementation details.
        </p>
        
         {/* AI Explainer Section for Text Mode */}
         <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> Quick Summary
              </h4>
              <button 
                  onClick={handleAiExplain}
                  disabled={isAiLoading || aiExplanation}
                  className="text-xs text-purple-300 hover:text-white underline decoration-dashed underline-offset-4"
                >
                  {aiExplanation ? "Generated by Gemini" : "Generate with AI"}
              </button>
            </div>
            {isAiLoading ? (
               <span className="text-sm text-slate-500 italic">Consulting the knowledge base...</span>
            ) : (
               <p className="text-sm text-slate-300 leading-relaxed">
                 {aiExplanation || `Click 'Generate with AI' to get a concise summary of ${node.label} tailored to your current progress level.`}
               </p>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <BookOpen className="text-indigo-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{node.label}</h2>
              <p className="text-xs text-slate-400">Module ID: {node.id.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">Close</button>
            <button 
              onClick={() => onComplete(node.id)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Mark Complete
            </button>
          </div>
        </div>

        {/* Body Grid */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Content Area */}
          <div className="w-1/2 flex flex-col border-r border-slate-700">
             {/* Tabs */}
             <div className="flex border-b border-slate-700">
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 py-3 text-sm font-medium ${activeTab === 'content' ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
                >
                  Learn
                </button>
                <button 
                  onClick={() => setActiveTab('jigsaw')}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'jigsaw' ? 'bg-slate-800 text-white border-b-2 border-amber-500' : 'text-slate-400 hover:text-white'}`}
                >
                  <Users className="w-4 h-4" /> Jigsaw Room
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'content' ? renderContent() : (
                  <div className="space-y-6">
                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                      <h4 className="text-amber-500 font-bold flex items-center gap-2">
                        <Users className="w-5 h-5" /> Expert Group: Logic Gates
                      </h4>
                      <p className="text-sm text-slate-300 mt-2">
                        You are in a breakout room with 3 other students. Your goal is to master <strong>Karnaugh Maps</strong> and teach it to your home group.
                      </p>
                    </div>
                    {/* Simulated Peers */}
                    <div className="space-y-3">
                      <h5 className="text-slate-400 text-xs font-bold uppercase">Active Peers</h5>
                      {['Sarah (Online)', 'Mike (Typing...)', 'Jin (Online)'].map((peer, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                            {peer[0]}
                          </div>
                          <span className="text-slate-300 text-sm">{peer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* Right: Code/Simulation */}
          <div className="w-1/2 flex flex-col bg-slate-950">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
               <span className="text-xs font-mono text-slate-400">solution.js</span>
               <div className="flex gap-2">
                 <button className="p-1 hover:bg-slate-800 rounded text-slate-400"><Settings className="w-4 h-4" /></button>
               </div>
            </div>
            
            <div className="flex-1 relative">
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-slate-950 text-emerald-400 font-mono p-4 resize-none focus:outline-none text-sm leading-relaxed"
                spellCheck="false"
              />
            </div>

            {/* Output Console */}
            <div className="h-1/2 max-h-64 bg-slate-900 border-t border-slate-700 flex flex-col">
              <div className="px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Console / AI Judge</span>
                <button 
                  onClick={handleDebug}
                  disabled={isDebugLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isDebugLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />} 
                  Debug with Gemini
                </button>
              </div>
              <div className="p-4 font-mono text-xs overflow-y-auto flex-1">
                {output?.status === 'running' && (
                  <span className="text-amber-400 animate-pulse">Compiling and analyzing code with AI model...</span>
                )}
                {output?.status === 'success' && (
                  <div className="space-y-2">
                    <div className="text-slate-300 whitespace-pre-wrap">{output.stdout}</div>
                    <div className="flex gap-4 mt-2 pt-2 border-t border-slate-700">
                      <div className="text-emerald-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {output.metrics.time}
                      </div>
                      <div className="text-blue-400 flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> {output.metrics.memory}
                      </div>
                    </div>
                  </div>
                )}
                {!output && <span className="text-slate-600">Ready to execute. Enter code and ask Gemini to review it.</span>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LearningModule;
