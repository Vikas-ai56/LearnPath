import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/service';
import { 
  Calendar, Clock, CheckCircle, Circle, Target, TrendingUp, 
  BookOpen, Video, Brain, Award, ChevronRight, AlertCircle, Home 
} from 'lucide-react';
import { OS_CURRICULUM } from '../data/operatingSystemsCurriculum.js';

const LessonPlanner = ({ subject = 'Operating Systems', userId }) => {
  const [learningGoal, setLearningGoal] = useState('mastery'); // mastery, quick-learn, exam-prep
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [startDate, setStartDate] = useState(new Date());
  const [plan, setPlan] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  useEffect(() => {
    generatePlan();
  }, [learningGoal, hoursPerWeek, subject]);

  const generatePlan = async () => {
    let curriculum = [];
    
    // First try API
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${encodeURIComponent(subject)}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        curriculum = data.data;
      }
    } catch (error) {
      console.log('API not available, using local data');
    }
    
    // Fallback to local data
    if (curriculum.length === 0) {
      curriculum = OS_CURRICULUM.nodes;
    }
    
    if (curriculum.length > 0) {
      const generatedPlan = createLearningPlan(curriculum, learningGoal, hoursPerWeek);
      setPlan(generatedPlan);
    }
  };

  const createLearningPlan = (curriculum, goal, hours) => {
    const weeks = [];
    let currentHours = 0;
    let weekTopics = [];
    let weekNumber = 1;

    // Time allocation based on goal
    const timeMultiplier = {
      'mastery': 1.5,        // More time per topic
      'quick-learn': 0.8,    // Faster pace
      'exam-prep': 1.2       // Balanced with practice focus
    };

    const hoursPerTopic = {
      'beginner': 3 * timeMultiplier[goal],
      'intermediate': 4 * timeMultiplier[goal],
      'advanced': 5 * timeMultiplier[goal]
    };

    // Sort by level for logical progression
    const sortedCurriculum = [...curriculum].sort((a, b) => a.level - b.level);

    sortedCurriculum.forEach(topic => {
      const topicHours = hoursPerTopic[topic.difficulty] || 4;
      
      if (currentHours + topicHours > hours && weekTopics.length > 0) {
        // Start new week
        weeks.push({
          week: weekNumber,
          topics: weekTopics,
          totalHours: currentHours,
          focus: getDominantFocus(weekTopics)
        });
        weekTopics = [];
        currentHours = 0;
        weekNumber++;
      }

      weekTopics.push({
        ...topic,
        estimatedHours: topicHours,
        activities: getTopicActivities(topic, goal)
      });
      currentHours += topicHours;
    });

    // Add remaining topics
    if (weekTopics.length > 0) {
      weeks.push({
        week: weekNumber,
        topics: weekTopics,
        totalHours: currentHours,
        focus: getDominantFocus(weekTopics)
      });
    }

    return {
      totalWeeks: weeks.length,
      totalHours: weeks.reduce((sum, w) => sum + w.totalHours, 0),
      weeks,
      goal,
      subject
    };
  };

  const getDominantFocus = (topics) => {
    const domains = topics.map(t => t.domain);
    const counts = {};
    domains.forEach(d => counts[d] = (counts[d] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const getTopicActivities = (topic, goal) => {
    const baseActivities = [
      { type: 'video', name: 'Watch lectures', hours: 1, icon: Video },
      { type: 'reading', name: 'Read materials', hours: 0.5, icon: BookOpen },
      { type: 'practice', name: 'Practice exercises', hours: 1, icon: Brain },
      { type: 'quiz', name: 'Complete quiz', hours: 0.5, icon: Award }
    ];

    if (goal === 'mastery') {
      baseActivities.push(
        { type: 'project', name: 'Mini project', hours: 2, icon: Target }
      );
    } else if (goal === 'exam-prep') {
      baseActivities.push(
        { type: 'review', name: 'Review & MCQs', hours: 1, icon: CheckCircle }
      );
    }

    return baseActivities;
  };

  const getWeekStatus = (weekNum) => {
    if (weekNum < currentWeek) return 'completed';
    if (weekNum === currentWeek) return 'in-progress';
    return 'upcoming';
  };

  const getCompletionPercentage = () => {
    if (!plan) return 0;
    const totalTopics = plan.weeks.reduce((sum, w) => sum + w.topics.length, 0);
    return Math.round((completedTopics.size / totalTopics) * 100);
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Generating your learning plan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Your Learning Plan</h1>
          <p className="text-blue-100 text-lg mb-6">
            Personalized {plan.totalWeeks}-week journey to master {plan.subject}
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{plan.totalWeeks}</div>
              <div className="text-sm text-blue-100">Total Weeks</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{Math.round(plan.totalHours)}</div>
              <div className="text-sm text-blue-100">Total Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{getCompletionPercentage()}%</div>
              <div className="text-sm text-blue-100">Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">Week {currentWeek}</div>
              <div className="text-sm text-blue-100">Current Week</div>
            </div>
          </div>
        </div>

        {/* Goal Settings */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <label className="block text-sm font-medium mb-3">Learning Goal</label>
            <select
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
            >
              <option value="mastery">Deep Mastery</option>
              <option value="quick-learn">Quick Learning</option>
              <option value="exam-prep">Exam Preparation</option>
            </select>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <label className="block text-sm font-medium mb-3">Hours Per Week</label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              min="5"
              max="40"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
            />
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <label className="block text-sm font-medium mb-3">Start Date</label>
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Weekly Breakdown
          </h2>

          {plan.weeks.map((week) => {
            const status = getWeekStatus(week.week);
            const isExpanded = week.week === currentWeek;

            return (
              <div
                key={week.week}
                className={`bg-slate-800 rounded-xl overflow-hidden transition-all ${
                  status === 'in-progress' ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Week Header */}
                <div 
                  className={`p-6 cursor-pointer ${
                    status === 'completed' ? 'bg-green-500/10' : 
                    status === 'in-progress' ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setCurrentWeek(week.week)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-700'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{week.week}</span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">Week {week.week}</h3>
                        <p className="text-sm text-gray-400">
                          {week.focus} • {week.topics.length} topics • {Math.round(week.totalHours)}h
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {status === 'in-progress' && (
                        <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                          Current
                        </span>
                      )}
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Week Content */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-700">
                    <div className="space-y-6">
                      {week.topics.map((topic, index) => (
                        <div key={topic.id} className="bg-slate-900 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold mb-2">{topic.label}</h4>
                              <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {topic.estimatedHours}h
                                </span>
                                <span className="capitalize text-gray-500">
                                  {topic.difficulty}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Video className="w-4 h-4" />
                                  {topic.videos?.length || 0} videos
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (completedTopics.has(topic.id)) {
                                  setCompletedTopics(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(topic.id);
                                    return newSet;
                                  });
                                } else {
                                  setCompletedTopics(prev => new Set([...prev, topic.id]));
                                }
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                completedTopics.has(topic.id)
                                  ? 'bg-green-500 text-white'
                                  : 'bg-slate-700 hover:bg-slate-600'
                              }`}
                            >
                              {completedTopics.has(topic.id) ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Activities */}
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {topic.activities.map((activity, actIndex) => (
                              <div
                                key={actIndex}
                                className="bg-slate-800 p-3 rounded flex items-center gap-3"
                              >
                                <activity.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{activity.name}</div>
                                  <div className="text-xs text-gray-500">{activity.hours}h</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Week Summary */}
                    <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <div className="font-semibold mb-1">Week {week.week} Goal</div>
                          <div className="text-sm text-gray-400">
                            Complete all {week.topics.length} topics focusing on {week.focus}. 
                            Allocate approximately {Math.round(week.totalHours / week.topics.length)}h per topic.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Progress
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Completion</span>
              <span>{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{completedTopics.size}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {plan.weeks.reduce((sum, w) => sum + w.topics.length, 0) - completedTopics.size}
              </div>
              <div className="text-sm text-gray-400">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{currentWeek}</div>
              <div className="text-sm text-gray-400">Current Week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;
