import { Clock, Dumbbell, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Workout } from '../types/workout';
import { Rating } from './ui/Rating';

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Link to={`/workout/${workout._id}`} className="block">
      <div className="group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={workout.image}
            alt={workout.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {workout.category}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-500 capitalize">
              {workout.difficulty}
            </span>
            <Rating value={workout.rating} />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{workout.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{workout.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              <span>{workout.calories} cal</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="w-4 h-4" />
              <span>{workout.exercises.length} exercises</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}