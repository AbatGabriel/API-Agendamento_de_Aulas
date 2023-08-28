import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  nome: string;
  email: string;
  password: string;
  role: string;
}

const StudentSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Student" },
});

export const StudentModel = mongoose.model<IStudent>("Student", StudentSchema);
