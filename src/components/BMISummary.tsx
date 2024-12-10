import React from 'react';

interface Recommendation {
  goal: string;
  workout: string;
  recipes: string;
}

interface BMISummaryProps {
  bmi: number;
}

const BMISummary: React.FC<BMISummaryProps> = ({ bmi }) => {
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obesity";
  };

  const recommendations: Record<string, Recommendation> = {
    "Underweight": {
      goal: "Gain weight",
      workout: "Strength training to build muscle mass",
      recipes: "High-protein, high-calorie meals",
    },
    "Normal weight": {
      goal: "Maintain fitness",
      workout: "Cardio and strength training",
      recipes: "Balanced meals with adequate nutrients",
    },
    "Overweight": {
      goal: "Lose weight",
      workout: "Cardio-focused exercises",
      recipes: "Low-calorie, nutrient-dense meals",
    },
    "Obesity": {
      goal: "Significant weight loss",
      workout: "Low-impact exercises and gradual progression",
      recipes: "Low-calorie, high-fiber meals",
    },
  };

  const category = getBMICategory(bmi);
  const recommendation = recommendations[category];

  return (
    <div className="bg-white shadow rounded p-4 my-6">
      <h2 className="text-xl font-bold">
        Your BMI: {bmi} ({category})
      </h2>
      <p className="text-gray-700 mt-2">
        <strong>Goal:</strong> {recommendation.goal}
      </p>
      <p className="text-gray-700 mt-2">
        <strong>Recommended Workout:</strong> {recommendation.workout}
      </p>
      <p className="text-gray-700 mt-2">
        <strong>Recommended Recipes:</strong> {recommendation.recipes}
      </p>
    </div>
  );
};

export default BMISummary;
