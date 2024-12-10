import { User, Mail, Calendar, Scale, Ruler } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BMISummary from '../components/BMISummary';

export function Profile() {
  const { user, isAuthenticated, updateUserData } = useAuth();
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-purple-500 h-32"></div>
            <div className="px-6 py-8">
              <div className="flex flex-col items-center -mt-20 mb-6">
                <div className="bg-white p-2 rounded-full">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Age: {user.age || 'Not set'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Scale className="w-5 h-5" />
                    <span>{user.weight ? `${user.weight} kg` : 'Weight not set'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Ruler className="w-5 h-5" />
                    <span>{user.height ? `${user.height} cm` : 'Height not set'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full md:w-auto" onClick={() => navigate('/profile-setup')}>
                  Update Health Information
                </Button>
              </div>
            </div>
          </div>

          {/* BMI Summary */}
          {user.bmi && (
            <BMISummary bmi={user.bmi} />
          )}

          {/* Health Statistics */}
          {user.healthHistory && user.healthHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Health Statistics</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={user.healthHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      stroke="#f97316"
                      name="Weight (kg)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bmi"
                      stroke="#9333ea"
                      name="BMI"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Dietary Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Food Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {user.foodPreferences && user.foodPreferences.length > 0 ? (
                    user.foodPreferences.map((pref) => (
                      <span
                        key={pref}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                      >
                        {pref}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No preferences set</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Dietary Restrictions</h3>
                <div className="flex flex-wrap gap-2">
                  {user.dietaryRestrictions && user.dietaryRestrictions.length > 0 ? (
                    user.dietaryRestrictions.map((restriction) => (
                      <span
                        key={restriction}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                      >
                        {restriction}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No restrictions set</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-600 mb-1">Saved Recipes</h3>
              <p className="text-2xl font-bold text-orange-700">{user.savedRecipes?.length || 0}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-600 mb-1">Saved Workouts</h3>
              <p className="text-2xl font-bold text-purple-700">{user.savedWorkouts?.length || 0}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
