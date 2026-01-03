import { Bounty, Submission, User } from "../types";

// This service mimics a MongoDB backend using LocalStorage for the demo.
// In production, replace functions here with fetch() calls to your backend 
// which connects to: mongodb+srv://jitin4530_db_user...

const KEYS = {
    BOUNTIES: 'catch_bounties',
    SUBMISSIONS: 'catch_submissions',
    USER_STATS: 'catch_user_stats'
};

export const storageService = {
    // --- Bounties ---
    getBounties: (): Bounty[] => {
        const data = localStorage.getItem(KEYS.BOUNTIES);
        return data ? JSON.parse(data) : [];
    },

    saveBounty: (bounty: Bounty) => {
        const bounties = storageService.getBounties();
        bounties.unshift(bounty);
        localStorage.setItem(KEYS.BOUNTIES, JSON.stringify(bounties));
    },

    updateBountyCount: (bountyId: string) => {
        const bounties = storageService.getBounties();
        const updated = bounties.map(b => {
            if (b.id === bountyId) {
                return { ...b, currentCount: b.currentCount + 1 };
            }
            return b;
        });
        localStorage.setItem(KEYS.BOUNTIES, JSON.stringify(updated));
    },

    // --- Submissions ---
    getSubmissions: (): Submission[] => {
        const data = localStorage.getItem(KEYS.SUBMISSIONS);
        return data ? JSON.parse(data) : [];
    },

    saveSubmission: (submission: Submission) => {
        const subs = storageService.getSubmissions();
        subs.unshift(submission);
        localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(subs));
    },

    updateSubmissionStatus: (id: string, status: Submission['status']) => {
        const subs = storageService.getSubmissions();
        const updated = subs.map(s => s.id === id ? { ...s, status } : s);
        localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(updated));
    },

    addVoteToSubmission: (id: string, validator: string, verdict: 'valid' | 'invalid') => {
        const subs = storageService.getSubmissions();
        const updated = subs.map(s => {
            if (s.id === id) {
                const newVotes = [...(s.communityVotes || []), { validator, verdict, timestamp: Date.now() }];
                return { ...s, communityVotes: newVotes };
            }
            return s;
        });
        localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(updated));
    },

    // --- User Stats (Gamification) ---
    getUserStats: (address: string) => {
        const allStats = JSON.parse(localStorage.getItem(KEYS.USER_STATS) || '{}');
        const today = new Date().toDateString();
        
        let stats = allStats[address];
        
        // Reset if new day or new user
        if (!stats || stats.lastLoginDate !== today) {
            stats = {
                dailyValidationCount: 0,
                lastLoginDate: today
            };
            allStats[address] = stats;
            localStorage.setItem(KEYS.USER_STATS, JSON.stringify(allStats));
        }
        return stats;
    },

    incrementDailyCount: (address: string) => {
        const allStats = JSON.parse(localStorage.getItem(KEYS.USER_STATS) || '{}');
        const today = new Date().toDateString();
        
        if (allStats[address]) {
            allStats[address].dailyValidationCount += 1;
            allStats[address].lastLoginDate = today;
            localStorage.setItem(KEYS.USER_STATS, JSON.stringify(allStats));
        }
    }
};
