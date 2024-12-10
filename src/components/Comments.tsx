import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  _id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  likes: {
    count: number;
    users: string[];
  };
  dislikes: {
    count: number;
    users: string[];
  };
}

interface CommentsProps {
  recipeId?: string;
  workoutId?: string;
}

export function Comments({ recipeId, workoutId }: CommentsProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (recipeId || workoutId) {
      fetchComments();
    }
  }, [recipeId, workoutId]);

  const fetchComments = async () => {
    try {
      const type = recipeId ? 'recipe' : 'workout';
      const id = recipeId || workoutId;
      const response = await fetch(`http://localhost:15000/api/comments/${type}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !token) return;

    try {
      const response = await fetch('http://localhost:15000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: comment,
          recipeId,
          workoutId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      setComment('');
      fetchComments();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error posting comment');
    }
  };

  const handleVote = async (commentId: string, action: 'like' | 'dislike') => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:15000/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error('Failed to vote on comment');
      }

      fetchComments();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error voting on comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:15000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      fetchComments();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error deleting comment');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit" disabled={!token}>
            Post
          </Button>
        </div>
        {!token && (
          <p className="text-sm text-gray-500 mt-2">
            Please sign in to leave a comment
          </p>
        )}
      </form>

      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.authorName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{comment.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVote(comment._id, 'like')}
                    className={`flex items-center gap-1 ${
                      user && comment.likes.users.includes(user.id)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                    disabled={!token}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes.count}</span>
                  </button>
                  <button
                    onClick={() => handleVote(comment._id, 'dislike')}
                    className={`flex items-center gap-1 ${
                      user && comment.dislikes.users.includes(user.id)
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                    disabled={!token}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{comment.dislikes.count}</span>
                  </button>
                </div>
                {user && comment.author === user.id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}