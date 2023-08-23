import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  nome: string;
  email: string;
  password: string;
}

const StudentSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const StudentModel = mongoose.model<IStudent>(
  "Student",
  StudentSchema
);