
/*
  RUN THIS FILE WITH NODE.JS to enable MongoDB persistence.
  
  1. Initialize: npm init -y
  2. Install: npm install express mongoose cors dotenv
  3. Run: node server/index.js
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connection String provided
const MONGO_URI = "";
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (Cluster0)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Schemas ---

const BountySchema = new mongoose.Schema({
  id: String,
  creator: String,
  title: String,
  description: String,
  category: String,
  rewardPool: Number,
  requiredCount: Number,
  currentCount: { type: Number, default: 0 },
  status: String,
  createdAt: Number,
  tags: [String]
});

const SubmissionSchema = new mongoose.Schema({
  id: String,
  bountyId: String,
  contributor: String,
  dataPreview: String,
  dataType: String,
  status: String,
  aiScore: Number,
  aiFeedback: String,
  communityVotes: [{
    validator: String,
    verdict: String,
    timestamp: Number
  }],
  timestamp: Number
});

const Bounty = mongoose.model('Bounty', BountySchema);
const Submission = mongoose.model('Submission', SubmissionSchema);

// --- Routes ---

// Bounties
app.get('/api/bounties', async (req, res) => {
  try {
    const bounties = await Bounty.find().sort({ createdAt: -1 });
    res.json(bounties);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/bounties', async (req, res) => {
  try {
    const newBounty = new Bounty(req.body);
    await newBounty.save();
    res.json(newBounty);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ timestamp: -1 });
    res.json(submissions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/submissions', async (req, res) => {
  try {
    const newSubmission = new Submission(req.body);
    await newSubmission.save();
    res.json(newSubmission);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Updates
app.put('/api/submissions/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { validator, verdict } = req.body;
  try {
    const sub = await Submission.findOne({ id });
    if (sub) {
      sub.communityVotes.push({ validator, verdict, timestamp: Date.now() });
      await sub.save();
      res.json(sub);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/submissions/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const sub = await Submission.findOne({ id });
    if (sub) {
      sub.status = status;
      await sub.save();
      
      // If accepted, increment bounty count
      if (status === 'accepted') {
         await Bounty.updateOne({ id: sub.bountyId }, { $inc: { currentCount: 1 } });
      }
      res.json(sub);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
