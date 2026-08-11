import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: String,
  score: Number,
  maxScore: Number,
  percentage: Number,
  grade: String,
  examType: String,
  uploadedAt: { type: Date, default: Date.now },
  notificationSent: { type: Boolean, default: false }
});

export default mongoose.model('Result', resultSchema);
