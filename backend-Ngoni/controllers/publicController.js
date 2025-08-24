const Child = require('../models/Child');
const Submission = require('../models/HomeworkSubmission');

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

exports.createPost = async (req, res) => {
  try {
  const { author, text, image, category } = req.body || {};
  if (!author || !text) return res.status(400).json({ message: 'author and text are required' });
  const post = await Post.create({ author, text, image: image || null, category: category || 'forfun' });
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
