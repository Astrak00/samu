import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { Rating } from './ui/Rating';
import { formatTime } from '../lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Link to={`/recipe/${recipe._id}`} className="block">
      <div className="group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">{recipe.cuisine}</span>
            <Rating value={recipe.rating} />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{recipe.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(totalTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}