const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema({
  author: { type: String, required: true },
  // Persisted display name and avatar for the author (optional)
  username: { type: String },
  avatar: { type: String, default: null },
  text: { type: String, required: true },
  image: { type: String, default: null },
  category: { type: String, enum: ['forfun', 'homework'], default: 'forfun' },
  reactions: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] },
  reported: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
