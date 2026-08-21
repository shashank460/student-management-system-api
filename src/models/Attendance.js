import mongoose from 'mongoose';

function normalizeToUtcMidnight(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true }
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

attendanceSchema.pre('save', function normalizeDate() {
  this.date = normalizeToUtcMidnight(this.date);
});

export default mongoose.model('Attendance', attendanceSchema);
