const Child = require('../models/Child');
const Submission = require('../models/HomeworkSubmission');
const axios = require('axios');
const mongoose = require('mongoose');

exports.getLeaderboard = async (req, res) => {
  try {
    // Very small leaderboard: rank children by number of completed submissions
    const subs = await Submission.find({ status: 'completed' }).populate('studentId');
    const counts = {};
    subs.forEach(s => {
      const id = s.studentId?._id?.toString();
      if (!id) return;
      counts[id] = (counts[id] || 0) + 1;
    });
    const rows = [];
    for (const id of Object.keys(counts)) {
      const child = await Child.findById(id);
      rows.push({ childId: id, name: child ? `${child.firstName} ${child.lastName}` : id, completed: counts[id] });
    }
    rows.sort((a,b) => b.completed - a.completed);
    res.json({ leaderboard: rows });
  } catch (err) {
    console.error('getLeaderboard error', err);
    res.status(500).json({ error: err.message });
  }
};

const Post = require('../models/Post');

exports.listPosts = async (req, res) => {
  try {
  // By default, exclude reported posts from public listing. Moderators can pass ?reported=true
  const { reported, category } = req.query;
  const filter = {};
  if (reported === 'true') filter.reported = true;
  else filter.reported = { $ne: true };
  if (category) filter.category = category;
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ posts });
  } catch (err) {
    console.error('listPosts error', err);
    res.status(500).json({ error: err.message });
  }
};

// Call an OpenRouter-compatible LLM to generate an automatic reply.
exports.llmReply = async (req, res) => {
  try {
    console.log("llmreply request received:", req.body);
    const { message, botId } = req.body || {};
    if (!message) return res.status(400).json({ message: 'message is required' });

    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
    const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'; // Fixed endpoint
    const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'mistralai/mistral-small-3.2-24b-instruct:free';

    if (!OPENROUTER_KEY) return res.status(500).json({ message: 'OPENROUTER_API_KEY not configured' });

    // Prepare headers with required OpenRouter fields
    const headers = {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'YOUR_SITE_URL', // Replace with your actual site URL
      'X-Title': 'YOUR_APP_NAME',      // Replace with your app name
    };

    const payload = {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: message, // Directly use message without JSON.stringify
        },
      ],
    };

    const response = await axios.post(OPENROUTER_URL, payload, { headers, timeout: 15000 });
    const data = response?.data;

    // Extract response text from OpenRouter's structure
    const reply = data.choices?.[0]?.message?.content || 
                  data.choices?.[0]?.text || 
                  'No response generated';

    return res.json({ reply, raw: data });
  } catch (err) {
    console.error('llmReply error:', err.response?.data || err.message);
    return res.status(500).json({ 
      message: 'LLM request failed', 
      error: err.response?.data?.error?.message || err.message 
    });
  }
};

exports.createPost = async (req, res) => {
  try {
  const { author, username, avatar, text, image, category } = req.body || {};
  if (!author || !text) return res.status(400).json({ message: 'author and text are required' });
  const postData = {
    author,
    username: username || (author === 'sarahchen' ? 'Sarah Chen' : undefined),
    avatar: avatar || (author === 'sarahchen' ? 'https://randomuser.me/api/portraits/women/65.jpg' : null),
    text,
    image: image || null,
    category: category || 'forfun',
  };
  const post = await Post.create(postData);
    res.status(201).json({ post });
  } catch (err) {
    console.error('createPost error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.reactPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.reactions = (post.reactions || 0) + 1;
    await post.save();
    res.json({ post });
  } catch (err) {
    console.error('reactPost error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { username, text } = req.body || {};
    if (!username || !text) return res.status(400).json({ message: 'username and text required' });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = { username, text }; // createdAt handled by schema
    post.comments = post.comments || [];
    post.comments.push(comment);
    await post.save();
    res.json({ post, comment });
  } catch (err) {
    console.error('commentPost error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.reportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    // Validate that postId is a valid Mongo ObjectId to avoid Mongoose CastError
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.reported = true;
    await post.save();
    res.json({ message: 'Post reported', post });
  } catch (err) {
    console.error('reportPost error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted', post });
  } catch (err) {
    console.error('deletePost error', err);
    res.status(500).json({ error: err.message });
  }
};

exports.unreportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.reported = false;
    await post.save();
    res.json({ message: 'Post unreported', post });
  } catch (err) {
    console.error('unreportPost error', err);
    res.status(500).json({ error: err.message });
  }
};
