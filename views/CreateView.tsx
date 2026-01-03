import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Bounty, BountyCategory } from '../types';
import { PlusCircle, Info, Loader2 } from 'lucide-react';

const CATEGORIES: BountyCategory[] = [
    'Image Label Verification',
    'Handwriting Recognition',
    'Translation',
    'Translation Validation',
    'Sentiment Evaluation',
    'Audio Validation',
    'Audio Donation',
    'Image Capture',
    'Smart Camera',
    'Food Tasks',
    'Image Caption',
    'Semantic Similarity',
    'Glide Type',
    'Other'
];

export const CreateView = ({ onComplete }: { onComplete: () => void }) => {
    const { user, addBounty } = useAppStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Image Label Verification' as BountyCategory,
        rewardPool: '',
        requiredCount: '',
        tags: ''
    });

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call to DB
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newBounty: Bounty = {
            id: crypto.randomUUID(),
            creator: user.address, // Link to current user
            title: formData.title,
            description: formData.description,
            category: formData.category,
            rewardPool: Number(formData.rewardPool),
            requiredCount: Number(formData.requiredCount),
            currentCount: 0,
            status: 'active',
            createdAt: Date.now(),
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        addBounty(newBounty);
        setIsSubmitting(false);
        onComplete();
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Bounty</h1>
                <p className="text-slate-500">Request a specific dataset and set your budget.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Bounty Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            placeholder="e.g., Verify Stop Signs"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea 
                            required
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            placeholder="Describe specific requirements for the data..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                        <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value as BountyCategory})}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Required Quantity</label>
                        <input 
                            required
                            type="number" 
                            min="1"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            placeholder="e.g., 1000"
                            value={formData.requiredCount}
                            onChange={e => setFormData({...formData, requiredCount: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Reward Pool (SOL)</label>
                        <input 
                            required
                            type="number" 
                            min="0.1"
                            step="0.1"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            placeholder="e.g., 50"
                            value={formData.rewardPool}
                            onChange={e => setFormData({...formData, rewardPool: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma separated)</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            placeholder="e.g., urban, validation, street"
                            value={formData.tags}
                            onChange={e => setFormData({...formData, tags: e.target.value})}
                        />
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
                    <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-blue-700">
                        Funds will be held in a smart contract escrow. Contributors are paid proportionally based on valid submissions (Approved by community & you).
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating...
                            </>
                        ) : (
                            <>
                                <PlusCircle size={20} />
                                Create Bounty
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
