import React, { useState } from 'react';

// API and Data imports
import { callGemini } from './src/api/gemini';
import { KNOWLEDGE_GRAPH, QUESTS } from './src/data/mockData';

// Component imports
import WelcomeScreen from './src/components/WelcomeScreen';
import Navigation from './src/components/Navigation';
import AdaptiveTest from './src/components/AdaptiveTest';
import LearningModule from './src/components/LearningModule';
import DashboardContent from './src/components/DashboardContent';
import DashboardSidebar from './src/components/DashboardSidebar';

// 4. MAIN DASHBOARD LAYOUT
export default function App() {
  const [appState, setAppState] = useState('welcome'); // welcome | test | dashboard
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Engineer',
    learningStyle: 'visual',
    thetaScore: 0,
    streak: 5,
    xp: 1250
  });

  const [unlockedNodes, setUnlockedNodes] = useState([]);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  
  // Minute Paper State
  const [paperInput, setPaperInput] = useState("");
  const [paperResponse, setPaperResponse] = useState(null);
  const [isPaperLoading, setIsPaperLoading] = useState(false);

  // GEMINI FEATURE 3: Smart Minute Paper
  const handlePaperSubmit = async () => {
    if (!paperInput.trim()) return;
    setIsPaperLoading(true);
    
    const prompt = `A student wrote this in their "Minute Paper" reflecting on today's engineering class: "${paperInput}". 
    You are a supportive academic mentor. Provide:
    1. A single sentence of encouragement.
    2. One actionable, specific tip or resource to help them understand better.
    Keep it warm and brief.`;
    
    const text = await callGemini(prompt);
    setPaperResponse(text);
    setIsPaperLoading(false);
  };

  const handleTestComplete = (theta, answers) => {
    setUserProfile(prev => ({ ...prev, thetaScore: theta }));
    const unlocked = ['cs101', 'math101'];
    if (theta > 1.5) unlocked.push('cs102');
    if (theta > 2.5) unlocked.push('ds101');
    setUnlockedNodes(unlocked);
    setAppState('dashboard');
  };

  const handleModuleComplete = (nodeId) => {
    setCompletedNodes(prev => [...prev, nodeId]);
    setActiveNode(null);
    const justUnlocked = KNOWLEDGE_GRAPH
      .filter(n => n.prereqs.includes(nodeId))
      .map(n => n.id);
    setUnlockedNodes(prev => [...new Set([...prev, ...justUnlocked])]);
  };

  if (appState === 'welcome') {
    return <WelcomeScreen onStart={() => setAppState('test')} />;
  }

  if (appState === 'test') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <AdaptiveTest onComplete={handleTestComplete} />
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Navigation userProfile={userProfile} />

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        <DashboardContent 
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          unlockedNodes={unlockedNodes}
          completedNodes={completedNodes}
          setActiveNode={setActiveNode}
        />

        <DashboardSidebar 
          quests={QUESTS}
          paperInput={paperInput}
          setPaperInput={setPaperInput}
          paperResponse={paperResponse}
          isPaperLoading={isPaperLoading}
          onPaperSubmit={handlePaperSubmit}
          onPaperReset={() => { 
            setPaperResponse(null); 
            setPaperInput(""); 
          }}
        />
      </main>

      {/* MODALS */}
      {activeNode && (
        <LearningModule 
          node={activeNode} 
          mode={userProfile.learningStyle} 
          onClose={() => setActiveNode(null)} 
          onComplete={handleModuleComplete}
        />
      )}
    </div>
  );
}