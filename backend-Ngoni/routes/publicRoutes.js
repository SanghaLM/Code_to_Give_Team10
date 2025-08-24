const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/leaderboard', publicController.getLeaderboard);
router.get('/posts', publicController.listPosts);
router.post('/posts', publicController.createPost);
router.post('/posts/:postId/react', publicController.reactPost);
router.post('/posts/:postId/comment', publicController.commentPost);
router.post('/posts/:postId/report', publicController.reportPost);
router.delete('/posts/:postId', publicController.deletePost);
router.patch('/posts/:postId/unreport', publicController.unreportPost);

// LLM reply endpoint used by chat UI
router.post('/llm/reply', publicController.llmReply);

module.exports = router;
