import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import SubjectPage from './pages/SubjectPage';
import LessonPlanner from './components/LessonPlanner';
import LessonPlannerDSA from './components/LessonPlannerDSA';
import LessonPlannerCN from './components/LessonPlannerCN';
import LessonPlannerDB from './components/LessonPlannerDB';
import WelcomeScreen from './components/WelcomeScreen';
import Navigation from './components/Navigation';
import AdaptiveTest from './components/AdaptiveTest';
import DashboardContent from './components/DashboardContent';
import DashboardSidebar from './components/DashboardSidebar';
import { KNOWLEDGE_GRAPH } from './data/mockData';
import { BookOpen, Cpu, Database, Globe, Code, Brain, ChevronRight, GraduationCap, User, LogOut, Star, Trophy } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VARKQuestionnaire from './components/VARKQuestionnaire';
import Leaderboard from './components/Leaderboard';
import LearningStyleSelector from './components/LearningStyleSelector';
import Dashboard from './pages/Dashboard';

// Subjects List Component
const SubjectsList = () => {
  const subjects = [
    {
      id: 'operating-systems',
      name: 'Operating Systems',
      description: 'Learn process management, memory, scheduling, and more',
      icon: Cpu,
      color: 'from-blue-500 to-purple-500',
      topics: 12,
      hours: 40,
      available: true
    },
    {
      id: 'data-structures',
      name: 'Data Structures',
      description: 'Arrays, linked lists, trees, graphs, and algorithms',
      icon: Code,
      color: 'from-green-500 to-teal-500',
      topics: 15,
      hours: 45,
      available: true
    },
    {
      id: 'computer-networks',
      name: 'Computer Networks',
      description: 'OSI model, TCP/IP, routing, and protocols',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      topics: 14,
      hours: 35,
      available: true
    },
    {
      id: 'database-systems',
      name: 'Database Systems',
      description: 'SQL, normalization, transactions, and indexing',
      icon: Database,
      color: 'from-pink-500 to-rose-500',
      topics: 12,
      hours: 45,
      available: true
    }
  ];

  const { isAuthenticated, user, logout } = useAuth();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showVARKPrompt, setShowVARKPrompt] = useState(false);

  // Check if user needs to take VARK test - only show for users who haven't completed it
  useEffect(() => {
    if (isAuthenticated && user) {
      // User has completed VARK if either varkCompleted is true OR learningStyle is set
      const hasCompletedVARK = user.varkCompleted === true || (user.learningStyle && user.learningStyle !== 'Not Set');

      if (!hasCompletedVARK) {
        setShowVARKPrompt(true);
      } else {
        // Reset prompt if user has completed VARK (in case they just completed it)
        setShowVARKPrompt(false);
      }
    } else {
      // Not authenticated - don't show VARK prompt
      setShowVARKPrompt(false);
    }
  }, [isAuthenticated, user]);

  // VARK Prompt Modal for new users
  if (showVARKPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-800 rounded-2xl p-8 border-2 border-blue-500 shadow-2xl">
          <div className="text-center">
            <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome, {user?.name}! 👋
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Before you start learning, let's discover your unique learning style!
            </p>
            <p className="text-gray-400 mb-8">
              This quick 16-question assessment will help us personalize your learning experience
              by showing you content that matches how you learn best.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/vark-questionnaire"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all text-white"
              >
                Take VARK Assessment (5 min)
              </Link>
              <button
                onClick={() => setShowVARKPrompt(false)}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all text-white"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Auth Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LearnPath
              </h1>
              <p className="text-gray-400 text-sm">Your personalized learning platform</p>
            </div>
          </div>


          {/* Auth Buttons or User Profile */}
          <div className="flex gap-3 items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-medium transition-all text-white"
                >
                  My Dashboard
                </Link>
                <Link
                  to="/vark-questionnaire"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  title="Update your learning preferences"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium hover:text-blue-400 transition-colors">{user?.name}</span>
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-sm">{user?.xp || 0}</span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-medium transition-all flex items-center gap-2 text-white"
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          Choose a subject to begin your learning journey
        </p>

        {/* Subjects Grid */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-2xl font-bold mb-8 text-white">Available Subjects</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {subjects.map(subject => (
              <div
                key={subject.id}
                className={`bg-slate-800 rounded-xl overflow-hidden border border-slate-700 ${subject.available ? 'hover:border-blue-500' : 'opacity-60'
                  } transition-all`}
              >
                <div className={`h-2 bg-gradient-to-r ${subject.color}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${subject.color}`}>
                      <subject.icon className="w-6 h-6 text-white" />
                    </div>

                    {!subject.available && (
                      <span className="text-xs bg-slate-700 px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white">{subject.name}</h3>
                  <p className="text-gray-400 mb-4">{subject.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span>{subject.topics} topics</span>
                    <span>•</span>
                    <span>~{subject.hours} hours</span>
                  </div>

                  {subject.available ? (
                    <Link
                      to={`/subject/${subject.id}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-white"
                    >
                      Start Learning
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-700 rounded-lg font-medium cursor-not-allowed text-gray-400"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Link
                to="/planner"
                className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Cpu className="w-5 h-5 text-blue-400" />
                <span className="text-white text-sm">OS Planner</span>
              </Link>
              <Link
                to="/planner/data-structures"
                className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Code className="w-5 h-5 text-teal-400" />
                <span className="text-white text-sm">DSA Planner</span>
              </Link>
              <Link
                to="/planner/computer-networks"
                className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Globe className="w-5 h-5 text-orange-400" />
                <span className="text-white text-sm">Networks Planner</span>
              </Link>
              <Link
                to="/planner/database-systems"
                className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Database className="w-5 h-5 text-indigo-400" />
                <span className="text-white text-sm">DB Planner</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
};

const App = () => {
  const [appState, setAppState] = useState('welcome'); // 'welcome' | 'test' | 'dashboard'
  const [userProfile, setUserProfile] = useState({
    name: 'Student',
    learningStyle: 'visual',
    theta: 0,
    streak: 0,
  });
  const [unlockedNodes, setUnlockedNodes] = useState(['os-intro']);
  const [completedNodes, setCompletedNodes] = useState([]);

  // Handle test completion
  const handleTestComplete = (theta) => {
    setUserProfile(prev => ({ ...prev, theta }));

    // Unlock nodes based on theta
    const nodesToUnlock = KNOWLEDGE_GRAPH
      .filter(node => theta >= (node.level - 1) * 0.3)
      .map(node => node.id);

    setUnlockedNodes(nodesToUnlock);
    setAppState('dashboard');
  };

  // Handle node completion
  const handleNodeComplete = (nodeId) => {
    if (!completedNodes.includes(nodeId)) {
      setCompletedNodes([...completedNodes, nodeId]);

      // Unlock dependent nodes
      const node = KNOWLEDGE_GRAPH.find(n => n.id === nodeId);
      if (node) {
        const dependents = KNOWLEDGE_GRAPH
          .filter(n => n.prereqs.includes(nodeId))
          .map(n => n.id);

        setUnlockedNodes(prev => [...new Set([...prev, ...dependents])]);
      }

      // Increase streak
      setUserProfile(prev => ({ ...prev, streak: prev.streak + 1 }));
    }
  };

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            {/* Subjects List - Main Entry Point */}
            <Route path="/" element={<SubjectsList />} />

            {/* VARK Dashboard - Personalized Content */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Subject-Specific Pages */}
            <Route path="/subject/:subjectName" element={<SubjectPage />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/vark-questionnaire" element={<VARKQuestionnaire />} />
            <Route path="/learning-style" element={<LearningStyleSelector />} />

            {/* Lesson Planner */}
            <Route
              path="/planner"
              element={<LessonPlanner subject="Operating Systems" userId={userProfile.name} />}
            />
            <Route
              path="/planner/data-structures"
              element={<LessonPlannerDSA subject="Data Structures" userId={userProfile.name} />}
            />
            <Route
              path="/planner/computer-networks"
              element={<LessonPlannerCN subject="Computer Networks" userId={userProfile.name} />}
            />
            <Route
              path="/planner/database-systems"
              element={<LessonPlannerDB subject="Database Systems" userId={userProfile.name} />}
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
