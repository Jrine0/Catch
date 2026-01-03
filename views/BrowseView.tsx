import React, { useState } from 'react';
import { BountyCard } from '../components/BountyCard';
import { useAppStore } from '../store';
import { Bounty, BountyCategory } from '../types';
import { Search, Filter } from 'lucide-react';

interface BrowseViewProps {
    onSelectBounty: (bounty: Bounty) => void;
}

const FEATURED_CATEGORIES: BountyCategory[] = [
    'Image Label Verification', 
    'Handwriting Recognition', 
    'Sentiment Evaluation', 
    'Food Tasks'
];

export const BrowseView: React.FC<BrowseViewProps> = ({ onSelectBounty }) => {
    const { bounties } = useAppStore();
    const [filter, setFilter] = useState<BountyCategory | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBounties = bounties.filter(b => {
        const matchesCategory = filter === 'All' || b.category === filter;
        const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              b.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore Bounties</h1>
                    <p className="text-slate-500">Contribute data to open datasets and earn crypto.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search bounties..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-900 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 w-full sm:w-64 shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                        <button 
                            onClick={() => setFilter('All')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shadow-sm border ${filter === 'All' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            All
                        </button>
                        {FEATURED_CATEGORIES.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shadow-sm border ${filter === cat ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                {cat.split(' ')[0]}...
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBounties.map(bounty => (
                    <BountyCard 
                        key={bounty.id} 
                        bounty={bounty} 
                        onClick={() => onSelectBounty(bounty)} 
                    />
                ))}
            </div>

            {filteredBounties.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <Filter className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700">No bounties found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
};