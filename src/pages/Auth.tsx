import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { signIn, signUp } from '../lib/api';
import { Toast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';

interface AuthPageProps {
  type: 'signin' | 'signup';
}

export function Auth({ type }: AuthPageProps) {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    try {
      if (type === 'signup') {
        const response = await signUp(data.name!, data.email, data.password);
        if (!response.success) {
          setError(response.error || 'Sign up failed');
          return;
        }
        setAuthData(response.data.token, response.data.user);
        navigate('/profile-setup');
      } else {
        const response = await signIn(data.email, data.password);
        if (!response.success) {
          setError(response.error || 'Sign in failed');
          return;
        }
        setAuthData(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthForm type={type} onSubmit={handleSubmit} />
      <p className="mt-4 text-center text-sm text-gray-600">
        {type === 'signin' ? (
          <>
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/signin" className="text-orange-500 hover:text-orange-600">
              Sign in
            </Link>
          </>
        )}
      </p>
      {error && (
        <Toast
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}