import React, { useState, useEffect } from 'react';
import { PlayCircle, BookOpen, Brain, Code, Award, Clock, Home, ChevronLeft, ExternalLink, CheckCircle, FileDown, Star, Lightbulb, Terminal, Database } from 'lucide-react';
import { API_BASE_URL } from '../api/service';
import { Link, useParams, useLocation } from 'react-router-dom';
import { OS_CURRICULUM, OS_QUIZZES, OS_EXERCISES } from '../data/operatingSystemsCurriculum.js';
import { DS_CURRICULUM, DS_QUIZZES, DS_EXERCISES } from '../data/dataStructuresCurriculum.js';
import { CN_CURRICULUM, CN_QUIZZES, CN_EXERCISES } from '../data/computerNetworksCurriculum.js';
import { DBMS_CURRICULUM, DBMS_QUIZZES, DBMS_EXERCISES } from '../data/databaseSystemsCurriculum.js';
import QuizComponent from '../components/QuizComponent';
import CodingChallenge from '../components/CodingChallenge';
import SQLCodingChallenge from '../components/SQLCodingChallenge';
import { useAuth } from '../context/AuthContext';
import { organizeContentByStyle } from '../api/varkUtils';
import { getTopicLink } from '../utils/topicLinks';
import { getChallengesByTopic, CHALLENGE_TOPICS } from '../data/osCodingChallenges';
import { getDbmsChallengesByTopic, DBMS_CHALLENGE_TOPICS } from '../data/dbmsCodingChallenges';

const SubjectPage = () => {
  const { subjectName } = useParams();
  const subject = subjectName ? decodeURIComponent(subjectName).replace(/-/g, ' ') : 'Operating Systems';

  const [curriculum, setCurriculum] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedExerciseTopic, setSelectedExerciseTopic] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [modalInitialSection, setModalInitialSection] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [learningStyle, setLearningStyle] = useState(null);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [otherContent, setOtherContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const { isAuthenticated, fetchQuizProgress, isQuizCompleted, user } = useAuth();
  const location = useLocation();

  // Helper to get correct data based on subject
  const getSubjectData = () => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('data structure')) {
      return {
        nodes: DS_CURRICULUM.nodes,
        quizzes: DS_QUIZZES,
        exercises: DS_EXERCISES
      };
    }
    if (subjectLower.includes('network')) {
      return {
        nodes: CN_CURRICULUM.nodes,
        quizzes: CN_QUIZZES,
        exercises: CN_EXERCISES
      };
    }
    if (subjectLower.includes('database')) {
      return {
        nodes: DBMS_CURRICULUM.nodes,
        quizzes: DBMS_QUIZZES,
        exercises: DBMS_EXERCISES
      };
    }
    // Default to OS
    return {
      nodes: OS_CURRICULUM.nodes,
      quizzes: OS_QUIZZES,
      exercises: OS_EXERCISES
    };
  };

  // Helper to get the correct planner route based on subject
  const getPlannerRoute = (subjectName) => {
    const subjectLower = subjectName.toLowerCase();
    if (subjectLower.includes('data structure')) {
      return '/planner/data-structures';
    }
    if (subjectLower.includes('network')) {
      return '/planner/computer-networks';
    }
    if (subjectLower.includes('database')) {
      return '/planner/database-systems';
    }
    // Default to OS
    return '/planner';
  };

  const { quizzes, exercises } = getSubjectData();

  useEffect(() => {
    loadCurriculum();
    // Fetch quiz progress when user is authenticated
    if (isAuthenticated) {
      fetchQuizProgress(subject);
      fetchPersonalizedContent();
    }
  }, [subject, isAuthenticated]);

  const fetchPersonalizedContent = async () => {
    try {
      setContentLoading(true);
      const token = localStorage.getItem('token');

      // Fetch user profile to get learning style
      const profileRes = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!profileRes.ok) {
        console.error('Failed to fetch profile');
        return;
      }

      const profileData = await profileRes.json();
      setLearningStyle(profileData.learning_style);

      // Fetch content filtered by this subject
      const courseName = subject.toLowerCase().replace(/\s+/g, '-');
      const contentRes = await fetch(
        `${API_BASE_URL}/user/content?course=${encodeURIComponent(courseName)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (!contentRes.ok) {
        console.error('Failed to fetch content');
        return;
      }

      const contentData = await contentRes.json();

      // Organize content by learning style
      const { recommended, others } = organizeContentByStyle(
        contentData.content || [],
        profileData.learning_style
      );

      setRecommendedContent(recommended);
      setOtherContent(others);
    } catch (error) {
      console.error('Error fetching personalized content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const loadCurriculum = async () => {
    try {
      setLoading(true);
      const { nodes } = getSubjectData();
      console.log(`Loading ${subject} curriculum:`, nodes.length, 'topics');
      setCurriculum(nodes);
    } catch (error) {
      console.error('Error loading curriculum:', error);
      setCurriculum([]);
    } finally {
      setLoading(false);
    }
  };

  const getTopicsByLevel = () => {
    const grouped = {};
    curriculum.forEach(topic => {
      if (!grouped[topic.level]) grouped[topic.level] = [];
      grouped[topic.level].push(topic);
    });
    return grouped;
  };

  const isTopicUnlocked = (topic) => {
    if (!topic.prereqs || topic.prereqs.length === 0) return true;
    return topic.prereqs.every(prereqId => userProgress[prereqId] === 'completed');
  };

  const getDomainColor = (domain) => {
    const colors = {
      'Foundation': 'bg-blue-500',
      'Process Management': 'bg-green-500',
      'Synchronization': 'bg-purple-500',
      'Memory': 'bg-orange-500',
      'Storage': 'bg-red-500'
    };
    return colors[domain] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white text-xl">Loading curriculum...</div>
      </div>
    );
  }

  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No curriculum found</h1>
          <p className="text-gray-400 mb-6">Loading curriculum data for {subject}...</p>
          <Link to="/" className="text-blue-400 hover:underline">← Back to Subjects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <ChevronLeft className="w-4 h-4 text-gray-600" />
            <span className="text-white font-medium">{subject}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to={getPlannerRoute(subject)} 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
            >
              Lesson Planner
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{subject}</h1>
          <p className="text-xl text-blue-100 mb-6">
            Master operating systems from fundamentals to advanced concepts
          </p>

          <div className="flex gap-6">
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold">{curriculum.length}</div>
              <div className="text-sm text-blue-100">Topics</div>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold">
                {Object.keys(userProgress).filter(k => userProgress[k] === 'completed').length}
              </div>
              <div className="text-sm text-blue-100">Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold">~40h</div>
              <div className="text-sm text-blue-100">Total Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            {['overview', 'path', 'videos', 'quizzes', 'exercises'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 transition-colors ${activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === 'overview' && (
          <div>
            {/* Personalized Recommendations Section */}
            {isAuthenticated && learningStyle && recommendedContent.length > 0 && (
              <div className="mb-12">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-2 border-purple-500/50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold">Recommended for You</h2>
                    <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm font-medium">
                      {learningStyle} Learner
                    </span>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Based on your VARK learning style assessment, these resources are optimized for your learning preferences.
                  </p>

                  {contentLoading ? (
                    <div className="text-center py-8 text-gray-400">Loading personalized content...</div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedContent.map((item, index) => (
                        <a
                          key={index}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-800/80 hover:bg-slate-700/80 border-2 border-yellow-500/50 rounded-lg p-4 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-medium text-yellow-400 uppercase">
                                {item.type}
                              </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                          </div>
                          <h3 className="font-semibold mb-1 text-white group-hover:text-blue-400">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <h2 className="text-3xl font-bold mb-8">Learning Path</h2>

            {Object.entries(getTopicsByLevel()).map(([level, topics]) => (
              <div key={level} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-400">
                    Level {level}
                  </h3>
                  <a
                    href={`/cheatsheets/${subjectName}/level${level}.jpg`}
                    download={`${subjectName}-level${level}-cheatsheet.jpg`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-white"
                  >
                    <FileDown className="w-4 h-4" />
                    Cheatsheet
                  </a>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topics.map(topic => {
                    const unlocked = isTopicUnlocked(topic);
                    const status = userProgress[topic.id];

                    return (
                      <div
                        key={topic.id}
                        className={`bg-slate-800 rounded-lg p-6 border-2 transition-all cursor-pointer ${unlocked
                          ? 'border-slate-700 hover:border-blue-500'
                          : 'border-slate-800 opacity-50 cursor-not-allowed'
                          } ${status === 'completed' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => {
                          if (unlocked) {
                            setModalInitialSection('videos');
                            setSelectedTopic(topic);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-2 h-2 rounded-full ${getDomainColor(topic.domain)}`} />
                          {status === 'completed' && (
                            <Award className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>

                        <h4 className="text-lg font-semibold mb-2">{topic.label}</h4>
                        <p className="text-sm text-gray-400 mb-4">{topic.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <PlayCircle className="w-4 h-4" />
                            {topic.videos?.length || 0} videos
                          </span>
                          <span className="capitalize">{topic.difficulty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'path' && (
          <LearningPathView curriculum={curriculum} userProgress={userProgress} subjectName={subjectName} />
        )}

        {activeTab === 'videos' && (
          <VideosView curriculum={curriculum} />
        )}

        {activeTab === 'quizzes' && (
          isAuthenticated ? (
            <QuizzesView
              curriculum={curriculum}
              onStartQuiz={(topic) => {
                setModalInitialSection('quiz');
                setSelectedTopic(topic);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <Brain className="w-16 h-16 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Login Required</h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Please sign in to access quizzes and track your progress
              </p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )
        )}

        {activeTab === 'exercises' && (
          isAuthenticated ? (
            <ExercisesView
              curriculum={curriculum}
              exercises={exercises}
              subject={subject}
              onSelectTopic={(topic) => setSelectedExerciseTopic(topic)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <Code className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Login Required</h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Please sign in to access exercises and practice problems
              </p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )
        )}
      </div>

      {/* Exercise Modal */}
      {selectedExerciseTopic && (
        <ExerciseModal
          topic={selectedExerciseTopic}
          exercises={exercises[selectedExerciseTopic.id] || []}
          subject={subject}
          onClose={() => setSelectedExerciseTopic(null)}
        />
      )}

      {/* Topic Modal */}
      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          quizzes={quizzes}
          subject={subject}
          initialSection={modalInitialSection}
          onClose={() => setSelectedTopic(null)}
          onComplete={() => {
            setUserProgress(prev => ({ ...prev, [selectedTopic.id]: 'completed' }));
            setSelectedTopic(null);
          }}
        />
      )}
    </div>
  );
};

// Learning Path Visualization
const LearningPathView = ({ curriculum, userProgress, subjectName }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-4">Complete Learning Path</h2>
      <p className="text-gray-400 mb-8">
        Follow this path to master Operating Systems systematically
      </p>

      <div className="relative">
        {curriculum
          .sort((a, b) => a.level - b.level)
          .reduce((acc, topic) => {
            const levelIndex = acc.findIndex(group => group.level === topic.level);
            if (levelIndex === -1) {
              acc.push({ level: topic.level, topics: [topic] });
            } else {
              acc[levelIndex].topics.push(topic);
            }
            return acc;
          }, [])
          .map((levelGroup, groupIndex) => (
            <div key={levelGroup.level} className="mb-12">
              {/* Level Header with Cheatsheet Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-blue-400">
                  Level {levelGroup.level}
                </h3>
                <a
                  href={`/cheatsheets/${subjectName}/level${levelGroup.level}.jpg`}
                  download={`${subjectName}-level${levelGroup.level}-cheatsheet.jpg`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-white"
                >
                  <FileDown className="w-4 h-4" />
                  Cheatsheet
                </a>
              </div>

              {/* Topics in this level */}
              <div className="grid md:grid-cols-2 gap-6">
                {levelGroup.topics.map((topic, index) => {
                  const status = userProgress[topic.id];
                  const isCompleted = status === 'completed';

                  return (
                    <div key={topic.id} className="flex items-start mb-8">
                      {/* Timeline */}
                      <div className="flex flex-col items-center mr-6">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                            ? 'bg-green-500'
                            : status === 'in-progress'
                              ? 'bg-blue-500'
                              : 'bg-slate-700'
                            }`}
                        >
                          {isCompleted ? (
                            <Award className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        {index < curriculum.length - 1 && (
                          <div className="w-0.5 h-20 bg-slate-700 my-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-slate-800 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold">{topic.label}</h3>
                          <span className="text-xs bg-slate-700 px-3 py-1 rounded-full">
                            Level {topic.level}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-4">{topic.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {topic.topics?.map((t, i) => (
                            <span key={i} className="text-xs bg-slate-700 px-2 py-1 rounded">
                              {t}
                            </span>
                          ))}
                        </div>

                        {topic.videos && topic.videos.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-blue-400">
                            <PlayCircle className="w-4 h-4" />
                            {topic.videos.length} video lectures available
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Videos View
const VideosView = ({ curriculum }) => {
  const allVideos = curriculum.flatMap(topic =>
    (topic.videos || []).map(video => ({ ...video, topic: topic.label, topicId: topic.id }))
  );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Video Lectures</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allVideos.map((video, index) => (
          <div key={index} className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition-all">
            {/* Thumbnail */}
            <div className="relative bg-slate-700 h-48 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white/50" />
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                {video.duration}
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="text-xs text-blue-400 mb-2">{video.topic}</div>
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{video.channel}</p>

              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <PlayCircle className="w-4 h-4" />
                Watch on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quizzes View
const QuizzesView = ({ curriculum, onStartQuiz }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Practice Quizzes</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {curriculum.map(topic => (
          <div key={topic.id} className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">{topic.label}</h3>
            </div>

            <p className="text-gray-400 mb-4">Test your understanding of {topic.label.toLowerCase()}</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">5-10 questions</span>
              <button
                onClick={() => onStartQuiz(topic)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exercises View
const ExercisesView = ({ curriculum, onSelectTopic, exercises, subject }) => {
  const isDataStructures = subject.toLowerCase().includes('data structure');
  const getExerciseCount = (topicId) => {
    return exercises[topicId]?.length || 0;
  };

  // New improved structure for Data Structures
  if (isDataStructures) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">LeetCode Practice Problems</h2>
          <p className="text-gray-400">Master data structures through hands-on coding challenges</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.map(topic => {
            const exerciseCount = getExerciseCount(topic.id);
            return (
              <div 
                key={topic.id} 
                onClick={() => onSelectTopic(topic)}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <Code className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{topic.label}</h3>
                      <p className="text-xs text-gray-500">{topic.domain}</p>
                    </div>
                  </div>
                  {exerciseCount > 0 && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      {exerciseCount} problems
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{topic.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300">
                    View Problems →
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Operating Systems with interactive coding challenges
  const isOperatingSystems = subject.toLowerCase().includes('operating system');
  if (isOperatingSystems) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Interactive Coding Challenges</h2>
          <p className="text-gray-400">
            Master OS concepts through hands-on coding exercises with real-time execution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.map(topic => {
            const hasChallenges = CHALLENGE_TOPICS.includes(topic.id);
            const challengeCount = hasChallenges ? getChallengesByTopic(topic.id).length : 0;
            
            return (
              <div 
                key={topic.id} 
                onClick={() => hasChallenges && onSelectTopic(topic)}
                className={`bg-slate-800 rounded-xl p-6 border transition-all group ${
                  hasChallenges 
                    ? 'border-slate-700 hover:border-green-500 cursor-pointer hover:shadow-lg hover:shadow-green-500/10' 
                    : 'border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      hasChallenges 
                        ? 'bg-green-500/20 group-hover:bg-green-500/30' 
                        : 'bg-gray-500/20'
                    }`}>
                      <Terminal className={`w-5 h-5 ${hasChallenges ? 'text-green-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{topic.label}</h3>
                      <p className="text-xs text-gray-500">{topic.domain}</p>
                    </div>
                  </div>
                  {hasChallenges ? (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      {challengeCount} {challengeCount === 1 ? 'challenge' : 'challenges'}
                    </span>
                  ) : (
                    <span className="bg-gray-500/20 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{topic.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  {hasChallenges ? (
                    <>
                      <span className="text-sm font-medium text-green-400 group-hover:text-green-300">
                        Start Coding →
                      </span>
                      <Code className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Challenges in development
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary of available challenges */}
        <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Available Challenges Summary
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHALLENGE_TOPICS.map(topicId => {
              const topic = curriculum.find(t => t.id === topicId);
              const challenges = getChallengesByTopic(topicId);
              if (!topic) return null;
              
              const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
              
              return (
                <div key={topicId} className="bg-slate-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">{topic.label}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">{challenges.length} challenges</span>
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {totalPoints} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Original structure for other subjects
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Practical Exercises</h2>

      <div className="space-y-6">
        {curriculum.map(topic => (
          <div key={topic.id} className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">{topic.label} Exercises</h3>
            </div>

            <p className="text-gray-400 mb-6">{topic.description}</p>

            <div
              onClick={() => onSelectTopic(topic)}
              className="bg-slate-900 p-4 rounded border border-slate-700 hover:border-blue-500 cursor-pointer transition-colors max-w-md"
            >
              <h4 className="font-semibold mb-2 text-blue-400">Coding Challenge</h4>
              <p className="text-sm text-gray-400">Practice with exercises</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exercise Modal Component
const ExerciseModal = ({ topic, exercises, onClose, subject }) => {
  const isDataStructures = subject.toLowerCase().includes('data structure');
  const isOperatingSystems = subject.toLowerCase().includes('operating system');
  const isDatabaseSystems = subject.toLowerCase().includes('database');
  const hasCodingChallenges = CHALLENGE_TOPICS.includes(topic.id);
  const hasDbmsChallenges = DBMS_CHALLENGE_TOPICS.includes(topic.id);
  
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'beginner') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (difficulty === 'intermediate') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getDifficultyLabel = (difficulty) => {
    if (difficulty === 'beginner') return 'Easy';
    if (difficulty === 'intermediate') return 'Medium';
    return 'Hard';
  };

  const getDifficultyIcon = (difficulty) => {
    if (difficulty === 'beginner') return '🟢';
    if (difficulty === 'intermediate') return '🟠';
    return '🔴';
  };

  const handleLeetCodeClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // New improved structure for Data Structures
  if (isDataStructures) {
    // Group exercises by difficulty
    const groupedExercises = {
      easy: exercises.filter(e => e.difficulty === 'beginner'),
      medium: exercises.filter(e => e.difficulty === 'intermediate'),
      hard: exercises.filter(e => e.difficulty === 'hard')
    };

    const difficultySections = [
      { key: 'easy', label: 'Easy', color: 'green', exercises: groupedExercises.easy },
      { key: 'medium', label: 'Medium', color: 'orange', exercises: groupedExercises.medium },
      { key: 'hard', label: 'Hard', color: 'red', exercises: groupedExercises.hard }
    ];

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
        <div className="bg-slate-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 rounded-t-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{topic.label}</h2>
                <p className="text-blue-100">LeetCode Practice Problems</p>
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">×</button>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                <span className="font-semibold">{exercises.length}</span> problems
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Easy: <span className="font-semibold">{groupedExercises.easy.length}</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Medium: <span className="font-semibold">{groupedExercises.medium.length}</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Hard: <span className="font-semibold">{groupedExercises.hard.length}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {exercises.length > 0 ? (
              <div className="space-y-8">
                {difficultySections.map(section => {
                  if (section.exercises.length === 0) return null;
                  
                  const colorClasses = {
                    easy: {
                  bar: 'bg-green-500',
                  text: 'text-green-400',
                  bg: 'bg-green-500/20',
                  border: 'border-green-500/30'
                },
                    medium: {
                  bar: 'bg-orange-500',
                  text: 'text-orange-400',
                  bg: 'bg-orange-500/20',
                  border: 'border-orange-500/30'
                },
                    hard: {
                  bar: 'bg-red-500',
                  text: 'text-red-400',
                  bg: 'bg-red-500/20',
                  border: 'border-red-500/30'
                }
                  };
                  
                  const colors = colorClasses[section.key];
                  
                  return (
                    <div key={section.key} className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`h-1 w-12 ${colors.bar} rounded-full`}></div>
                        <h3 className={`text-2xl font-bold ${colors.text}`}>
                          {section.label} Problems
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {section.exercises.length} {section.exercises.length === 1 ? 'problem' : 'problems'}
                        </span>
                      </div>
                      
                      <div className="grid gap-4">
                        {section.exercises.map((exercise, index) => (
                          <div 
                            key={index} 
                            className="bg-slate-900 rounded-lg p-5 border border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer group"
                            onClick={() => exercise.leetcodeUrl && handleLeetCodeClick(exercise.leetcodeUrl)}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                                  {index + 1}. {exercise.title}
                                  <ExternalLink className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h4>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty)} ml-4 flex-shrink-0`}>
                                {getDifficultyIcon(exercise.difficulty)} {getDifficultyLabel(exercise.difficulty)}
                              </span>
                            </div>

                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{exercise.description}</p>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (exercise.leetcodeUrl) handleLeetCodeClick(exercise.leetcodeUrl);
                              }}
                              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2 text-white shadow-lg shadow-orange-500/20"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Solve on LeetCode
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No exercises available for this topic yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Operating Systems with Coding Challenges
  if (isOperatingSystems && hasCodingChallenges) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 flex-shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">{topic.label}</h2>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Interactive Coding Challenges
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Coding Challenge Component */}
          <div className="flex-1 overflow-auto">
            <CodingChallenge 
              challenges={getChallengesByTopic(topic.id)}
              topicId={topic.id} 
              topicName={topic.label}
              onComplete={(challengeId, points) => {
                console.log(`Completed challenge ${challengeId} for ${points} XP`);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Database Systems with SQL Coding Challenges
  if (isDatabaseSystems && hasDbmsChallenges) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex-shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">{topic.label}</h2>
                <p className="text-purple-100 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  SQL Coding Challenges - Chinook Database
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* SQL Coding Challenge Component */}
          <div className="flex-1 overflow-auto">
            <SQLCodingChallenge 
              challenges={getDbmsChallengesByTopic(topic.id)}
              topicId={topic.id} 
              topicName={topic.label}
              onComplete={(challengeId, points) => {
                console.log(`Completed SQL challenge ${challengeId} for ${points} XP`);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Original structure for other subjects
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 rounded-t-xl">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold">{topic.label} Exercises</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">×</button>
          </div>
          <p className="text-blue-100">Practice what you've learned with these challenges</p>
        </div>

        <div className="p-8 space-y-6">
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <div key={index} className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{exercise.title}</h3>
                  {exercise.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {getDifficultyLabel(exercise.difficulty)}
                    </span>
                  )}
                </div>

                <p className="text-gray-300 mb-6">{exercise.description}</p>

                {exercise.input && (
                  <div className="bg-black/30 rounded p-4 mb-4 font-mono text-sm">
                    <div className="text-gray-500 mb-1">Input:</div>
                    <div className="text-white">{exercise.input}</div>
                  </div>
                )}

                {exercise.expectedOutput && (
                  <div className="bg-black/30 rounded p-4 mb-6 font-mono text-sm">
                    <div className="text-gray-500 mb-1">Expected Output:</div>
                    <div className="text-green-400">{exercise.expectedOutput}</div>
                  </div>
                )}

                {exercise.leetcodeUrl ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleLeetCodeClick(exercise.leetcodeUrl)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Solve on LeetCode
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                      Start Coding
                    </button>
                    <button className="px-4 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg text-sm transition-colors">
                      View Solution
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-12">
              <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No exercises available for this topic yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Topic Modal Component
const TopicModal = ({ topic, quizzes, subject, onClose, onComplete, initialSection = 'videos' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
      <div className="bg-slate-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-t-xl">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold">{topic.label}</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100">{topic.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {['videos', 'content', 'quiz'].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 ${activeSection === section
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400'
                }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          {activeSection === 'videos' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Video Lectures</h3>
              {topic.videos && topic.videos.map((video, index) => (
                <div key={index} className="bg-slate-900 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-700 w-32 h-20 rounded flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="w-8 h-8 text-white/50" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{video.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{video.channel}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">{video.duration}</span>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:underline"
                        >
                          Watch on YouTube →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'content' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Key Topics</h3>
              <div className="grid gap-4">
                {topic.topics && topic.topics.map((t, index) => {
                  const topicLink = getTopicLink(t, subject);
                  return (
                    <a
                      key={index}
                      href={topicLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 p-4 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-white group-hover:text-blue-400 transition-colors">{t}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'quiz' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Test Your Knowledge</h3>
              <p className="text-gray-400 mb-6">
                Complete the quiz to mark this topic as learned
              </p>
              {quizzes[topic.id] ? (
                <QuizComponent
                  topicId={topic.id}
                  quizData={quizzes[topic.id]}
                  topicData={topic}
                  onComplete={onComplete}
                />
              ) : (
                <p className="text-gray-400">No quiz available for this topic yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-slate-600 hover:bg-slate-700"
          >
            Close
          </button>
          <button
            onClick={onComplete}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700"
          >
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;