import React from 'react';
import { Github, Twitter } from 'lucide-react';

interface FooterProps {
    setView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
    return (
        <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-white text-lg">C</span>
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">Catch</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            A decentralized platform gamifying data collection and validation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><button onClick={() => setView('browse')} className="hover:text-purple-600 transition-colors">Home</button></li>
                            <li><button onClick={() => setView('create')} className="hover:text-purple-600 transition-colors">Add Bounties</button></li>
                            <li><button onClick={() => setView('browse')} className="hover:text-purple-600 transition-colors">Complete Bounties</button></li>
                            <li><button onClick={() => setView('validate')} className="hover:text-purple-600 transition-colors">Verification Game</button></li>
                        </ul>
                    </div>

                    {/* Developers */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-slate-900 mb-4">Developers</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <a href="https://github.com/jrine0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                                    <Github size={14} /> jrine0
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/Zaidnaz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                                    <Github size={14} /> Zaidnaz
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="https://x.com/mdzaid2969" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-purple-100 hover:text-purple-600 transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-slate-100 pt-8 text-center text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} Catch Protocol. All rights reserved.
                </div>
            </div>
        </footer>
    );
};