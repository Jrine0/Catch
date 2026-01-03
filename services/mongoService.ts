import { Bounty, Submission, User } from "../types";

const API_URL = "http://localhost:5000/api";
let isBackendAvailable = false;

// Helper to check backend once on load
const checkBackend = async () => {
    try {
        await fetch(`${API_URL}/bounties`, { method: 'HEAD' });
        isBackendAvailable = true;
        console.log("✅ Backend connection established");
    } catch (e) {
        isBackendAvailable = false;
        console.warn("⚠️ Backend not available. Using LocalStorage fallback.");
    }
};
checkBackend();

const KEYS = {
    BOUNTIES: 'catch_bounties',
    SUBMISSIONS: 'catch_submissions',
    USER_STATS: 'catch_user_stats'
};

// Fallback LocalStorage Helpers
const ls = {
    get: (key: string) => JSON.parse(localStorage.getItem(key) || '[]'),
    set: (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val)),
    getStats: () => JSON.parse(localStorage.getItem(KEYS.USER_STATS) || '{}')
};

export const mongoService = {
    // --- Bounties ---
    getBounties: async (): Promise<Bounty[]> => {
        if (isBackendAvailable) {
            try {
                const res = await fetch(`${API_URL}/bounties`);
                return await res.json();
            } catch (e) { console.error(e); }
        }
        return ls.get(KEYS.BOUNTIES);
    },

    saveBounty: async (bounty: Bounty) => {
        if (isBackendAvailable) {
            try {
                await fetch(`${API_URL}/bounties`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bounty)
                });
                return;
            } catch (e) { console.error(e); }
        }
        
        // Fallback
        const bounties = ls.get(KEYS.BOUNTIES);
        bounties.unshift(bounty);
        ls.set(KEYS.BOUNTIES, bounties);
    },

    updateBountyCount: async (bountyId: string) => {
        // Handled by backend automatically on status update, 
        // but needed for fallback mode
        if (!isBackendAvailable) {
            const bounties = ls.get(KEYS.BOUNTIES);
            const updated = bounties.map((b: Bounty) => {
                if (b.id === bountyId) {
                    return { ...b, currentCount: b.currentCount + 1 };
                }
                return b;
            });
            ls.set(KEYS.BOUNTIES, updated);
        }
    },

    // --- Submissions ---
    getSubmissions: async (): Promise<Submission[]> => {
        if (isBackendAvailable) {
            try {
                const res = await fetch(`${API_URL}/submissions`);
                return await res.json();
            } catch (e) { console.error(e); }
        }
        return ls.get(KEYS.SUBMISSIONS);
    },

    saveSubmission: async (submission: Submission) => {
        if (isBackendAvailable) {
            try {
                await fetch(`${API_URL}/submissions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submission)
                });
                return;
            } catch (e) { console.error(e); }
        }

        // Fallback
        const subs = ls.get(KEYS.SUBMISSIONS);
        subs.unshift(submission);
        ls.set(KEYS.SUBMISSIONS, subs);
    },

    updateSubmissionStatus: async (id: string, status: Submission['status']) => {
        if (isBackendAvailable) {
            try {
                await fetch(`${API_URL}/submissions/${id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });
                return;
            } catch (e) { console.error(e); }
        }

        // Fallback
        const subs = ls.get(KEYS.SUBMISSIONS);
        const updated = subs.map((s: Submission) => s.id === id ? { ...s, status } : s);
        ls.set(KEYS.SUBMISSIONS, updated);
        
        // Logic sync for fallback
        if (status === 'accepted') {
             const sub = updated.find((s: Submission) => s.id === id);
             if (sub) mongoService.updateBountyCount(sub.bountyId);
        }
    },

    addVoteToSubmission: async (id: string, validator: string, verdict: 'valid' | 'invalid') => {
        if (isBackendAvailable) {
            try {
                await fetch(`${API_URL}/submissions/${id}/vote`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ validator, verdict })
                });
                return;
            } catch (e) { console.error(e); }
        }

        // Fallback
        const subs = ls.get(KEYS.SUBMISSIONS);
        const updated = subs.map((s: Submission) => {
            if (s.id === id) {
                const newVotes = [...(s.communityVotes || []), { validator, verdict, timestamp: Date.now() }];
                return { ...s, communityVotes: newVotes };
            }
            return s;
        });
        ls.set(KEYS.SUBMISSIONS, updated);
    },

    // --- User Stats (Local Only for Demo Performance) ---
    getUserStats: (address: string) => {
        const allStats = ls.getStats();
        const today = new Date().toDateString();
        
        let stats = allStats[address];
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
        const allStats = ls.getStats();
        const today = new Date().toDateString();
        if (allStats[address]) {
            allStats[address].dailyValidationCount += 1;
            allStats[address].lastLoginDate = today;
            localStorage.setItem(KEYS.USER_STATS, JSON.stringify(allStats));
        }
    }
};
