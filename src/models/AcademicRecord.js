import mongoose from 'mongoose';

function gradeFromMarks(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
}

const academicRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    subjects: [
      {
        name: { type: String, required: true, trim: true },
        marks: { type: Number, required: true, min: 0, max: 100 },
        grade: { type: String, trim: true }
      }
    ],
    sgpa: { type: Number, min: 0, max: 10 }
  },
  { timestamps: true }
);

academicRecordSchema.index({ student: 1, semester: 1 }, { unique: true });

academicRecordSchema.pre('save', function computeAcademicMetrics() {
  if (!this.subjects.length) return;
  for (const subject of this.subjects) subject.grade = gradeFromMarks(subject.marks);
  const averageMarks = this.subjects.reduce((sum, subject) => sum + subject.marks, 0) / this.subjects.length;
  this.sgpa = Number((averageMarks / 10).toFixed(2));
});

export default mongoose.model('AcademicRecord', academicRecordSchema);
