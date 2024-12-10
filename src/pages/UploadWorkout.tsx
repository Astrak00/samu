import { UploadWorkoutForm } from '../components/UploadWorkoutForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function UploadWorkout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload New Workout</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <UploadWorkoutForm />
          </div>
        </div>
      </div>
    </div>
  );
}