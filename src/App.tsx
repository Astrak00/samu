import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { RecipeDetails } from './pages/RecipeDetails';
import { WorkoutDetails } from './pages/WorkoutDetails';
import { Profile } from './pages/Profile';
import { ProfileSetup } from './pages/ProfileSetup';
import { RecipeGallery } from './pages/RecipeGallery';
import { WorkoutGallery } from './pages/WorkoutGallery';
import { UploadRecipe } from './pages/UploadRecipe';
import { UploadWorkout } from './pages/UploadWorkout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Auth type="signin" />} />
            <Route path="/signup" element={<Auth type="signup" />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/workout/:id" element={<WorkoutDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipe-gallery" element={<RecipeGallery />} />
            <Route path="/workout-gallery" element={<WorkoutGallery />} />
            <Route path="/upload-recipe" element={<UploadRecipe />} />
            <Route path="/upload-workout" element={<UploadWorkout />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;