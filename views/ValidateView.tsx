import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Check, X, AlertOctagon, Trophy, ShieldCheck, ChevronRight } from 'lucide-react';

export const ValidateView = () => {
    const { user, submissions, bounties, voteOnSubmission, finalizeSubmission } = useAppStore();
    const [viewMode, setViewMode] = useState<'community' | 'owner'>('community');

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                    <ShieldCheck className="text-slate-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h2>
                <p className="text-slate-500 max-w-md">Connect your wallet to start the validation game and earn rewards.</p>
            </div>
        );
    }

    // 1. Filter for Community Validation (The Game)
    // Logic: Pending status, NOT my own submission, NOT already voted by me
    const communityQueue = submissions.filter(s => 
        s.status === 'pending' && 
        s.contributor !== user.address && 
        !s.communityVotes?.some(v => v.validator === user.address)
    );

    // 2. Filter for Owner Approval (Finalizing)
    // Logic: Pending status, belongs to a Bounty I created
    const myBountyIds = bounties.filter(b => b.creator === user.address).map(b => b.id);
    const ownerQueue = submissions.filter(s => 
        s.status === 'pending' && 
        myBountyIds.includes(s.bountyId)
    );

    // Get the current item for the game interface
    const currentItem = communityQueue[0];
    const currentBounty = currentItem ? bounties.find(b => b.id === currentItem.bountyId) : null;

    const dailyProgress = Math.min(100, (user.dailyValidationCount / 50) * 100);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            
            {/* Header / Gamification Stats */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            Validation Station
                        </h1>
                        <p className="text-slate-500">Ensure data quality and earn reputation.</p>
                    </div>
                    
                    <div className="w-full md:w-auto flex-1 max-w-md">
                        <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-slate-700">Daily Goal</span>
                            <span className="text-purple-600">{user.dailyValidationCount} / 50 Verified</span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 relative"
                                style={{ width: `${dailyProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        {user.dailyValidationCount >= 50 && (
                            <p className="text-xs text-green-600 mt-1 font-bold flex items-center gap-1 justify-end">
                                <Trophy size={12} /> Goal Reached!
                            </p>
                        )}
                    </div>
                </div>

                {/* Mode Switcher (Only if user is also a creator) */}
                {myBountyIds.length > 0 && (
                    <div className="flex gap-4 mt-6 border-t border-slate-100 pt-4">
                        <button 
                            onClick={() => setViewMode('community')}
                            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'community' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            Community Verify ({communityQueue.length})
                        </button>
                        <button 
                            onClick={() => setViewMode('owner')}
                            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'owner' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            Final Approvals ({ownerQueue.length})
                        </button>
                    </div>
                )}
            </div>

            {/* --- GAME INTERFACE (Community) --- */}
            {viewMode === 'community' && (
                <div className="max-w-3xl mx-auto">
                    {currentItem && currentBounty ? (
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg animate-fade-in relative">
                            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 rounded-full border border-white/10">
                                {currentBounty.category}
                            </div>
                            
                            {/* Content Display */}
                            <div className="bg-slate-100 h-[400px] flex items-center justify-center relative">
                                {currentItem.dataType === 'image' ? (
                                    <img src={currentItem.dataPreview} alt="Validation Item" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="p-8 text-slate-800 font-medium text-lg overflow-y-auto h-full w-full">
                                        {currentItem.dataPreview}
                                    </div>
                                )}
                                
                                {/* AI Hint Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Request</span>
                                        <span className={`text-xs font-bold ${currentItem.aiScore && currentItem.aiScore > 70 ? 'text-green-600' : 'text-orange-500'}`}>
                                            AI Confidence: {currentItem.aiScore}%
                                        </span>
                                    </div>
                                    <p className="text-slate-900 font-medium">{currentBounty.description}</p>
                                    {currentItem.aiFeedback && (
                                        <p className="text-xs text-slate-500 mt-1 italic">AI Note: {currentItem.aiFeedback}</p>
                                    )}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="p-6 grid grid-cols-2 gap-4 bg-white">
                                <button 
                                    onClick={() => voteOnSubmission(currentItem.id, 'invalid')}
                                    className="py-4 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all flex flex-col items-center gap-1 group"
                                >
                                    <X className="group-hover:scale-110 transition-transform" />
                                    <span>Does Not Match</span>
                                </button>
                                <button 
                                    onClick={() => voteOnSubmission(currentItem.id, 'valid')}
                                    className="py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex flex-col items-center gap-1 group"
                                >
                                    <Check className="group-hover:scale-110 transition-transform" />
                                    <span>Matches Goal</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trophy className="text-green-500" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Queue Empty!</h2>
                            <p className="text-slate-500">You've verified everything available. Great job!</p>
                            <p className="text-sm text-slate-400 mt-4">Check back later for more bounties.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- OWNER APPROVAL INTERFACE --- */}
            {viewMode === 'owner' && (
                <div className="space-y-4">
                    {ownerQueue.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl">
                            <p className="text-slate-500">No pending submissions for your bounties.</p>
                        </div>
                    ) : (
                        ownerQueue.map(item => {
                            const relatedBounty = bounties.find(b => b.id === item.bountyId);
                            // Calculate community consensus
                            const validVotes = item.communityVotes?.filter(v => v.verdict === 'valid').length || 0;
                            const totalVotes = item.communityVotes?.length || 0;
                            const consensus = totalVotes > 0 ? Math.round((validVotes / totalVotes) * 100) : 0;

                            return (
                                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="w-full md:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                         {item.dataType === 'image' ? (
                                            <img src={item.dataPreview} alt="Sub" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="p-2 text-xs overflow-hidden h-full">{item.dataPreview}</div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{relatedBounty?.title}</h4>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <ShieldCheck size={14} /> 
                                                Community Score: <span className={consensus > 70 ? 'text-green-600 font-bold' : 'text-orange-500 font-bold'}>{consensus}%</span>
                                            </span>
                                            <span>({totalVotes} votes)</span>
                                        </div>
                                        {item.aiFeedback && (
                                            <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded">AI: {item.aiFeedback}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={() => finalizeSubmission(item.id, 'rejected')}
                                            className="flex-1 md:flex-none px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => finalizeSubmission(item.id, 'accepted')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                                        >
                                            Approve & Pay
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

        </div>
    );
};
