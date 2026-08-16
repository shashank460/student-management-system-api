import mongoose from 'mongoose';

const academicRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    subjects: [
      {
        name: { type: String, required: true },
        marks: { type: Number, required: true, min: 0, max: 100 },
        grade: { type: String, trim: true }
      }
    ],
    sgpa: { type: Number, min: 0, max: 10 }
  },
  { timestamps: true }
);

academicRecordSchema.index({ student: 1, semester: 1 }, { unique: true });

export default mongoose.model('AcademicRecord', academicRecordSchema);
