import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Dumbbell, Flame, Activity, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Rating } from '../components/ui/Rating';
import { Comments } from '../components/Comments';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';

export function WorkoutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, updateUserData } = useAuth();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  useEffect(() => {
    if (user && workout) {
      const savedWorkoutIds = user.savedWorkouts?.map((w: any) => w._id || w);
      setIsSaved(savedWorkoutIds?.includes(workout._id));
    }
  }, [user, workout]);

  const fetchWorkout = async () => {
    try {
      const response = await fetch(`http://194.164.166.135:15000/api/workouts/${id}`);
      if (!response.ok) {
        throw new Error('Workout not found');
      }
      const data = await response.json();
      setWorkout(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading workout');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      navigate('/signin');
      return;
    }

    setSaveLoading(true);
    try {
      const response = await fetch(`http://194.164.166.135:15000/api/workouts/${id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      const data = await response.json();
      setIsSaved(!isSaved);
      await updateUserData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error saving workout');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Workout not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={workout.image}
              alt={workout.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full">
              {workout.category}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-purple-500 capitalize">
                {workout.difficulty}
              </span>
              <div className="flex items-center gap-4">
                <Rating value={workout.rating} />
                <Button
                  onClick={handleSave}
                  disabled={saveLoading}
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    isSaved ? 'text-purple-500 border-purple-500' : ''
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4" />
                  )}
                  {isSaved ? 'Saved' : 'Save Workout'}
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{workout.title}</h1>
            <p className="text-gray-600 mb-6">{workout.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{workout.duration} min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-medium">{workout.calories}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Exercises</p>
                  <p className="font-medium">{workout.exercises.length}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Exercises</h2>
              {workout.exercises.map((exercise: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={exercise.image}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500">Sets</p>
                          <p className="font-medium">{exercise.sets}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Reps</p>
                          <p className="font-medium">{exercise.reps}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Calories</p>
                          <p className="font-medium">{exercise.calories}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-600">
                          {exercise.instructions.map((instruction: string, i: number) => (
                            <li key={i}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Comments workoutId={workout._id} />
            </div>
          </div>
        </div>
      </div>
      {error && (
        <Toast
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}