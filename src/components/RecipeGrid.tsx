import { useState, useEffect } from 'react';
import { RecipeCard } from './RecipeCard';
import { Recipe } from '../types/recipe';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface RecipeGridProps {
  savedOnly?: boolean;
}

export function RecipeGrid({ savedOnly = false }: RecipeGridProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, [savedOnly, token]);

  const fetchRecipes = async () => {
    try {
      const endpoint = savedOnly ? '/api/recipes/saved' : '/api/recipes';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://194.164.166.135:15000${endpoint}`, { headers });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {savedOnly ? 'No saved recipes yet' : 'No recipes available'}
        </h3>
        <p className="text-gray-600 mb-4">
          {savedOnly 
            ? 'Start exploring and save recipes you like!'
            : 'Check back later for new recipes.'}
        </p>
        {savedOnly && (
          <Link 
            to="/recipe-gallery" 
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
          >
            <Search className="w-4 h-4" />
            <span>Browse Recipe Gallery</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}