import mongoose, { Schema, Document } from "mongoose";

// Scheduling interface
// Os campos do instrutor e aluno são, respectivamente, o nome e o id de cada um
interface IScheduling extends Document {
  instrutor: [string, string];
  aluno: [string, string];
  horario: string;
  materia: string;
  arquivo: Buffer;
}

// Scheduling mongoDB Schema
const SchedulingSchema: Schema = new Schema<IScheduling>({
  instrutor: { type: [String, String], required: true },
  aluno: { type: [String, String], required: true },
  horario: { type: String, required: true },
  materia: { type: String, required: true },
  arquivo: { type: Buffer, required: true },
});

export const SchedulingModel = mongoose.model<IScheduling>(
  "Scheduling",
  SchedulingSchema
);
