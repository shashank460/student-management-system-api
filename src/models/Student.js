import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    phone: { type: String, trim: true },
    enrollmentYear: { type: Number, required: true, min: 2000 }
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
