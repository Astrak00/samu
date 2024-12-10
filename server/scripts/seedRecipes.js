import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe.js';

dotenv.config();

const recipes = [
  {
    title: 'Classic Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    rating: 4.8,
    cuisine: 'Italian',
    calories: 266,
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 cup warm water',
      '2 1/4 tsp active dry yeast',
      '1 tbsp olive oil',
      'Fresh mozzarella',
      'Fresh basil leaves',
      'San Marzano tomatoes',
      'Salt to taste'
    ],
    instructions: [
      'Mix flour, water, yeast, and salt to make the dough',
      'Let dough rise for 1 hour',
      'Stretch dough into a circle',
      'Top with crushed tomatoes, mozzarella, and basil',
      'Bake at 450°F for 12-15 minutes'
    ],
    comments: []
  },
  {
    title: 'Thai Green Curry',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    prepTime: 30,
    cookTime: 25,
    servings: 4,
    difficulty: 'medium',
    rating: 4.6,
    cuisine: 'Thai',
    calories: 385,
    ingredients: [
      'Green curry paste',
      'Coconut milk',
      'Chicken breast',
      'Thai eggplants',
      'Bamboo shoots',
      'Fish sauce',
      'Palm sugar',
      'Thai basil'
    ],
    instructions: [
      'Heat coconut milk in a pan',
      'Add curry paste and stir until fragrant',
      'Add chicken and cook until done',
      'Add vegetables and simmer',
      'Season with fish sauce and palm sugar',
      'Garnish with Thai basil'
    ],
    comments: []
  },
  {
    title: 'Beef Tacos',
    image: 'https://images.unsplash.com/photo-1601924582971-df4c8f18f50b',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    rating: 4.5,
    cuisine: 'Mexican',
    calories: 210,
    ingredients: [
      '1 lb ground beef',
      '1 packet taco seasoning',
      '8 small corn tortillas',
      '1 cup shredded lettuce',
      '1 cup diced tomatoes',
      '1/2 cup shredded cheddar cheese',
      'Sour cream and salsa for serving'
    ],
    instructions: [
      'Brown the ground beef in a skillet over medium heat.',
      'Drain any excess fat.',
      'Stir in taco seasoning and 1/4 cup of water; simmer for 5 minutes.',
      'Warm tortillas in a separate pan or microwave.',
      'Assemble tacos by placing beef mixture in tortillas and topping with lettuce, tomatoes, cheese, sour cream, and salsa.'
    ],
    comments: []
  },
  {
    title: 'Chicken Alfredo Pasta',
    image: 'https://images.unsplash.com/photo-1603133872873-5fc28a6f5a1f',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    rating: 4.7,
    cuisine: 'Italian',
    calories: 450,
    ingredients: [
      '8 oz fettuccine pasta',
      '2 chicken breasts, sliced',
      '2 cups heavy cream',
      '1 cup grated Parmesan cheese',
      '2 cloves garlic, minced',
      '2 tbsp butter',
      'Salt and pepper to taste',
      'Chopped parsley for garnish'
    ],
    instructions: [
      'Cook pasta according to package instructions; drain and set aside.',
      'In a large skillet, melt butter over medium heat.',
      'Add garlic and sauté until fragrant.',
      'Add chicken slices and cook until no longer pink.',
      'Pour in heavy cream and bring to a simmer.',
      'Stir in Parmesan cheese until the sauce thickens.',
      'Season with salt and pepper.',
      'Toss cooked pasta with the sauce.',
      'Garnish with chopped parsley before serving.'
    ],
    comments: []
  },
  {
    title: 'Vegetable Stir-Fry',
    image: 'https://images.unsplash.com/photo-1584270354949-1e4866d7a8f3',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: 'easy',
    rating: 4.3,
    cuisine: 'Chinese',
    calories: 180,
    ingredients: [
      '2 cups broccoli florets',
      '1 red bell pepper, sliced',
      '1 carrot, julienned',
      '1 cup snow peas',
      '2 tbsp soy sauce',
      '1 tbsp oyster sauce',
      '1 tbsp vegetable oil',
      '2 cloves garlic, minced',
      '1 tsp grated ginger',
      'Cooked rice for serving'
    ],
    instructions: [
      'Heat oil in a wok or large skillet over high heat.',
      'Add garlic and ginger; stir-fry until fragrant.',
      'Add broccoli, bell pepper, carrot, and snow peas; stir-fry for 5 minutes.',
      'Stir in soy sauce and oyster sauce; cook for an additional 2 minutes.',
      'Serve hot over cooked rice.'
    ],
    comments: []
  }
];

async function seedRecipes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Insert new recipes
    const insertedRecipes = await Recipe.insertMany(recipes);
    console.log(`Inserted ${insertedRecipes.length} recipes`);

    console.log('Recipe seeding completed successfully');
  } catch (error) {
    console.error('Error seeding recipes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
seedRecipes();