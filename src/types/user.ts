export interface HealthData {
  date: string;
  weight: number;
  height: number;
  bmi: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  foodPreferences: string[];
  dietaryRestrictions: string[];
  healthHistory: HealthData[];
  savedRecipes: string[];
}