import mongoose, { Schema, Document } from 'mongoose';

// Scheduling interface
// Os campos do instructor e student são, respectivamente, o name e o id de cada um
interface IScheduling extends Document {
  instructor: [string, string];
  student: [string, string];
  time: string;
  subject: string;
  file: Buffer;
}

// Scheduling mongoDB Schema
const SchedulingSchema: Schema = new Schema<IScheduling>({
  instructor: { type: [String, String], required: true },
  student: { type: [String, String], required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  file: { type: Buffer, required: true },
});

export const SchedulingModel = mongoose.model<IScheduling>(
  'Scheduling',
  SchedulingSchema
);
