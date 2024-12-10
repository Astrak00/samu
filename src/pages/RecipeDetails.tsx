import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat, Flame, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Rating } from '../components/ui/Rating';
import { formatTime } from '../lib/utils';
import { Comments } from '../components/Comments';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';

export function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, updateUserData } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (user && recipe) {
      const savedRecipeIds = user.savedRecipes?.map((r: any) => r._id || r);
      setIsSaved(savedRecipeIds?.includes(recipe._id));
    }
  }, [user, recipe]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
      if (!response.ok) {
        throw new Error('Recipe not found');
      }
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading recipe');
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
      const response = await fetch(`http://localhost:5000/api/recipes/${id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      const data = await response.json();
      setIsSaved(!isSaved);
      await updateUserData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error saving recipe');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Recipe not found'}</p>
        </div>
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-orange-500">{recipe.cuisine}</span>
              <div className="flex items-center gap-4">
                <Rating value={recipe.rating} />
                <Button
                  onClick={handleSave}
                  disabled={saveLoading}
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    isSaved ? 'text-orange-500 border-orange-500' : ''
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4" />
                  )}
                  {isSaved ? 'Saved' : 'Save Recipe'}
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Time</p>
                  <p className="font-medium">{formatTime(totalTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-medium">{recipe.servings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium capitalize">{recipe.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-medium">{recipe.calories}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <p>{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-12">
              <Comments recipeId={recipe._id} />
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