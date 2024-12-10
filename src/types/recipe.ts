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

export interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  calories: number;
  comments: Comment[];
}