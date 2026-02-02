import React, { useState, useEffect } from 'react';
import { X, Trophy, Star, User } from 'lucide-react';
import { API_BASE_URL } from '../api/service';

const Leaderboard = ({ isOpen, onClose }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchLeaderboard();
        }
    }, [isOpen]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/auth/leaderboard`);
            const data = await response.json();
            setLeaderboard(data.leaderboard || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-700 shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-white" />
                        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-gray-400 mt-4">Loading leaderboard...</p>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No users on the leaderboard yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((user, index) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${index === 0
                                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500'
                                            : index === 1
                                                ? 'bg-slate-700/50 border-2 border-gray-400'
                                                : index === 2
                                                    ? 'bg-slate-700/50 border-2 border-orange-700'
                                                    : 'bg-slate-700/30 border border-slate-600'
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                        {index === 0 ? (
                                            <div className="text-3xl">🥇</div>
                                        ) : index === 1 ? (
                                            <div className="text-3xl">🥈</div>
                                        ) : index === 2 ? (
                                            <div className="text-3xl">🥉</div>
                                        ) : (
                                            <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1">
                                        <p className="font-semibold text-white text-lg">{user.name}</p>
                                    </div>

                                    {/* XP */}
                                    <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full">
                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-yellow-400 font-bold text-lg">{user.xp}</span>
                                        <span className="text-yellow-400/70 text-sm">XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
