import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: String,
  section: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Student', studentSchema);
