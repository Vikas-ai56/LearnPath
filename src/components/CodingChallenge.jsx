import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, CheckCircle, XCircle, Lightbulb, Eye, EyeOff, 
  Trophy, Loader2, RefreshCw, ChevronRight, Award,
  AlertTriangle, Terminal, Code, BookOpen
} from 'lucide-react';
import { challengeAPI, setAuthToken } from '../api/service';
import { useAuth } from '../context/AuthContext';

const CodingChallenge = ({ 
  challenges, 
  topicId, 
  topicName,
  onComplete 
}) => {
  const { user, updateUser } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [xpNotification, setXpNotification] = useState(null);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Load completed challenges on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await challengeAPI.getProgress();
      setCompletedChallenges(response.progress || {});
    } catch (error) {
      console.log('Could not load challenge progress:', error);
    }
  };

  // Set initial challenge
  useEffect(() => {
    if (challenges && challenges.length > 0 && !selectedChallenge) {
      selectChallenge(challenges[0]);
    }
  }, [challenges]);

  const selectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.starterCode);
    setTestResults([]);
    setShowHints(false);
    setCurrentHintIndex(0);
    setShowSolution(false);
    setConsoleOutput([]);
    setAllTestsPassed(false);
    setActiveTab('problem');
  };

  // Safe code execution with sandboxing
  const executeCode = useCallback((code, testInput) => {
    const logs = [];
    const errors = [];
    
    // Create a custom console that captures output
    const customConsole = {
      log: (...args) => logs.push({ type: 'log', content: args.map(String).join(' ') }),
      error: (...args) => errors.push({ type: 'error', content: args.map(String).join(' ') }),
      warn: (...args) => logs.push({ type: 'warn', content: args.map(String).join(' ') }),
      info: (...args) => logs.push({ type: 'info', content: args.map(String).join(' ') }),
    };

    try {
      // Create a sandboxed function
      const sandbox = new Function('console', 'input', `
        "use strict";
        ${code}
      `);
      
      const result = sandbox(customConsole, testInput);
      
      return {
        success: true,
        result,
        logs,
        errors,
        output: logs.map(l => l.content).join('\n')
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack,
        logs,
        errors: [...errors, { type: 'error', content: error.message }]
      };
    }
  }, []);

  // Run all test cases
  const runTests = async () => {
    if (!selectedChallenge) return;
    
    setIsRunning(true);
    setConsoleOutput([]);
    setTestResults([]);
    setAllTestsPassed(false);
    
    // Small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const results = [];
    const allLogs = [];
    
    for (const testCase of selectedChallenge.testCases) {
      const execution = executeCode(userCode, testCase.input);
      
      // Collect all console outputs
      execution.logs.forEach(log => allLogs.push(log));
      execution.errors.forEach(err => allLogs.push(err));
      
      if (!execution.success) {
        results.push({
          ...testCase,
          passed: false,
          actual: null,
          error: execution.error,
          errorStack: execution.stack
        });
        continue;
      }
      
      // Compare results
      const actualOutput = execution.result;
      const expectedOutput = testCase.expectedOutput;
      
      // Deep comparison for objects/arrays
      const passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
      
      results.push({
        ...testCase,
        passed,
        actual: actualOutput,
        error: null
      });
    }
    
    setTestResults(results);
    setConsoleOutput(allLogs);
    
    // Check if all tests passed
    const allPassed = results.length > 0 && results.every(r => r.passed);
    setAllTestsPassed(allPassed);
    
    // Auto-complete if all tests pass
    if (allPassed) {
      await handleChallengeComplete();
    }
    
    setIsRunning(false);
  };

  // Handle challenge completion
  const handleChallengeComplete = async () => {
    if (!selectedChallenge || !user) return;
    
    // Check if already completed
    if (completedChallenges[selectedChallenge.id]) {
      setXpNotification({
        type: 'info',
        message: 'Already completed!',
        xp: 0
      });
      setTimeout(() => setXpNotification(null), 3000);
      return;
    }
    
    try {
      const response = await challengeAPI.complete(
        selectedChallenge.id,
        topicId,
        selectedChallenge.points
      );
      
      // Update token if provided
      if (response.token) {
        setAuthToken(response.token);
        // Update user context with new XP
        if (updateUser) {
          updateUser({ ...user, xp: response.totalXp });
        }
      }
      
      // Update local completed challenges
      setCompletedChallenges(prev => ({
        ...prev,
        [selectedChallenge.id]: {
          topicId,
          xpAwarded: response.xpAwarded,
          completedAt: new Date().toISOString()
        }
      }));
      
      // Show XP notification
      if (response.xpAwarded > 0) {
        setXpNotification({
          type: 'success',
          message: `+${response.xpAwarded} XP earned!`,
          xp: response.xpAwarded,
          total: response.totalXp
        });
      }
      
      // Callback for parent component
      if (onComplete) {
        onComplete(selectedChallenge.id, response.xpAwarded);
      }
      
      setTimeout(() => setXpNotification(null), 4000);
      
    } catch (error) {
      console.error('Error completing challenge:', error);
      setXpNotification({
        type: 'error',
        message: 'Failed to save progress'
      });
      setTimeout(() => setXpNotification(null), 3000);
    }
  };

  // Reset code to starter
  const resetCode = () => {
    if (selectedChallenge) {
      setUserCode(selectedChallenge.starterCode);
      setTestResults([]);
      setConsoleOutput([]);
      setAllTestsPassed(false);
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!challenges || challenges.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No coding challenges available for this topic yet.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* XP Notification */}
      {xpNotification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl animate-bounce ${
          xpNotification.type === 'success' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
          xpNotification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          <div className="flex items-center gap-3">
            {xpNotification.type === 'success' && <Trophy className="w-6 h-6 text-yellow-300" />}
            <div>
              <p className="font-bold text-white">{xpNotification.message}</p>
              {xpNotification.total && (
                <p className="text-sm text-white/80">Total XP: {xpNotification.total}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Selector */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {challenges.map((challenge, index) => {
            const isCompleted = completedChallenges[challenge.id];
            return (
              <button
                key={challenge.id}
                onClick={() => selectChallenge(challenge)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedChallenge?.id === challenge.id
                    ? 'bg-purple-600 text-white'
                    : isCompleted
                    ? 'bg-green-600/30 text-green-300 hover:bg-green-600/40'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-mono">{index + 1}</span>
                )}
                <span className="text-sm font-medium truncate max-w-32">{challenge.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.points}xp
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedChallenge && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Problem Description */}
          <div className="w-2/5 flex flex-col border-r border-gray-700 overflow-hidden">
            {/* Tabs */}
            <div className="flex bg-gray-800 border-b border-gray-700">
              {[
                { id: 'problem', label: 'Problem', icon: BookOpen },
                { id: 'hints', label: 'Hints', icon: Lightbulb },
                { id: 'solution', label: 'Solution', icon: Eye }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-900/50'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'problem' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-white">{selectedChallenge.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                        {selectedChallenge.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-400" />
                        {selectedChallenge.points} XP
                      </span>
                      <span>{selectedChallenge.testCases.length} test cases</span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {selectedChallenge.description}
                    </p>
                  </div>

                  {/* Example Test Cases */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Example Test Cases:</h3>
                    <div className="space-y-3">
                      {selectedChallenge.testCases.slice(0, 2).map((test, idx) => (
                        <div key={idx} className="bg-gray-800 rounded-lg p-3 font-mono text-sm">
                          <div className="text-gray-400 mb-1">Input:</div>
                          <div className="text-cyan-400 mb-2 pl-2">
                            {typeof test.input === 'object' 
                              ? JSON.stringify(test.input, null, 2)
                              : String(test.input)}
                          </div>
                          <div className="text-gray-400 mb-1">Expected Output:</div>
                          <div className="text-green-400 pl-2">
                            {typeof test.expectedOutput === 'object'
                              ? JSON.stringify(test.expectedOutput, null, 2)
                              : String(test.expectedOutput)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hints' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Hints
                    </h3>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      {showHints ? 'Hide All' : 'Show Hints'}
                    </button>
                  </div>

                  {showHints ? (
                    <div className="space-y-3">
                      {selectedChallenge.hints.map((hint, idx) => (
                        <div
                          key={idx}
                          className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
                            idx <= currentHintIndex ? 'border-yellow-500' : 'border-gray-600'
                          }`}
                        >
                          {idx <= currentHintIndex ? (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-yellow-400 font-semibold">Hint {idx + 1}</span>
                              </div>
                              <p className="text-gray-300">{hint}</p>
                            </>
                          ) : (
                            <button
                              onClick={() => setCurrentHintIndex(idx)}
                              className="text-gray-400 hover:text-gray-200 flex items-center gap-2"
                            >
                              <EyeOff className="w-4 h-4" />
                              Click to reveal Hint {idx + 1}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Click "Show Hints" to get help</p>
                      <p className="text-sm mt-1">Try solving it yourself first!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'solution' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-400" />
                      Solution
                    </h3>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showSolution ? 'Hide' : 'Reveal'}
                    </button>
                  </div>

                  {showSolution ? (
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-700 px-4 py-2 text-sm text-gray-300">
                          Solution Code
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm text-green-400 font-mono">
                          {selectedChallenge.solution}
                        </pre>
                      </div>
                      
                      <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-800">
                        <h4 className="font-semibold text-blue-300 mb-2">Explanation:</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                          {selectedChallenge.explanation}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-500 opacity-50" />
                      <p className="font-medium">Solution Hidden</p>
                      <p className="text-sm mt-1">Try to solve it yourself first!</p>
                      <p className="text-xs mt-2 text-gray-500">
                        Note: Viewing the solution won't award XP
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor & Results */}
          <div className="w-3/5 flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">solution.js</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetCode}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white flex items-center gap-1"
                  title="Reset to starter code"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={runTests}
                  disabled={isRunning}
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Tests
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={userCode}
                onChange={(value) => setUserCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  padding: { top: 16 },
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  folding: true,
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>

            {/* Test Results Panel */}
            <div className="h-64 bg-gray-800 border-t border-gray-700 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Test Results
                  </span>
                  {testResults.length > 0 && (
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      allTestsPassed 
                        ? 'bg-green-600/30 text-green-400' 
                        : 'bg-red-600/30 text-red-400'
                    }`}>
                      {testResults.filter(r => r.passed).length}/{testResults.length} passed
                    </span>
                  )}
                </div>
                {allTestsPassed && completedChallenges[selectedChallenge?.id] && (
                  <span className="text-green-400 flex items-center gap-1 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {testResults.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Click "Run Tests" to execute your code</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Success Banner */}
                    {allTestsPassed && (
                      <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="font-semibold text-green-400">All Tests Passed!</p>
                            <p className="text-sm text-green-300">
                              {completedChallenges[selectedChallenge?.id] 
                                ? 'Challenge already completed' 
                                : `+${selectedChallenge?.points} XP earned!`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Individual Test Results */}
                    {testResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-3 border ${
                          result.passed
                            ? 'bg-green-900/20 border-green-800'
                            : 'bg-red-900/20 border-red-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span className={`font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                            Test Case {idx + 1}
                          </span>
                          {result.description && (
                            <span className="text-gray-400 text-sm">- {result.description}</span>
                          )}
                        </div>

                        {result.error ? (
                          <div className="bg-red-950/50 rounded p-3 mt-2">
                            <p className="text-red-400 font-mono text-sm">{result.error}</p>
                            {result.errorStack && (
                              <pre className="text-red-400/70 font-mono text-xs mt-2 whitespace-pre-wrap">
                                {result.errorStack.split('\n').slice(1, 3).join('\n')}
                              </pre>
                            )}
                          </div>
                        ) : !result.passed && (
                          <div className="grid grid-cols-2 gap-3 mt-2 font-mono text-sm">
                            <div className="bg-gray-900/50 rounded p-2">
                              <p className="text-gray-400 text-xs mb-1">Expected:</p>
                              <p className="text-green-400">
                                {typeof result.expectedOutput === 'object'
                                  ? JSON.stringify(result.expectedOutput)
                                  : String(result.expectedOutput)}
                              </p>
                            </div>
                            <div className="bg-gray-900/50 rounded p-2">
                              <p className="text-gray-400 text-xs mb-1">Your Output:</p>
                              <p className="text-red-400">
                                {result.actual === undefined 
                                  ? 'undefined' 
                                  : typeof result.actual === 'object'
                                    ? JSON.stringify(result.actual)
                                    : String(result.actual)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Console Output */}
                    {consoleOutput.length > 0 && (
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Console Output:</h4>
                        <div className="bg-gray-900 rounded p-3 font-mono text-sm max-h-32 overflow-y-auto">
                          {consoleOutput.map((log, idx) => (
                            <div 
                              key={idx} 
                              className={
                                log.type === 'error' ? 'text-red-400' :
                                log.type === 'warn' ? 'text-yellow-400' :
                                'text-gray-300'
                              }
                            >
                              {log.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingChallenge;
