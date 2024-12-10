import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workout from '../models/Workout.js';

dotenv.config();

const workouts = [
  {
    title: 'Full Body HIIT',
    description: 'High-intensity interval training targeting all major muscle groups',
    duration: 30,
    difficulty: 'intermediate',
    calories: 300,
    category: 'HIIT',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    exercises: [
      {
        name: 'Burpees',
        sets: 3,
        reps: 12,
        calories: 50,
        image: 'https://static1.squarespace.com/static/640626ced6468757ca7fc2f7/t/6681f535cb96a25399d295c3/1719792952502/what-to-do-if-you-hate-burpees.jpg?format=1500w',
        instructions: [
          'Start in a standing position',
          'Drop into a squat position with hands on the ground',
          'Kick your feet back into a plank position',
          'Immediately return your feet to the squat position',
          'Jump up from squatting position'
        ],
        difficulty: 'intermediate',
        muscleGroup: 'Full Body'
      },
      {
        name: 'Mountain Climbers',
        sets: 3,
        reps: 20,
        calories: 40,
        image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00',
        instructions: [
          'Start in a plank position',
          'Drive one knee toward your chest',
          'Quickly switch legs, driving the other knee forward',
          'Continue alternating legs'
        ],
        difficulty: 'intermediate',
        muscleGroup: 'Core'
      }
    ]
  },
  {
    title: 'Yoga Flow',
    description: 'Gentle yoga sequence for flexibility and mindfulness',
    duration: 45,
    difficulty: 'beginner',
    calories: 150,
    category: 'Yoga',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    exercises: [
      {
        name: 'Sun Salutation',
        sets: 1,
        reps: 10,
        duration: 15,
        calories: 30,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        instructions: [
          'Start in mountain pose',
          'Raise arms overhead',
          'Forward fold',
          'Half lift',
          'Step back to plank',
          'Lower to chaturanga',
          'Upward facing dog',
          'Downward facing dog'
        ],
        difficulty: 'beginner',
        muscleGroup: 'Full Body'
      }
    ]
  },
  {
    title: 'Upper Body Strength',
    description: 'Focus on building upper body strength with dumbbell exercises',
    duration: 40,
    difficulty: 'intermediate',
    calories: 250,
    category: 'Strength',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
    exercises: [
      {
        name: 'Dumbbell Bench Press',
        sets: 3,
        reps: 10,
        calories: 60,
        image: 'https://cdn.mos.cms.futurecdn.net/iSvYnWUkChXMxeSisvikYE-320-80.jpg',
        instructions: [
          'Lie on a flat bench with a dumbbell in each hand',
          'Press the dumbbells up until your arms are fully extended',
          'Lower the dumbbells slowly back to starting position'
        ],
        difficulty: 'intermediate',
        muscleGroup: 'Chest'
      },
      {
        name: 'Overhead Dumbbell Press',
        sets: 3,
        reps: 12,
        calories: 50,
        image: 'https://www.dmoose.com/cdn/shop/articles/Blog_Image_fo.png?v=1726246034',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Hold a dumbbell in each hand at shoulder height',
          'Press the dumbbells overhead until arms are fully extended',
          'Lower the dumbbells back to starting position'
        ],
        difficulty: 'intermediate',
        muscleGroup: 'Shoulders'
      }
    ]
  },
  {
    title: 'Core Crusher',
    description: 'Target your abs and obliques with this quick core workout',
    duration: 20,
    difficulty: 'advanced',
    calories: 200,
    category: 'Core',
    rating: 4.6,
    image: 'https://fithero.app/static/01446ce5b37816640ab478e68fabe487/dd919/core-workout.jpg',
    exercises: [
      {
        name: 'Plank Hold',
        sets: 3,
        reps: 60,
        calories: 30,
        image: 'https://img.huffingtonpost.com/asset/5cd542a82000005c0096f74e.jpeg?ops=scalefit_500_noupscale',
        instructions: [
          'Start in a plank position with elbows under shoulders',
          'Keep your body straight from head to heels',
          'Hold the position for the duration of the set (60 seconds)'
        ],
        difficulty: 'advanced',
        muscleGroup: 'Core'
      },
      {
        name: 'Bicycle Crunches',
        sets: 3,
        reps: 20,
        calories: 40,
        image: 'https://fitbod.me/wp-content/uploads/2020/07/bicycle-crunch.jpg',
        instructions: [
          'Lie on your back with hands behind your head',
          'Lift shoulders off the ground and bring one knee to your chest',
          'Alternate sides in a pedaling motion'
        ],
        difficulty: 'advanced',
        muscleGroup: 'Core'
      }
    ]
  },
  {
    title: 'Leg Day',
    description: 'Strengthen and tone your legs with this intense lower-body workout',
    duration: 50,
    difficulty: 'intermediate',
    calories: 350,
    category: 'Strength',
    rating: 4.7,
    image: 'https://mirafit.co.uk/wp/wp-content/uploads/2019/05/Fit_Man_in_Squatting_Position_using_Squat_Rack_and_Weights.jpg',
    exercises: [
      {
        name: 'Squats',
        sets: 4,
        reps: 15,
        calories: 70,
        image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body into a squat position',
          'Push through your heels to return to standing position'
        ],
        difficulty: 'intermediate',
        muscleGroup: 'Legs'
      },
      {
        name: 'Lunges',
        sets: 3,
        reps: 12,
        calories: 60,
        image: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2014/02/Walking-DB-Lunge.jpg?quality=86&strip=all',
        instructions: [
          'Stand with feet together',
          'Step forward with one leg and lower your hips until both knees are bent at 90 degrees',
          'Push through your front foot to return to standing position'
        ],
        difficulty: 'intermediate',
        muscleGroup: 'Legs'
      }
    ]
  }
];

async function seedWorkouts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing workouts
    await Workout.deleteMany({});
    console.log('Cleared existing workouts');

    // Insert new workouts
    const insertedWorkouts = await Workout.insertMany(workouts);
    console.log(`Inserted ${insertedWorkouts.length} workouts`);

    console.log('Workout seeding completed successfully');
  } catch (error) {
    console.error('Error seeding workouts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
seedWorkouts();