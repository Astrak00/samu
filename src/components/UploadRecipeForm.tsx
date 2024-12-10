import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from './ui/Toast';

export function UploadRecipeForm() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'easy',
    cuisine: '',
    calories: '',
    ingredients: [''],
    instructions: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch('http://194.164.166.135:15000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          prepTime: parseInt(formData.prepTime),
          cookTime: parseInt(formData.cookTime),
          servings: parseInt(formData.servings),
          calories: parseInt(formData.calories),
          rating: 0,
          ingredients: formData.ingredients.filter(i => i.trim() !== ''),
          instructions: formData.instructions.filter(i => i.trim() !== '')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload recipe');
      }

      navigate('/recipe-gallery');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error uploading recipe');
    }
  };

  const addField = (field: 'ingredients' | 'instructions') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const updateField = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
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
          <label className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
          <Input
            value={formData.prepTime}
            onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
            required
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cook Time (minutes)</label>
          <Input
            value={formData.cookTime}
            onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
            required
            type="number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Servings</label>
          <Input
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
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
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cuisine</label>
          <Input
            value={formData.cuisine}
            onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="mb-2">
            <Input
              value={ingredient}
              onChange={(e) => updateField('ingredients', index, e.target.value)}
              placeholder={`Ingredient ${index + 1}`}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addField('ingredients')}
        >
          Add Ingredient
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="mb-2">
            <Input
              value={instruction}
              onChange={(e) => updateField('instructions', index, e.target.value)}
              placeholder={`Step ${index + 1}`}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addField('instructions')}
        >
          Add Step
        </Button>
      </div>

      <Button type="submit" className="w-full">
        Upload Recipe
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