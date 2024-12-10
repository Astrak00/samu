import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const healthDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  bmi: {
    type: Number,
  },
  foodPreferences: [{
    type: String,
  }],
  dietaryRestrictions: [{
    type: String,
  }],
  healthHistory: [healthDataSchema],
  savedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
  savedWorkouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
  }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Automatically update BMI and health history
  if (this.isModified('weight') || this.isModified('height')) {
    if (this.weight && this.height) {
      const heightInMeters = this.height / 100;
      this.bmi = +(this.weight / (heightInMeters * heightInMeters)).toFixed(1);

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Check if an entry for today's date already exists
      const existingEntry = this.healthHistory.find(
        (entry) => entry.date.toISOString().split('T')[0] === today
      );

      if (existingEntry) {
        // Update the existing entry
        existingEntry.weight = this.weight;
        existingEntry.height = this.height;
        existingEntry.bmi = this.bmi;
      } else {
        // Add a new entry
        this.healthHistory.push({
          date: new Date(),
          weight: this.weight,
          height: this.height,
          bmi: this.bmi,
        });
      }
    }
  }

  next();
});




// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);