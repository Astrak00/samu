import mongoose from 'mongoose';

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

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  age: {
    type: Number,
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
  foodPreferences: [{
    type: String,
  }],
  dietaryRestrictions: [{
    type: String,
  }],
  healthHistory: [healthDataSchema],
}, { timestamps: true });

// Calculate BMI before saving
profileSchema.pre('save', function(next) {
  // BMI = weight(kg) / height(m)²
  const heightInMeters = this.height / 100;
  this.bmi = +(this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  next();
});

export default mongoose.model('Profile', profileSchema);