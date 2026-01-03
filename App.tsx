import React, { useState } from 'react';
import { AppProvider, useAppStore } from './store';
import { BrowseView } from './views/BrowseView';
import { CreateView } from './views/CreateView';
import { DetailsView } from './views/DetailsView';
import { ValidateView } from './views/ValidateView';
import { LandingView } from './views/LandingView';
import { WalletButton } from './components/WalletButton';
import { Footer } from './components/Footer';
import { LayoutGrid, Plus, CheckSquare } from 'lucide-react';
import { Bounty } from './types';

const Navigation = ({ currentView, setView }: { currentView: string, setView: (v: string) => void }) => {
    return (
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <div 
                            className="flex items-center gap-2 cursor-pointer" 
                            onClick={() => setView('browse')}
                        >
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-white text-lg">C</span>
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">Catch</span>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-1">
                            <button 
                                onClick={() => setView('browse')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${currentView === 'browse' ? 'text-purple-600 bg-purple-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                            >
                                <LayoutGrid size={18} />
                                Browse
                            </button>
                            <button 
                                onClick={() => setView('create')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${currentView === 'create' ? 'text-purple-600 bg-purple-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                            >
                                <Plus size={18} />
                                Create
                            </button>
                            <button 
                                onClick={() => setView('validate')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${currentView === 'validate' ? 'text-purple-600 bg-purple-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                            >
                                <CheckSquare size={18} />
                                Validate
                            </button>
                        </div>
                    </div>

                    <WalletButton />
                </div>
            </div>
            
            {/* Mobile Nav */}
            <div className="md:hidden flex border-t border-slate-200 bg-white">
                <button 
                    onClick={() => setView('browse')}
                    className={`flex-1 py-3 text-center text-xs font-medium ${currentView === 'browse' ? 'text-purple-600' : 'text-slate-500'}`}
                >
                    Browse
                </button>
                <button 
                    onClick={() => setView('create')}
                    className={`flex-1 py-3 text-center text-xs font-medium ${currentView === 'create' ? 'text-purple-600' : 'text-slate-500'}`}
                >
                    Create
                </button>
                <button 
                    onClick={() => setView('validate')}
                    className={`flex-1 py-3 text-center text-xs font-medium ${currentView === 'validate' ? 'text-purple-600' : 'text-slate-500'}`}
                >
                    Validate
                </button>
            </div>
        </nav>
    );
};

const MainContent = () => {
    const { user } = useAppStore();
    const [currentView, setCurrentView] = useState('browse');
    const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);

    // Guard: If no user is connected, show Landing Page
    if (!user) {
        return <LandingView />;
    }

    const handleSelectBounty = (bounty: Bounty) => {
        setSelectedBounty(bounty);
        setCurrentView('details');
    };

    const handleBack = () => {
        setSelectedBounty(null);
        setCurrentView('browse');
    };

    const renderView = () => {
        switch (currentView) {
            case 'browse':
                return <BrowseView onSelectBounty={handleSelectBounty} />;
            case 'details':
                return selectedBounty ? <DetailsView bounty={selectedBounty} onBack={handleBack} /> : <BrowseView onSelectBounty={handleSelectBounty} />;
            case 'create':
                return <CreateView onComplete={() => setCurrentView('browse')} />;
            case 'validate':
                return <ValidateView />;
            default:
                return <BrowseView onSelectBounty={handleSelectBounty} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navigation currentView={currentView} setView={(v) => { setCurrentView(v); setSelectedBounty(null); }} />
            <main className="flex-grow pb-20">
                {renderView()}
            </main>
            <Footer setView={setCurrentView} />
        </div>
    );
};

const App = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;