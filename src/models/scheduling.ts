import mongoose, { Schema, Document } from 'mongoose';

// Scheduling interface
// Os campos do instructor e student são, respectivamente, o name e o id de cada um
interface IScheduling extends Document {
  instructor: [string, string];
  student: [string, string];
  horario: string;
  materia: string;
  arquivos: [string, string];
}

// Scheduling mongoDB Schema
const SchedulingSchema: Schema = new Schema<IScheduling>({
  instructor: { type: [String, String], required: true },
  student: { type: [String, String], required: true },
  horario: { type: String, required: true },
  materia: { type: String, required: true },
  arquivos: { type: [String, String] },
});

export const SchedulingModel = mongoose.model<IScheduling>(
  'Scheduling',
  SchedulingSchema
);
