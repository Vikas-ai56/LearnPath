import React, { useState } from 'react';
import { 
  X, Play, Pause, RotateCcw, Video, FileText, MessageCircle, 
  BookOpen, Code, ChevronRight, PlayCircle, Brain, ExternalLink,
  CheckCircle, Clock, Award
} from 'lucide-react';
import { callGemini } from '../api/gemini';
import QuizComponent from './QuizComponent';

const EnhancedLearningModule = ({ node, onClose, onComplete, quizData, curriculum }) => {
  const [learningStyle, setLearningStyle] = useState('visual'); // visual, reading, interactive
  const [activeSection, setActiveSection] = useState('learn');
  const [simulationStep, setSimulationStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [completedSections, setCompletedSections] = useState({
    videos: false,
    reading: false,
    interactive: false,
    quiz: false
  });

  const simulationData = getSimulationData(node.id);
  const maxSteps = simulationData?.steps?.length || 0;

  // Get learning style preference
  const renderLearningContent = () => {
    switch (learningStyle) {
      case 'visual':
        return <VisualLearning node={node} curriculum={curriculum} />;
      case 'reading':
        return <ReadingLearning node={node} />;
      case 'interactive':
        return <InteractiveLearning node={node} simulationData={simulationData} />;
      default:
        return <VisualLearning node={node} curriculum={curriculum} />;
    }
  };

  const handleCompleteSection = (section) => {
    setCompletedSections(prev => ({ ...prev, [section]: true }));
  };

  const allSectionsComplete = Object.values(completedSections).every(v => v);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{node.label}</h2>
              <p className="text-blue-100">{node.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {Object.entries(completedSections).map(([key, completed]) => (
              <div
                key={key}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  completed ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/60'
                }`}
              >
                {completed && <CheckCircle className="w-3 h-3" />}
                {key}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700 bg-slate-900/50">
          <button
            onClick={() => setActiveSection('learn')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeSection === 'learn'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Learn
          </button>
          <button
            onClick={() => setActiveSection('videos')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeSection === 'videos'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PlayCircle className="w-4 h-4 inline mr-2" />
            Videos ({node.videos?.length || 0})
          </button>
          <button
            onClick={() => setActiveSection('practice')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeSection === 'practice'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Practice
          </button>
          <button
            onClick={() => setActiveSection('quiz')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeSection === 'quiz'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Quiz
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'learn' && (
            <div className="p-8">
              {/* Learning Style Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Choose Your Learning Style</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setLearningStyle('visual')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      learningStyle === 'visual'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Video className="w-8 h-8 mb-3 mx-auto text-blue-400" />
                    <div className="font-semibold mb-1">Visual (Diagrams)</div>
                    <div className="text-sm text-gray-400">Learn through visualizations</div>
                  </button>

                  <button
                    onClick={() => setLearningStyle('reading')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      learningStyle === 'reading'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <FileText className="w-8 h-8 mb-3 mx-auto text-green-400" />
                    <div className="font-semibold mb-1">Reading/Writing</div>
                    <div className="text-sm text-gray-400">Learn through text</div>
                  </button>

                  <button
                    onClick={() => setLearningStyle('interactive')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      learningStyle === 'interactive'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <MessageCircle className="w-8 h-8 mb-3 mx-auto text-purple-400" />
                    <div className="font-semibold mb-1">Interactive</div>
                    <div className="text-sm text-gray-400">Learn by doing</div>
                  </button>
                </div>
              </div>

              {/* Learning Content */}
              <div className="bg-slate-900 rounded-xl p-8">
                {renderLearningContent()}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    handleCompleteSection(learningStyle);
                    setActiveSection('videos');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                >
                  Continue to Videos
                </button>
              </div>
            </div>
          )}

          {activeSection === 'videos' && (
            <VideosSection 
              node={node} 
              onComplete={() => {
                handleCompleteSection('videos');
                setActiveSection('practice');
              }}
            />
          )}

          {activeSection === 'practice' && (
            <PracticeSection 
              node={node}
              simulationData={simulationData}
              onComplete={() => {
                handleCompleteSection('interactive');
                setActiveSection('quiz');
              }}
            />
          )}

          {activeSection === 'quiz' && quizData && (
            <div className="p-8">
              <QuizComponent
                topicId={node.id}
                quizData={quizData}
                onComplete={(result) => {
                  handleCompleteSection('quiz');
                  if (result.passed && allSectionsComplete) {
                    onComplete?.();
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 bg-slate-900/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {Object.values(completedSections).filter(Boolean).length} of 4 sections completed
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg"
              >
                Save Progress
              </button>
              {allSectionsComplete && (
                <button
                  onClick={onComplete}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Topic
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Visual Learning Component
const VisualLearning = ({ node, curriculum }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Visual Learning Path</h3>
      
      {/* Dependency Graph */}
      <div className="mb-8 bg-slate-800 rounded-lg p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-400" />
          Topic Dependencies
        </h4>
        <svg viewBox="0 0 800 400" className="w-full h-64">
          {/* Simple visualization */}
          <circle cx="400" cy="200" r="60" fill="#3b82f6" />
          <text x="400" y="205" textAnchor="middle" fill="white" className="text-sm">
            {node.label}
          </text>
        </svg>
      </div>

      {/* Key Concepts */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Key Concepts</h4>
        {node.topics?.map((topic, index) => (
          <div key={index} className="bg-slate-800 p-4 rounded-lg flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded">
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="font-medium">{topic}</div>
              <div className="text-sm text-gray-400 mt-1">
                Core concept #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reading Learning Component
const ReadingLearning = ({ node }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <h3 className="text-2xl font-bold mb-6">Detailed Explanation</h3>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h4 className="text-xl font-semibold text-white mb-3">Introduction</h4>
          <p>{node.description}</p>
        </section>

        {node.topics?.map((topic, index) => (
          <section key={index} className="bg-slate-800 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-3">{topic}</h4>
            <p className="text-gray-400">
              This section covers {topic.toLowerCase()} in detail. Understanding this concept is crucial 
              for mastering {node.label.toLowerCase()}.
            </p>
          </section>
        ))}

        <section className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">💡 Key Takeaway</h4>
          <p className="text-gray-300">
            {node.label} is fundamental to understanding operating systems. 
            Master these concepts before moving to advanced topics.
          </p>
        </section>
      </div>
    </div>
  );
};

// Interactive Learning Component
const InteractiveLearning = ({ node, simulationData }) => {
  const [step, setStep] = useState(0);

  if (!simulationData) {
    return (
      <div className="text-center py-12">
        <Code className="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-400">Interactive simulation coming soon</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Interactive Simulation</h3>
      
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">
            Step {step + 1} of {simulationData.steps.length}
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${((step + 1) / simulationData.steps.length) * 100}%` }}
            />
          </div>
        </div>

        <h4 className="text-xl font-bold mb-3">{simulationData.steps[step].title}</h4>
        <p className="text-gray-400 mb-6">{simulationData.steps[step].description}</p>

        {/* Visual representation */}
        <div className="bg-slate-900 rounded-lg p-8 mb-6 min-h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{simulationData.steps[step].icon}</div>
            <div className="text-gray-500">Simulation visualization</div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={() => setStep(Math.min(simulationData.steps.length - 1, step + 1))}
            disabled={step === simulationData.steps.length - 1}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Videos Section
const VideosSection = ({ node, onComplete }) => {
  const [watchedVideos, setWatchedVideos] = useState(new Set());

  const handleVideoClick = (index) => {
    setWatchedVideos(prev => new Set([...prev, index]));
  };

  const allWatched = node.videos && watchedVideos.size >= Math.ceil(node.videos.length / 2);

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-6">Video Lectures</h3>
      <p className="text-gray-400 mb-8">
        Watch at least {Math.ceil((node.videos?.length || 0) / 2)} videos to continue
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {node.videos?.map((video, index) => (
          <div
            key={index}
            className={`bg-slate-800 rounded-lg overflow-hidden ${
              watchedVideos.has(index) ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="relative bg-slate-700 h-48 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white/30" />
              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs">
                {video.duration}
              </div>
              {watchedVideos.has(index) && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2">{video.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{video.channel}</p>
              
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleVideoClick(index)}
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
                Watch on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onComplete}
          disabled={!allWatched}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium"
        >
          {allWatched ? 'Continue to Practice' : `Watch ${Math.ceil((node.videos?.length || 0) / 2) - watchedVideos.size} more video(s)`}
        </button>
      </div>
    </div>
  );
};

// Practice Section
const PracticeSection = ({ node, simulationData, onComplete }) => {
  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-6">Practice Exercises</h3>
      
      <div className="space-y-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h4 className="text-xl font-semibold">Conceptual Understanding</h4>
          </div>
          <p className="text-gray-400 mb-4">
            Test your understanding of {node.label} concepts
          </p>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
            Start Exercise
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-green-400" />
            <h4 className="text-xl font-semibold">Practical Application</h4>
          </div>
          <p className="text-gray-400 mb-4">
            Apply {node.label} in real scenarios
          </p>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
            Start Challenge
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
        >
          Continue to Quiz
        </button>
      </div>
    </div>
  );
};

// Simulation data helper
function getSimulationData(topicId) {
  const simulations = {
    'cpu-scheduling': {
      steps: [
        { title: 'Process Arrival', description: 'Processes enter the ready queue', icon: '📥' },
        { title: 'CPU Allocation', description: 'CPU is allocated based on scheduling algorithm', icon: '⚙️' },
        { title: 'Execution', description: 'Process executes on CPU', icon: '🔄' },
        { title: 'Completion', description: 'Process completes and exits', icon: '✅' }
      ]
    }
  };

  return simulations[topicId];
}

export default EnhancedLearningModule;
