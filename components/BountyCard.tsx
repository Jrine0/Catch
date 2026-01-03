import React from 'react';
import { Bounty } from '../types';
import { Database, Image, Type, PenTool, Mic, Camera, Utensils, SearchCheck } from 'lucide-react';

const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
        case 'Image Label Verification': 
        case 'Image Capture':
        case 'Smart Camera':
        case 'Image Caption':
            return <Image size={20} className="text-blue-500" />;
        
        case 'Handwriting Recognition': 
            return <PenTool size={20} className="text-yellow-500" />;
        
        case 'Translation': 
        case 'Translation Validation':
        case 'Sentiment Evaluation':
        case 'Semantic Similarity':
            return <Type size={20} className="text-green-500" />;
        
        case 'Audio Validation': 
        case 'Audio Donation':
            return <Mic size={20} className="text-pink-500" />;

        case 'Food Tasks':
            return <Utensils size={20} className="text-orange-500" />;
            
        case 'Glide Type':
            return <Database size={20} className="text-purple-500" />;

        default: return <SearchCheck size={20} className="text-slate-400" />;
    }
};

interface BountyCardProps {
    bounty: Bounty;
    onClick: () => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({ bounty, onClick }) => {
    const progress = Math.min(100, (bounty.currentCount / bounty.requiredCount) * 100);

    return (
        <div 
            onClick={onClick}
            className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl p-5 cursor-pointer transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 max-w-[70%]">
                    <div className="shrink-0">
                        <CategoryIcon category={bounty.category} />
                    </div>
                    <span className="text-xs font-medium text-slate-600 truncate">{bounty.category}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-purple-600 font-bold text-lg">{bounty.rewardPool} SOL</span>
                    <span className="text-xs text-slate-500">Total Pool</span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">{bounty.title}</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{bounty.description}</p>

            <div className="mt-auto">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{bounty.currentCount.toLocaleString()} / {bounty.requiredCount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
                {bounty.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100 px-2 py-1 rounded-sm">
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
};