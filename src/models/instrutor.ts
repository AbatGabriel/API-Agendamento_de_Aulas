import mongoose, { Schema, Document } from "mongoose";

export interface IInstrutor extends Document {
  nome: string;
  email: string;
  password: string;
  especialidades: string[];
  horariosDisponiveis: string[];
  role: string;
}

const InstrutorSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  especialidades: { type: [String], required: true },
  horariosDisponiveis: { type: [String], required: true },
  role: { type: String, default: "Instructor" },
});

export const InstrutorModel = mongoose.model<IInstrutor>(
  "Instrutor",
  InstrutorSchema
);
