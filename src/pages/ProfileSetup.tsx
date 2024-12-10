import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { createProfile } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from '../components/ui/Toast';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { token, updateUserData } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    foodPreferences: '',
    dietaryRestrictions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        navigate('/signin');
        return;
      }

      const profileData = {
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        foodPreferences: formData.foodPreferences.split(',').map(pref => pref.trim()),
        dietaryRestrictions: formData.dietaryRestrictions.split(',').map(rest => rest.trim()),
      };

      const response = await createProfile(profileData, token);
      if (response.success) {
        await updateUserData();
        navigate('/profile');
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">
            Help us personalize your experience by providing some basic information.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <Input
                id="age"
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <Input
                id="height"
                type="number"
                step="0.1"
                required
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="foodPreferences" className="block text-sm font-medium text-gray-700 mb-1">
                Food Preferences (comma-separated)
              </label>
              <Input
                id="foodPreferences"
                type="text"
                placeholder="e.g., Italian, Asian, Mediterranean"
                value={formData.foodPreferences}
                onChange={(e) => setFormData({ ...formData, foodPreferences: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Restrictions (comma-separated)
              </label>
              <Input
                id="dietaryRestrictions"
                type="text"
                placeholder="e.g., Vegetarian, Gluten-free, Dairy-free"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
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