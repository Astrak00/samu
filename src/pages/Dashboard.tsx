import { RecipeGrid } from '../components/RecipeGrid';
import { WorkoutGrid } from '../components/WorkoutGrid';
import { Utensils, Dumbbell, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Dashboard() {
  const { isAuthenticated, user, updateUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    updateUserData();
  }, [isAuthenticated, navigate, updateUserData]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Track your nutrition and fitness journey</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Utensils className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold">Your Saved Recipes</h2>
              </div>
              <Link 
                to="/recipe-gallery" 
                className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                <span>Browse Recipes</span>
              </Link>
            </div>
            <RecipeGrid savedOnly />
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-semibold">Your Saved Workouts</h2>
              </div>
              <Link 
                to="/workout-gallery" 
                className="text-purple-500 hover:text-purple-600 flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                <span>Browse Workouts</span>
              </Link>
            </div>
            <WorkoutGrid savedOnly />
          </section>
        </div>
      </main>
    </div>
  );
}