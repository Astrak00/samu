import { WorkoutGrid } from '../components/WorkoutGrid';
import { Dumbbell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function WorkoutGallery() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-purple-500" />
            <h1 className="text-3xl font-bold text-gray-900">Workout Gallery</h1>
          </div>
          {isAuthenticated && (
            <Link to="/upload-workout">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload Workout
              </Button>
            </Link>
          )}
        </div>
        <WorkoutGrid />
      </main>
    </div>
  );
}