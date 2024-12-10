export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  calories: number;
  image: string;
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroup: string;
  equipment?: string[];
}

export interface Workout {
  _id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  calories: number;
  exercises: Exercise[];
  image: string;
  rating: number;
  category: string;
  comments: Comment[];
}

export interface Comment {
  _id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  likes: {
    count: number;
    users: string[];
  };
  dislikes: {
    count: number;
    users: string[];
  };
}