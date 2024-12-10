import { useState, useEffect } from 'react';
import { WorkoutCard } from './WorkoutCard';
import { Workout } from '../types/workout';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface WorkoutGridProps {
  savedOnly?: boolean;
}

export function WorkoutGrid({ savedOnly = false }: WorkoutGridProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchWorkouts();
  }, [savedOnly, token]);

  const fetchWorkouts = async () => {
    try {
      const endpoint = savedOnly ? '/api/workouts/saved' : '/api/workouts';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:15000${endpoint}`, { headers });
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {savedOnly ? 'No saved workouts yet' : 'No workouts available'}
        </h3>
        <p className="text-gray-600 mb-4">
          {savedOnly 
            ? 'Start exploring and save workouts you like!'
            : 'Check back later for new workouts.'}
        </p>
        {savedOnly && (
          <Link 
            to="/workout-gallery" 
            className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-600"
          >
            <Search className="w-4 h-4" />
            <span>Browse Workout Gallery</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workouts.map((workout) => (
        <WorkoutCard key={workout._id} workout={workout} />
      ))}
    </div>
  );
}