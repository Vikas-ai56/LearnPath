import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, MessageSquare } from 'lucide-react';

// Seed discussion data - simulated posts from the community
const SEED_DISCUSSIONS = [
  {
    id: 1,
    author: 'Vikas',
    message: 'Just completed the Operating Systems module! The process management section really clicked when I watched the CPU scheduling algorithms video. Highly recommend starting with that if you\'re stuck.',
    timestamp: '2 hours ago',
    avatar: 'V'
  },
  {
    id: 2,
    author: 'Kartik',
    message: 'Has anyone found a good strategy for remembering all the different scheduling algorithms? I keep confusing SJF with SRTF. Any mnemonics or study tips?',
    timestamp: '3 hours ago',
    avatar: 'K'
  },
  {
    id: 3,
    author: 'John Doe',
    message: 'The Data Structures course is excellent! I liked how the knowledge graph shows prerequisites. Makes it clear what to study next. Would love to see this for all subjects.',
    timestamp: '5 hours ago',
    avatar: 'J'
  },
  {
    id: 4,
    author: 'Vikas',
    message: 'For exam prep, I\'m focusing on the practice quizzes. The adaptive difficulty is really helpful - starts easy and ramps up. Feels like real exam conditions.',
    timestamp: '1 day ago',
    avatar: 'V'
  },
  {
    id: 5,
    author: 'Kartik',
    message: 'Anyone else struggling with the networking protocols? TCP/IP is confusing me. The layers seem to overlap. Should I study them separately or as a system?',
    timestamp: '1 day ago',
    avatar: 'K'
  },
  {
    id: 6,
    author: 'John Doe',
    message: 'The lesson planner is a game-changer! I set mine to "Deep Mastery" mode and it\'s breaking down each topic perfectly. Already seeing improvement in my understanding.',
    timestamp: '2 days ago',
    avatar: 'J'
  }
];

const GeneralDiscussionForum = () => {
  const [posts, setPosts] = useState(SEED_DISCUSSIONS);
  const [newMessage, setNewMessage] = useState('');
  const [userNames] = useState(['Vikas', 'Kartik', 'John Doe']);
  const messagesEndRef = useRef(null);

  // Auto-scroll to newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  // Generate relative time format
  const getRelativeTime = () => {
    const now = new Date();
    return 'now';
  };

  // Handle new post submission
  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const newPost = {
      id: posts.length + 1,
      author: 'You',
      message: newMessage,
      timestamp: 'now',
      avatar: 'Y'
    };

    setPosts([...posts, newPost]);
    setNewMessage('');
  };

  // Get avatar background color based on initials
  const getAvatarColor = (initial) => {
    const colors = {
      'V': 'bg-blue-500',
      'K': 'bg-purple-500',
      'J': 'bg-green-500',
      'Y': 'bg-cyan-500'
    };
    return colors[initial] || 'bg-slate-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Community Discussion</h3>
              <p className="text-xs text-slate-500">(Demo - Posts Not Saved)</p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {posts.length} posts
          </span>
        </div>
      </div>

      {/* Messages Feed - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-3 pb-4 border-b border-slate-100 last:border-b-0">
            {/* Avatar */}
            <div className={`${getAvatarColor(post.avatar)} rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-white font-bold text-sm">{post.avatar}</span>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-slate-900 text-sm">{post.author}</span>
                <span className="text-xs text-slate-500">{post.timestamp}</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed break-words">
                {post.message}
              </p>
            </div>
          </div>
        ))}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <form onSubmit={handlePostSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your learning insights..."
            className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all text-sm ${
              newMessage.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </form>
        <p className="text-xs text-slate-500 mt-2">💡 Share study strategies, ask questions, or provide feedback about the platform.</p>
      </div>
    </div>
  );
};

export default GeneralDiscussionForum;
