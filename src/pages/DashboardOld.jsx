import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { organizeContentByStyle } from '../api/varkUtils';
import { Star, BookOpen, Video, FileText, Headphones, PenTool, ExternalLink, Loader } from 'lucide-react';

const Dashboard = () => {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState(null);
  const [content, setContent] = useState({ recommended: [], others: [] });
  const [loading, setLoading] = useState(true);

  // Style-specific messages
  const styleMessages = {
    Visual: "We've prioritized videos and diagrams for you.",
    Aural: "We've prioritized audio lectures and discussions for you.",
    ReadWrite: "We've prioritized text-based resources and reading materials for you.",
    Kinesthetic: "We've prioritized hands-on exercises and quizzes for you.",
    Multimodal: "We've included a mix of all learning formats for you."
  };

  // Type icons mapping
  const typeIcons = {
    video: Video,
    diagram: FileText,
    audio: Headphones,
    text: BookOpen,
    pdf: FileText,
    quiz: PenTool,
    exercise: PenTool
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const profileRes = await fetch('http://localhost:3000/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        setUser(profileData);

        // Fetch all content
        const contentRes = await fetch('http://localhost:3000/api/user/content');
        const contentData = await contentRes.json();

        // Organize content by learning style
        const organized = organizeContentByStyle(contentData.content, profileData.learningStyle);
        setContent(organized);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome, {user?.name}! 👋
          </h1>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold">
                Your Learning Style: {user?.learningStyle || 'Not Set'} 🧠
              </span>
            </div>
          </div>
          <p className="text-white/90 text-lg">
            {styleMessages[user?.learningStyle] || "Take the VARK test to get personalized recommendations."}
          </p>
        </div>

        {/* Recommended Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Recommended for You</h2>
          </div>
          
          {content.recommended.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.recommended.map((item) => {
                const Icon = typeIcons[item.type] || BookOpen;
                return (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 border-yellow-500/50 shadow-lg hover:shadow-yellow-500/20 transition-all hover:scale-105 relative"
                  >
                    {/* Star Badge */}
                    <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-2">
                      <Star className="w-5 h-5 text-white fill-white" />
                    </div>

                    {/* Content */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-blue-500/20 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium mb-2">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    
                    {item.course_name && (
                      <p className="text-gray-500 text-xs mb-4">📚 {item.course_name}</p>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Access Resource
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-8 text-center">
              <p className="text-gray-400">No personalized recommendations available yet. Complete the VARK test to get started!</p>
            </div>
          )}
        </div>

        {/* Other Resources Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Other Resources</h2>
          
          {content.others.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.others.map((item) => {
                const Icon = typeIcons[item.type] || BookOpen;
                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all opacity-75 hover:opacity-100"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500 text-xs font-medium uppercase">{item.type}</span>
                    </div>
                    <h3 className="text-white font-medium mb-2 text-sm">{item.title}</h3>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 text-xs flex items-center gap-1"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No additional resources available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
