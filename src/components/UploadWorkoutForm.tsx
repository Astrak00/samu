import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from './ui/Toast';

export function UploadWorkoutForm() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    duration: '',
    difficulty: 'beginner',
    calories: '',
    category: '',
    exercises: [{
      name: '',
      sets: '',
      reps: '',
      calories: '',
      image: '',
      instructions: [''],
      difficulty: 'beginner',
      muscleGroup: ''
    }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch('http://194.164.166.135:15000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          calories: parseInt(formData.calories),
          rating: 0,
          exercises: formData.exercises.map(exercise => ({
            ...exercise,
            sets: parseInt(exercise.sets),
            reps: parseInt(exercise.reps),
            calories: parseInt(exercise.calories),
            instructions: exercise.instructions.filter(i => i.trim() !== '')
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload workout');
      }

      navigate('/workout-gallery');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error uploading workout');
    }
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, {
        name: '',
        sets: '',
        reps: '',
        calories: '',
        image: '',
        instructions: [''],
        difficulty: 'beginner',
        muscleGroup: ''
      }]
    });
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData({ ...formData, exercises: newExercises });
  };

  const addInstruction = (exerciseIndex: number) => {
    const newExercises = [...formData.exercises];
    newExercises[exerciseIndex].instructions.push('');
    setFormData({ ...formData, exercises: newExercises });
  };

  const updateInstruction = (exerciseIndex: number, instructionIndex: number, value: string) => {
    const newExercises = [...formData.exercises];
    newExercises[exerciseIndex].instructions[instructionIndex] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
          type="url"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Calories</label>
          <Input
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            required
            type="number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            placeholder="e.g., HIIT, Strength, Yoga"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Exercises</h3>
          <Button type="button" variant="outline" onClick={addExercise}>
            Add Exercise
          </Button>
        </div>

        {formData.exercises.map((exercise, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Exercise {index + 1}</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                value={exercise.name}
                onChange={(e) => updateExercise(index, 'name', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sets</label>
                <Input
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                  required
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reps</label>
                <Input
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                  required
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Calories</label>
                <Input
                  value={exercise.calories}
                  onChange={(e) => updateExercise(index, 'calories', e.target.value)}
                  required
                  type="number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <Input
                value={exercise.image}
                onChange={(e) => updateExercise(index, 'image', e.target.value)}
                required
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Muscle Group</label>
              <Input
                value={exercise.muscleGroup}
                onChange={(e) => updateExercise(index, 'muscleGroup', e.target.value)}
                required
                placeholder="e.g., Chest, Legs, Core"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                value={exercise.difficulty}
                onChange={(e) => updateExercise(index, 'difficulty', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addInstruction(index)}
                >
                  Add Step
                </Button>
              </div>
              {exercise.instructions.map((instruction, instructionIndex) => (
                <div key={instructionIndex} className="mb-2">
                  <Input
                    value={instruction}
                    onChange={(e) => updateInstruction(index, instructionIndex, e.target.value)}
                    placeholder={`Step ${instructionIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        Upload Workout
      </Button>

      {error && (
        <Toast
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </form>
  );
}