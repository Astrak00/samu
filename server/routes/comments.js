import express from 'express';
import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';
import Workout from '../models/Workout.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Add comment to recipe or workout
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, recipeId, workoutId } = req.body;

    const comment = new Comment({
      content,
      author: req.user.userId,
      authorName: req.user.name,
      likes: { count: 0, users: [] },
      dislikes: { count: 0, users: [] }
    });

    await comment.save();

    if (recipeId) {
      await Recipe.findByIdAndUpdate(recipeId, {
        $push: { comments: comment._id }
      });
    } else if (workoutId) {
      await Workout.findByIdAndUpdate(workoutId, {
        $push: { comments: comment._id }
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

// Get comments for recipe or workout
router.get('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let item;

    if (type === 'recipe') {
      item = await Recipe.findById(id).populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } }
      });
    } else if (type === 'workout') {
      item = await Workout.findById(id).populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } }
      });
    }

    if (!item) {
      return res.status(404).json({ message: `${type} not found` });
    }

    res.json(item.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Like or dislike a comment
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'dislike'
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user.userId;
    const hasLiked = comment.likes.users.includes(userId);
    const hasDisliked = comment.dislikes.users.includes(userId);

    // Remove any existing votes
    if (hasLiked) {
      comment.likes.users.pull(userId);
      comment.likes.count--;
    }
    if (hasDisliked) {
      comment.dislikes.users.pull(userId);
      comment.dislikes.count--;
    }

    // Add new vote if it's different from previous vote
    if (action === 'like' && !hasLiked) {
      comment.likes.users.push(userId);
      comment.likes.count++;
    } else if (action === 'dislike' && !hasDisliked) {
      comment.dislikes.users.push(userId);
      comment.dislikes.count++;
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error voting on comment', error: error.message });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Promise.all([
      Recipe.updateMany(
        { comments: comment._id },
        { $pull: { comments: comment._id } }
      ),
      Workout.updateMany(
        { comments: comment._id },
        { $pull: { comments: comment._id } }
      ),
      comment.deleteOne()
    ]);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

export default router;