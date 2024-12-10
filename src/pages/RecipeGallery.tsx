import { RecipeGrid } from '../components/RecipeGrid';
import { Utensils, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function RecipeGallery() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Recipe Gallery</h1>
          </div>
          {isAuthenticated && (
            <Link to="/upload-recipe">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload Recipe
              </Button>
            </Link>
          )}
        </div>
        <RecipeGrid />
      </main>
    </div>
  );
}