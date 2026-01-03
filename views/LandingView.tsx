import React from 'react';
import { useAppStore } from '../store';
import { Wallet, ShieldCheck, Coins, Database, Image, Music, FileText, Video, ArrowRight } from 'lucide-react';

export const LandingView = () => {
    const { connectWallet } = useAppStore();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Background Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* PDF/Docs */}
                <div className="absolute top-[15%] left-[10%] text-slate-200 animate-float delay-1000">
                    <FileText size={64} strokeWidth={1} className="transform -rotate-12" />
                </div>
                {/* Audio */}
                <div className="absolute top-[25%] right-[15%] text-slate-200 animate-float delay-2000">
                    <Music size={56} strokeWidth={1} className="transform rotate-12" />
                </div>
                {/* Images */}
                <div className="absolute bottom-[20%] left-[20%] text-slate-200 animate-float delay-3000">
                    <Image size={80} strokeWidth={1} className="transform rotate-6" />
                </div>
                {/* Video/Media */}
                <div className="absolute bottom-[30%] right-[10%] text-slate-200 animate-float delay-4000">
                    <Video size={48} strokeWidth={1} className="transform -rotate-6" />
                </div>
                
                {/* Gradients */}
                <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                     <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-100/50 rounded-full blur-[120px]"></div>
                     <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px]"></div>
                </div>
            </div>

            {/* Nav */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-white text-lg">C</span>
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">Catch</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-10 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm text-slate-600 font-medium">Decentralized Data Bounties</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                        Turn your data into <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Solana Rewards</span>
                    </h1>
                    
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join the decentralized workforce. Complete specialized tasks like image verification, handwriting recognition, and sentiment analysis.
                    </p>

                    <button 
                        onClick={connectWallet}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-purple-600/20 flex items-center gap-3 mx-auto transform hover:scale-105"
                    >
                        <Wallet size={24} />
                        Connect Solana Wallet
                    </button>
                    
                    <p className="mt-4 text-xs text-slate-400">
                        Supports Phantom, Solflare, and other Solana wallets.
                    </p>
                </div>

                {/* How it Works - Dotted Arrow Guide */}
                <div className="w-full max-w-6xl mx-auto mb-20 relative">
                     {/* Decorative Arrow SVG */}
                    <svg className="hidden md:block absolute top-1/2 left-0 w-full h-20 -translate-y-1/2 pointer-events-none z-0" viewBox="0 0 1000 100" preserveAspectRatio="none">
                         <path d="M 100,50 Q 350,100 500,50 T 900,50" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />
                         <path d="M 890,45 L 900,50 L 890,55" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                    </svg>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center transform transition-transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-purple-50 mx-auto rounded-full flex items-center justify-center mb-4 text-purple-600 font-bold text-2xl border border-purple-100">1</div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Connect Wallet</h3>
                            <p className="text-slate-500 text-sm">Login with your Phantom or Solflare wallet.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center transform transition-transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-50 mx-auto rounded-full flex items-center justify-center mb-4 text-blue-600 font-bold text-2xl border border-blue-100">2</div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Choose a Bounty</h3>
                            <p className="text-slate-500 text-sm">Select a task: images, audio, or text validation.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center transform transition-transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-green-50 mx-auto rounded-full flex items-center justify-center mb-4 text-green-600 font-bold text-2xl border border-green-100">3</div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Get Paid</h3>
                            <p className="text-slate-500 text-sm">Valid submissions earn SOL instantly.</p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">Why Catch?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                                <Database size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Curated Tasks</h3>
                            <p className="text-slate-600">Diverse categories including AI training data, translation, and image labeling.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Community Validation</h3>
                            <p className="text-slate-600">Quality is ensured through a rigorous peer-review process and AI pre-validation.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                                <Coins size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Payouts</h3>
                            <p className="text-slate-600">Rewards are automatically distributed to your connected Solana wallet upon approval.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};