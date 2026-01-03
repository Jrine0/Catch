import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bounty, Submission, User } from './types';
import { mongoService } from './services/mongoService';

interface AppContextType {
  user: User | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  bounties: Bounty[];
  submissions: Submission[];
  addBounty: (bounty: Bounty) => void;
  addSubmission: (submission: Submission) => void;
  voteOnSubmission: (id: string, verdict: 'valid' | 'invalid') => void;
  finalizeSubmission: (id: string, status: 'accepted' | 'rejected') => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Watch for user changes to update gamification stats
  useEffect(() => {
    if (user) {
        const stats = mongoService.getUserStats(user.address);
        if (stats.dailyValidationCount !== user.dailyValidationCount) {
             setUser(prev => prev ? { ...prev, ...stats } : null);
        }
    }
  }, [user?.address]);

  const refreshData = async () => {
    const fetchedBounties = await mongoService.getBounties();
    const fetchedSubmissions = await mongoService.getSubmissions();
    
    setBounties(fetchedBounties);
    setSubmissions(fetchedSubmissions);

    if (user) {
        // Update user stats if they are logged in
        const stats = mongoService.getUserStats(user.address);
        setUser(prev => prev ? { ...prev, ...stats } : null);
    }
  };

  const connectWallet = () => {
    // Check for Solana object in window
    const solana = (window as any).solana;
    const ethereum = (window as any).ethereum;
    
    setTimeout(() => {
        let walletType: User['walletType'] = 'other';
        if (solana && solana.isPhantom) walletType = 'phantom';
        else if (ethereum && ethereum.isMetaMask) walletType = 'metamask';

        // Mock Address for demo
        const address = '7Xw...3k9z'; 
        const stats = mongoService.getUserStats(address);

        setUser({
            address,
            balance: 145.2,
            walletType,
            ...stats
        });
    }, 800);
  };

  const disconnectWallet = () => {
    setUser(null);
  };

  const addBounty = async (bounty: Bounty) => {
    await mongoService.saveBounty(bounty);
    refreshData();
  };

  const addSubmission = async (submission: Submission) => {
    await mongoService.saveSubmission(submission);
    refreshData();
  };

  // Community verification
  const voteOnSubmission = async (id: string, verdict: 'valid' | 'invalid') => {
      if (!user) return;
      await mongoService.addVoteToSubmission(id, user.address, verdict);
      mongoService.incrementDailyCount(user.address);
      refreshData();
  };

  // Owner final approval
  const finalizeSubmission = async (id: string, status: 'accepted' | 'rejected') => {
      await mongoService.updateSubmissionStatus(id, status);
      
      if (status === 'accepted') {
          // If accepted, update the bounty progress
          const sub = submissions.find(s => s.id === id);
          if (sub) {
              await mongoService.updateBountyCount(sub.bountyId);
          }
      }
      refreshData();
  };

  return (
    <AppContext.Provider value={{ 
        user, 
        connectWallet, 
        disconnectWallet, 
        bounties, 
        submissions, 
        addBounty,
        addSubmission,
        voteOnSubmission,
        finalizeSubmission,
        refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};