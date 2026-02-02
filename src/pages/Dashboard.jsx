import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/service';
import { organizeContentByStyle, STYLE_BADGES, getExplanationLabel } from '../api/varkUtils';
import { BookOpen, Award, Star, ExternalLink, Filter, Eye, Ear, FileText, Hand, Sparkles, TrendingUp, Home, ArrowLeft } from 'lucide-react';
import SmartStudyTip from '../components/SmartStudyTip';
import ProgressTracker from '../components/ProgressTracker';
import InsightsPanel from '../components/InsightsPanel';
import GeneralDiscussionForum from '../components/GeneralDiscussionForum';
// Import curriculum data
import { DS_CURRICULUM } from '../data/dataStructuresCurriculum';
import { OS_CURRICULUM } from '../data/operatingSystemsCurriculum';
import { DBMS_CURRICULUM } from '../data/databaseSystemsCurriculum';
import { CN_CURRICULUM } from '../data/computerNetworksCurriculum';


export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [contentBySubject, setContentBySubject] = useState({});
  const [selectedLearningStyle, setSelectedLearningStyle] = useState(null);
  const [loading, setLoading] = useState(true);

  const learningStyles = ['Visual', 'Aural', 'ReadWrite', 'Kinesthetic'];
  const subjectMapping = {
    'data-structures': { key: 'DSA', label: 'Data Structures & Algorithms', color: 'from-blue-500 to-cyan-500' },
    'operating-systems': { key: 'OS', label: 'Operating Systems', color: 'from-green-500 to-emerald-500' },
    'database-systems': { key: 'DBMS', label: 'Database Systems', color: 'from-purple-500 to-pink-500' },
    'computer-networks': { key: 'CN', label: 'Computer Networks', color: 'from-orange-500 to-red-500' }
  };

  const learningStyleInfo = {
    'Visual': {
      icon: Eye,
      description: 'Learn best through diagrams, charts, and visual aids',
      color: 'purple',
      selectedClass: 'border-purple-500 bg-purple-50',
      iconClass: 'text-purple-600',
      message: "We've prioritized videos and diagrams for you."
    },
    'Aural': {
      icon: Ear,
      description: 'Learn best through listening and discussion',
      color: 'blue',
      selectedClass: 'border-blue-500 bg-blue-50',
      iconClass: 'text-blue-600',
      message: "We've prioritized audio lectures and discussions for you."
    },
    'ReadWrite': {
      icon: FileText,
      description: 'Learn best through reading and writing',
      color: 'green',
      selectedClass: 'border-green-500 bg-green-50',
      iconClass: 'text-green-600',
      message: "We've prioritized text-based resources and reading materials for you."
    },
    'Kinesthetic': {
      icon: Hand,
      description: 'Learn best through hands-on practice',
      color: 'orange',
      selectedClass: 'border-orange-500 bg-orange-50',
      iconClass: 'text-orange-600',
      message: "We've prioritized hands-on exercises and interactive content for you."
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user profile using /auth/me endpoint
        const profileRes = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!profileRes.ok) {
          console.error('Failed to fetch profile');
          setLoading(false);
          return;
        }
        
        const profileData = await profileRes.json();
        const userProfile = profileData.user;
        console.log('🔍 Dashboard - User Profile Loaded:', {
          userId: userProfile.id,
          userName: userProfile.name,
          userEmail: userProfile.email,
          learningStyle: userProfile.learningStyle
        });
        setProfile(userProfile);
        
        // Map single-letter VARK codes to full names for display
        const styleMapping = {
          'V': 'Visual',
          'A': 'Aural',
          'R': 'ReadWrite',
          'K': 'Kinesthetic',
          'Visual': 'Visual',
          'Aural': 'Aural',
          'ReadWrite': 'ReadWrite',
          'Kinesthetic': 'Kinesthetic'
        };
        const mappedStyle = userProfile.learningStyle ? styleMapping[userProfile.learningStyle] || userProfile.learningStyle : null;
        setSelectedLearningStyle(mappedStyle);
        console.log('✅ Dashboard - Learning Style Set:', mappedStyle);

        // Load content from local curriculum files
        const curriculumData = [
          { curriculum: DS_CURRICULUM, course: 'data-structures' },
          { curriculum: OS_CURRICULUM, course: 'operating-systems' },
          { curriculum: DBMS_CURRICULUM, course: 'database-systems' },
          { curriculum: CN_CURRICULUM, course: 'computer-networks' }
        ];

        const allContentItems = [];
        const grouped = {};

        curriculumData.forEach(({ curriculum, course }) => {
          if (curriculum && curriculum.nodes) {
            curriculum.nodes.forEach(node => {
              // Extract videos as content items
              if (node.videos) {
                node.videos.forEach(video => {
                  const item = {
                    id: `${node.id}-video-${video.title}`,
                    title: video.title,
                    type: 'video',
                    url: video.url,
                    course,
                    topic: node.label,
                    duration: video.duration
                  };
                  allContentItems.push(item);
                  if (!grouped[course]) grouped[course] = [];
                  grouped[course].push(item);
                });
              }
              // Add topic as a reading item
              const readingItem = {
                id: `${node.id}-reading`,
                title: node.label,
                type: 'reading',
                description: node.description,
                course,
                topics: node.topics
              };
              allContentItems.push(readingItem);
              if (!grouped[course]) grouped[course] = [];
              grouped[course].push(readingItem);
            });
          }
        });

        setAllContent(allContentItems);
        setContentBySubject(grouped);

        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading your personalized dashboard...</div>
      </div>
    );
  }

  /**
   * renderContentCard - Renders a content item with VARK-aware styling
   *
   * EXAMINER NOTES:
   * - Recommended items get ⭐ badge and "{Style} Friendly" label
   * - All content remains accessible (not locked)
   * - Visual distinction helps users identify their preferred content type
   */
  const renderContentCard = (item, isRecommended) => {
    // Get style-specific badge info
    const badge = isRecommended && selectedLearningStyle ? STYLE_BADGES[selectedLearningStyle] : null;

    return (
      <a
        key={item.id}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block rounded-xl p-5 transition-all ${isRecommended
          ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 hover:scale-105 hover:shadow-xl shadow-lg'
          : 'border border-slate-300 bg-white hover:border-slate-400 hover:shadow-md'
          }`}
      >
        {/* ⭐ Star Badge for Recommended Items */}
        {isRecommended && (
          <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-2 shadow-lg">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        )}

        {/* Title */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-lg flex-1 ${isRecommended ? 'text-slate-900' : 'text-slate-800'}`}>
            {item.title}
          </h3>
        </div>

        {/* Style-Friendly Badge - Shows "{Style} Friendly" label */}
        {isRecommended && badge && (
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full
              ${selectedLearningStyle === 'Visual' ? 'bg-purple-100 text-purple-700' :
                selectedLearningStyle === 'Aural' || selectedLearningStyle === 'Auditory' ? 'bg-blue-100 text-blue-700' :
                  selectedLearningStyle === 'ReadWrite' ? 'bg-green-100 text-green-700' :
                    selectedLearningStyle === 'Kinesthetic' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
              }`}>
              {badge.emoji} {badge.label}
            </span>
          </div>
        )}

        {/* Description */}
        <p className={`text-sm mb-4 ${isRecommended ? 'text-slate-700' : 'text-slate-600'}`}>
          {item.description}
        </p>

        {/* Footer with Type Badge and Open Link */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${isRecommended
            ? 'bg-yellow-200 text-yellow-900'
            : 'bg-slate-200 text-slate-700'
            }`}>
            {item.type}
          </span>
          <div className="flex items-center gap-1 text-blue-600 font-medium text-sm">
            <span>Open</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>

        {/* Explanation tooltip - why this is recommended (visible on hover) */}
        {isRecommended && item.type && (
          <div className="mt-3 pt-3 border-t border-yellow-200">
            <p className="text-xs text-amber-700 italic">
              ⭐ Recommended for {selectedLearningStyle} learners - {item.type} content
            </p>
          </div>
        )}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back to Home Button */}
          <a
            href="/"
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>

          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Learner'}!</h1>
          <p className="text-blue-100 mb-4">Your personalized learning dashboard</p>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <span className="text-lg font-medium">Your Learning Style:</span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full font-semibold">
              {selectedLearningStyle || profile?.learningStyle || 'Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* Learning Style Selector */}
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {!selectedLearningStyle && !profile?.learningStyle && (
            <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400 rounded-full p-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Take the VARK Test to Get Personalized Recommendations!
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Discover your learning style and get content recommendations tailored specifically for you.
                    It only takes 2 minutes!
                  </p>
                  <a
                    href="/vark-questionnaire"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Take VARK Test Now →
                  </a>
                </div>
              </div>
            </div>
          )}
          {profile?.learningStyle && selectedLearningStyle && learningStyleInfo[selectedLearningStyle] && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-5 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-full p-2">
                  {React.createElement(learningStyleInfo[selectedLearningStyle].icon, { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Your {selectedLearningStyle} Learning Style
                  </h3>
                  <p className="text-slate-700 font-medium">
                    📚 {learningStyleInfo[selectedLearningStyle].message}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    {learningStyleInfo[selectedLearningStyle].description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Organized by Subject */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {Object.keys(contentBySubject).length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-700 mb-3">No Learning Content Available</h3>
                <p className="text-slate-500 mb-2">Content recommendations will appear here once they are added to the system.</p>
                <p className="text-sm text-slate-400">Contact your administrator to add learning resources.</p>
              </div>
            ) : (
              Object.entries(contentBySubject).map(([course, items]) => {
                const subjectInfo = subjectMapping[course];
                if (!subjectInfo) return null;

                // Organize content by selected learning style
                const { recommended, others } = organizeContentByStyle(items, selectedLearningStyle);
                console.log(`📚 ${subjectInfo.label} - Recommendations for ${selectedLearningStyle}:`, {
                  total: items.length,
                  recommended: recommended.length,
                  others: others.length,
                  recommendedTitles: recommended.map(r => r.title)
                });

                return (
                  <section key={course} className="mb-12">
                    {/* Subject Header */}
                    <div className={`bg-gradient-to-r ${subjectInfo.color} text-white rounded-lg p-6 mb-6`}>
                      <h2 className="text-2xl font-bold mb-1">{subjectInfo.label}</h2>
                      <p className="text-white/90 text-sm">
                        {recommended.length} recommended • {others.length} other resources
                      </p>
                    </div>

                    {/* Smart Study Tip - Module 5: VARK-Aware Feedback */}
                    <SmartStudyTip userStyle={selectedLearningStyle} />

                    {/* Recommended Resources */}
                    {recommended.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          Recommended for {selectedLearningStyle} Learners
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {recommended.map(item => renderContentCard(item, true))}
                        </div>
                      </div>
                    )}

                    {/* Other Resources */}
                    {others.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-slate-500" />
                          Other Resources
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {others.map(item => renderContentCard(item, false))}
                        </div>
                      </div>
                    )}

                    {recommended.length === 0 && others.length === 0 && (
                      <p className="text-slate-500 italic">No content available for this subject yet.</p>
                    )}
                  </section>
                );
              })
            )}
          </div>

          {/* Sidebar - Progress Tracker */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <ProgressTracker />

              {/* Quick Tips Card */}
              <div className="mt-6">
                <SmartStudyTip userStyle={selectedLearningStyle} variant="compact" />
              </div>

              {/* Insights Panel - Improvement Recommendations */}
              <div className="mt-6">
                <InsightsPanel />
              </div>

              {/* VARK Explainer Card */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  How Recommendations Work
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Content is prioritized using a <strong>rule-based system</strong> based on your VARK learning style:
                </p>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>👁️ <strong>Visual:</strong> Videos, diagrams</li>
                  <li>👂 <strong>Auditory:</strong> Audio, discussions</li>
                  <li>📖 <strong>Read/Write:</strong> Text, PDFs</li>
                  <li>🖐️ <strong>Kinesthetic:</strong> Quizzes, exercises</li>
                </ul>
                <p className="text-xs text-slate-400 mt-3 italic">
                  ℹ️ No AI/ML - transparent, deterministic rules
                </p>
              </div>

              {/* General Discussion Forum */}
              <div className="mt-6 h-96">
                <GeneralDiscussionForum />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}