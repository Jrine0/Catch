import React, { useState, useRef } from 'react';
import { Bounty, Submission } from '../types';
import { useAppStore } from '../store';
import { validateBatchWithGemini, fileToBase64 } from '../services/geminiService';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Loader2, Sparkles, X, Files } from 'lucide-react';

interface DetailsViewProps {
    bounty: Bounty;
    onBack: () => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ bounty, onBack }) => {
    const { user, addSubmission } = useAppStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [files, setFiles] = useState<File[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<{ passed: boolean; avgScore: number; feedback: string } | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
            setAiResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (files.length === 0) return;
        setIsAnalyzing(true);
        
        // This validates 3 random files from the batch
        const result = await validateBatchWithGemini(files, bounty);
        
        setAiResult(result);
        setIsAnalyzing(false);
    };

    const handleSubmit = async () => {
        if (files.length === 0 || !user || !aiResult || !aiResult.passed) return;

        // Create a preview from the first file for the UI
        let preview = "Batch Data";
        if (files[0].type.startsWith('image/')) {
            const base64 = await fileToBase64(files[0]);
            preview = `data:${files[0].type};base64,${base64}`;
        } else {
            preview = await files[0].text();
            preview = preview.substring(0, 500) + "...";
        }

        const newSubmission: Submission = {
            id: crypto.randomUUID(),
            bountyId: bounty.id,
            contributor: user.address,
            dataPreview: preview,
            dataType: files[0].type.startsWith('image/') ? 'image' : 'text',
            status: 'pending', // Sent to Mongo, pending validation game
            aiScore: aiResult.avgScore,
            aiFeedback: `Batch of ${files.length} files. ` + aiResult.feedback,
            communityVotes: [],
            timestamp: Date.now()
        };

        addSubmission(newSubmission);
        setUploadSuccess(true);
        
        setTimeout(() => {
            setUploadSuccess(false);
            setFiles([]);
            setAiResult(null);
        }, 3000);
    };

    const resetUpload = () => {
        setFiles([]);
        setAiResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const progress = Math.min(100, (bounty.currentCount / bounty.requiredCount) * 100);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-purple-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Bounties
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Bounty Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 sm:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                                <span className="inline-block bg-purple-50 text-purple-600 text-xs font-semibold px-2.5 py-0.5 rounded border border-purple-100 mb-3">
                                    {bounty.category}
                                </span>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{bounty.title}</h1>
                                <p className="text-slate-500">Created by: {bounty.creator.slice(0, 6)}...{bounty.creator.slice(-4)}</p>
                            </div>
                            <div className="text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-sm text-slate-500 mb-1">Reward Pool</p>
                                <p className="text-3xl font-bold text-purple-600">{bounty.rewardPool} SOL</p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none mb-8">
                            <h3 className="text-lg font-medium text-slate-900 mb-2">Description</h3>
                            <p className="text-slate-600 leading-relaxed">{bounty.description}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Dataset Progress</span>
                                <span>{bounty.currentCount.toLocaleString()} / {bounty.requiredCount.toLocaleString()} collected</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap gap-2">
                            {bounty.tags.map(tag => (
                                <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Contribution Panel */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Contribute Batch</h2>
                        
                        {!user ? (
                            <div className="text-center py-8 px-4 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                                <AlertCircle className="mx-auto text-slate-400 mb-3" size={32} />
                                <p className="text-slate-500 text-sm mb-4">Connect your wallet to start contributing and earning rewards.</p>
                            </div>
                        ) : uploadSuccess ? (
                            <div className="text-center py-12 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                                <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
                                <h3 className="text-xl font-bold text-green-600">Sent to MongoDB!</h3>
                                <p className="text-green-700 text-sm">Your batch is pending gamified validation.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {files.length === 0 ? (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100"
                                    >
                                        <Upload className="mx-auto text-slate-400 mb-3" size={32} />
                                        <p className="text-slate-700 font-medium">Click to upload {bounty.category}</p>
                                        <p className="text-slate-500 text-xs mt-1">Select multiple files (e.g., 100 images)</p>
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            multiple
                                            className="hidden" 
                                            onChange={handleFileSelect}
                                            accept={bounty.category === 'Image Label Verification' ? 'image/*' : '*'}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                                    <Files size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{files.length} Files Selected</p>
                                                    <p className="text-xs text-slate-500">
                                                        {(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={resetUpload}
                                                    className="ml-auto bg-white hover:bg-slate-100 text-slate-400 p-2 rounded-lg border border-slate-200 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {!aiResult ? (
                                            <button 
                                                onClick={handleAnalyze}
                                                disabled={isAnalyzing}
                                                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                {isAnalyzing ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={20} />
                                                        Analyzing Random Samples (3)...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={18} />
                                                        Run AI Pre-Check
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="animate-fade-in space-y-4">
                                                <div className={`p-4 rounded-lg border ${aiResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {aiResult.passed ? (
                                                            <CheckCircle className="text-green-500" size={20} />
                                                        ) : (
                                                            <AlertCircle className="text-red-500" size={20} />
                                                        )}
                                                        <span className={`font-bold ${aiResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                            {aiResult.passed ? 'Batch Check Passed' : 'Batch Check Failed'}
                                                        </span>
                                                        <span className="ml-auto text-xs font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                                                            Avg Score: {aiResult.avgScore}/100
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">{aiResult.feedback}</p>
                                                </div>

                                                <button 
                                                    onClick={handleSubmit}
                                                    disabled={!aiResult.passed}
                                                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg font-medium transition-all shadow-sm"
                                                >
                                                    Submit Batch to MongoDB
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};