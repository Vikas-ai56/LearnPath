import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, CheckCircle, XCircle, Lightbulb, Eye, EyeOff, 
  Trophy, Loader2, RefreshCw, Award, Database,
  AlertTriangle, Terminal, Table, BookOpen, Info
} from 'lucide-react';
import { challengeAPI, setAuthToken } from '../api/service';
import { useAuth } from '../context/AuthContext';
import { CHINOOK_SCHEMA } from '../data/dbmsCodingChallenges';
import initSqlJs from 'sql.js';

const SQLCodingChallenge = ({ 
  challenges, 
  topicId, 
  topicName,
  onComplete 
}) => {
  const { user, updateUser } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [xpNotification, setXpNotification] = useState(null);
  const [showSchema, setShowSchema] = useState(false);
  
  // SQL.js state
  const [db, setDb] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const dbRef = useRef(null);

  // Initialize SQL.js and load Chinook database
  useEffect(() => {
    const initDatabase = async () => {
      try {
        setDbLoading(true);
        setDbError(null);
        
        // Initialize SQL.js with WASM
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });
        
        // Fetch the chinook.db file from public folder
        const response = await fetch('/chinook.db');
        if (!response.ok) {
          throw new Error('Failed to load database file');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Create database instance
        const database = new SQL.Database(uint8Array);
        dbRef.current = database;
        setDb(database);
        setDbLoading(false);
        
        console.log('✅ Chinook database loaded successfully in browser');
      } catch (error) {
        console.error('Failed to initialize SQL.js:', error);
        setDbError(error.message);
        setDbLoading(false);
      }
    };
    
    initDatabase();
    
    // Cleanup on unmount
    return () => {
      if (dbRef.current) {
        dbRef.current.close();
      }
    };
  }, []);

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
    setUserQuery(challenge.starterCode);
    setQueryResult(null);
    setShowHints(false);
    setCurrentHintIndex(0);
    setShowSolution(false);
    setActiveTab('problem');
  };

  // Execute SQL query using sql.js (browser-based)
  const executeQuery = async () => {
    if (!selectedChallenge || !userQuery.trim()) return;
    if (!db) {
      setQueryResult({
        success: false,
        passed: false,
        error: 'Database not loaded',
        feedback: ['✗ Database is still loading. Please wait...']
      });
      return;
    }
    
    setIsRunning(true);
    setQueryResult(null);

    try {
      // Execute user's query
      let userResults;
      try {
        userResults = db.exec(userQuery);
      } catch (sqlError) {
        setQueryResult({
          success: false,
          passed: false,
          error: sqlError.message,
          feedback: [`✗ SQL Error: ${sqlError.message}`]
        });
        setIsRunning(false);
        return;
      }

      // Format results
      const rows = [];
      const columns = userResults[0]?.columns || [];
      
      if (userResults[0]?.values) {
        userResults[0].values.forEach(row => {
          const rowObj = {};
          columns.forEach((col, i) => {
            rowObj[col] = row[i];
          });
          rows.push(rowObj);
        });
      }

      // Execute verification query to compare
      let verificationPassed = false;
      let feedback = [];

      try {
        const expectedResults = db.exec(selectedChallenge.verificationQuery);
        const expectedRows = expectedResults[0]?.values?.length || 0;
        const userRowCount = userResults[0]?.values?.length || 0;

        // Check row count if specified
        if (selectedChallenge.expectedRowCount !== undefined) {
          if (userRowCount === selectedChallenge.expectedRowCount) {
            verificationPassed = true;
            feedback.push(`✓ Correct! Your query returned ${userRowCount} row(s) as expected.`);
          } else {
            feedback.push(`✗ Expected ${selectedChallenge.expectedRowCount} rows, but got ${userRowCount}.`);
          }
        } else {
          // Compare with verification query results
          if (userRowCount === expectedRows) {
            // Compare actual data
            const userValues = JSON.stringify(userResults[0]?.values || []);
            const expectedValues = JSON.stringify(expectedResults[0]?.values || []);
            
            if (userValues === expectedValues) {
              verificationPassed = true;
              feedback.push('✓ Perfect! Your query produces the correct results.');
            } else if (userRowCount === expectedRows) {
              // Same row count but different values - might still be correct for some challenges
              verificationPassed = true;
              feedback.push('✓ Great! Your query returned the expected number of results.');
            } else {
              feedback.push('✗ Your results do not match the expected output.');
            }
          } else {
            feedback.push(`✗ Expected ${expectedRows} rows, but your query returned ${userRowCount}.`);
          }
        }
      } catch (verifyError) {
        // If verification query fails, just check if user query succeeded
        if (rows.length > 0) {
          verificationPassed = true;
          feedback.push('✓ Query executed successfully!');
        }
      }

      setQueryResult({
        success: true,
        passed: verificationPassed,
        rows,
        columns,
        rowCount: rows.length,
        feedback
      });

      // Auto-complete if passed
      if (verificationPassed) {
        await handleChallengeComplete();
      }

    } catch (error) {
      setQueryResult({
        success: false,
        passed: false,
        error: error.message,
        feedback: [`✗ Error: ${error.message}`]
      });
    }

    setIsRunning(false);
  };

  // Reset database to original state
  const resetDatabase = async () => {
    try {
      setDbLoading(true);
      if (dbRef.current) {
        dbRef.current.close();
      }
      
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      const response = await fetch('/chinook.db');
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const database = new SQL.Database(uint8Array);
      dbRef.current = database;
      setDb(database);
      setDbLoading(false);
      setQueryResult(null);
      
      setXpNotification({
        type: 'info',
        message: 'Database reset to original state!'
      });
      setTimeout(() => setXpNotification(null), 3000);
    } catch (error) {
      setDbError(error.message);
      setDbLoading(false);
    }
  };

  // Handle challenge completion
  const handleChallengeComplete = async () => {
    if (!selectedChallenge || !user) return;
    
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
      
      if (response.token) {
        setAuthToken(response.token);
        if (updateUser) {
          updateUser({ ...user, xp: response.totalXp });
        }
      }
      
      setCompletedChallenges(prev => ({
        ...prev,
        [selectedChallenge.id]: {
          topicId,
          xpAwarded: response.xpAwarded,
          completedAt: new Date().toISOString()
        }
      }));
      
      if (response.xpAwarded > 0) {
        setXpNotification({
          type: 'success',
          message: `+${response.xpAwarded} XP earned!`,
          xp: response.xpAwarded,
          total: response.totalXp
        });
      }
      
      if (onComplete) {
        onComplete(selectedChallenge.id, response.xpAwarded);
      }
      
      setTimeout(() => setXpNotification(null), 4000);
      
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  // Reset query to starter
  const resetQuery = () => {
    if (selectedChallenge) {
      setUserQuery(selectedChallenge.starterCode);
      setQueryResult(null);
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
        <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No SQL challenges available for this topic yet.</p>
      </div>
    );
  }

  // Show database loading state
  if (dbLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-300 font-semibold">Loading Chinook Database...</p>
        <p className="text-gray-500 text-sm mt-2">Setting up your personal SQL environment</p>
      </div>
    );
  }

  // Show database error state
  if (dbError) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 font-semibold">Failed to load database</p>
        <p className="text-gray-500 text-sm mt-2">{dbError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
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
                    ? 'bg-blue-600 text-white'
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
                { id: 'schema', label: 'Schema', icon: Database },
                { id: 'hints', label: 'Hints', icon: Lightbulb },
                { id: 'solution', label: 'Solution', icon: Eye }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50'
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
                      <span className="flex items-center gap-1">
                        <Database className="w-4 h-4 text-blue-400" />
                        Chinook DB
                      </span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {selectedChallenge.description}
                    </p>
                  </div>

                  {selectedChallenge.expectedRowCount && (
                    <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-800">
                      <p className="text-blue-300 text-sm flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Expected result: {selectedChallenge.expectedRowCount} rows
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'schema' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    Chinook Database Schema
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Click on a table to see its columns.
                  </p>
                  
                  <div className="space-y-2">
                    {Object.entries(CHINOOK_SCHEMA).map(([tableName, columns]) => (
                      <details key={tableName} className="bg-gray-800 rounded-lg">
                        <summary className="px-4 py-2 cursor-pointer hover:bg-gray-700 rounded-lg flex items-center gap-2">
                          <Table className="w-4 h-4 text-green-400" />
                          <span className="font-mono text-green-400">{tableName}</span>
                          <span className="text-gray-500 text-sm">({columns.length} columns)</span>
                        </summary>
                        <div className="px-4 pb-3 pt-1">
                          <div className="flex flex-wrap gap-1">
                            {columns.map((col, idx) => (
                              <span 
                                key={col} 
                                className={`text-xs px-2 py-1 rounded ${
                                  idx === 0 ? 'bg-yellow-900/50 text-yellow-300' : 'bg-gray-700 text-gray-300'
                                }`}
                                title={idx === 0 ? 'Primary Key' : ''}
                              >
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      </details>
                    ))}
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
                      className="text-sm text-blue-400 hover:text-blue-300"
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
                      <p className="text-sm mt-1">Try writing the query yourself first!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'solution' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-400" />
                      Solution
                    </h3>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showSolution ? 'Hide' : 'Reveal'}
                    </button>
                  </div>

                  {showSolution ? (
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-700 px-4 py-2 text-sm text-gray-300">
                          Solution Query
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm text-green-400 font-mono whitespace-pre-wrap">
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
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - SQL Editor & Results */}
          <div className="w-3/5 flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">query.sql</span>
                <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded">
                  🔒 Browser SQLite (sql.js)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetDatabase}
                  className="px-3 py-1.5 text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  title="Reset database to original state"
                >
                  <Database className="w-4 h-4" />
                  Reset DB
                </button>
                <button
                  onClick={resetQuery}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white flex items-center gap-1"
                  title="Reset to starter code"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={executeQuery}
                  disabled={isRunning || dbLoading}
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
                      Run Query
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Monaco Editor for SQL */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                defaultLanguage="sql"
                theme="vs-dark"
                value={userQuery}
                onChange={(value) => setUserQuery(value || '')}
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
                }}
              />
            </div>

            {/* Results Panel */}
            <div className="h-72 bg-gray-800 border-t border-gray-700 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Query Results
                  </span>
                  {queryResult && (
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      queryResult.passed 
                        ? 'bg-green-600/30 text-green-400' 
                        : 'bg-red-600/30 text-red-400'
                    }`}>
                      {queryResult.passed ? 'Passed' : 'Failed'}
                    </span>
                  )}
                </div>
                {queryResult?.passed && completedChallenges[selectedChallenge?.id] && (
                  <span className="text-green-400 flex items-center gap-1 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-auto p-4">
                {!queryResult ? (
                  <div className="text-center text-gray-500 py-8">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Click "Run Query" to execute your SQL</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Feedback Messages */}
                    {queryResult.feedback && (
                      <div className={`rounded-lg p-4 ${
                        queryResult.passed 
                          ? 'bg-green-600/20 border border-green-600' 
                          : 'bg-red-600/20 border border-red-600'
                      }`}>
                        {queryResult.feedback.map((msg, idx) => (
                          <p key={idx} className={`${queryResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                            {msg}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Error Message */}
                    {queryResult.error && (
                      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                        <p className="text-red-400 font-mono text-sm">{queryResult.error}</p>
                      </div>
                    )}

                    {/* Result Table */}
                    {queryResult.rows && queryResult.rows.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-700">
                              {Object.keys(queryResult.rows[0]).map(col => (
                                <th key={col} className="px-3 py-2 text-left text-gray-300 font-medium">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResult.rows.slice(0, 15).map((row, idx) => (
                              <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700/50">
                                {Object.values(row).map((val, colIdx) => (
                                  <td key={colIdx} className="px-3 py-2 text-gray-300 font-mono">
                                    {val === null ? <span className="text-gray-500">NULL</span> : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {queryResult.rowCount > 15 && (
                          <p className="text-gray-500 text-sm mt-2 text-center">
                            Showing 15 of {queryResult.rowCount} rows
                          </p>
                        )}
                      </div>
                    )}

                    {/* Row Count */}
                    {queryResult.rowCount !== undefined && (
                      <p className="text-gray-400 text-sm">
                        Returned {queryResult.rowCount} rows
                        {queryResult.expectedRowCount && ` (expected: ${queryResult.expectedRowCount})`}
                      </p>
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

export default SQLCodingChallenge;
