import { Link } from 'react-router-dom';
import { Apple } from 'lucide-react';
import { Button } from './ui/Button';

export function Banner() {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606787366850-de6330128bfc')] bg-cover bg-center opacity-10" />
      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              UIUC NutriTrack
            </h1>
            <p className="mt-6 text-lg leading-8 text-orange-50">
              Your personal nutrition companion at the University of Illinois. Track your meals, discover healthy recipes, and maintain a balanced diet throughout your academic journey.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/signup">
                <Button size="lg" variant="outline" className="border-white text-orange-600 hover:bg-orange-500 hover:text-white">
                  Get Started
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="border-white text-orange-600 hover:bg-orange-500 hover:text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center bg-orange-100 flex-shrink-0 max-w-[500px] w-full rounded-lg overflow-hidden">
            <img
              src="/fitness.jpg"
              alt="Fitness Illustration"
              className="w-full h-auto rounded-lg"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
