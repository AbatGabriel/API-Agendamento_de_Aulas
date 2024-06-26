import mongoose, { Schema, Document } from 'mongoose';

// Scheduling interface
// Os campos do instructor e student são, respectivamente, o name e o id de cada um
interface IScheduling extends Document {
  instructor: string;
  student: string;
  time: string;
  subject: string;
  files: string;
}

// Scheduling mongoDB Schema
const SchedulingSchema: Schema = new Schema<IScheduling>({
  instructor: { type: String, required: true },
  student: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  files: { type: String },
});

export const SchedulingModel = mongoose.model<IScheduling>(
  'Scheduling',
  SchedulingSchema
);
