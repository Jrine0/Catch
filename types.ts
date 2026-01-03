export type BountyCategory = 
  | 'Image Label Verification'
  | 'Handwriting Recognition'
  | 'Translation'
  | 'Translation Validation'
  | 'Sentiment Evaluation'
  | 'Audio Validation'
  | 'Audio Donation'
  | 'Image Capture'
  | 'Smart Camera'
  | 'Food Tasks'
  | 'Image Caption'
  | 'Semantic Similarity'
  | 'Glide Type'
  | 'Other';

export interface Bounty {
  id: string;
  creator: string; // Wallet address of the entity needing data
  title: string;
  description: string;
  category: BountyCategory;
  rewardPool: number; // In SOL
  requiredCount: number;
  currentCount: number;
  status: 'active' | 'completed';
  createdAt: number;
  tags: string[];
}

export interface ValidationVote {
  validator: string;
  verdict: 'valid' | 'invalid';
  timestamp: number;
}

export interface Submission {
  id: string;
  bountyId: string;
  contributor: string;
  dataPreview: string; // URL or text snippet
  dataType: 'image' | 'text';
  // 'pending' = waiting for community/owner, 'community_approved' = high confidence, 'accepted' = paid/finalized, 'rejected' = invalid
  status: 'pending' | 'accepted' | 'rejected'; 
  aiScore?: number;
  aiFeedback?: string;
  communityVotes: ValidationVote[];
  timestamp: number;
}

export interface User {
  address: string;
  balance: number;
  walletType: 'phantom' | 'solflare' | 'metamask' | 'other';
  dailyValidationCount: number;
  lastLoginDate: string; // To reset daily count
}
