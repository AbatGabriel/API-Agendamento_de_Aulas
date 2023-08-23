import mongoose, { Schema, Document } from "mongoose";

export interface IInstrutor extends Document {
  nome: string;
  email: string;
  password: string;
  especialidades: string[];
  horariosDisponiveis: string[];
}

const InstrutorSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  especialidades: { type: [String], required: true },
  horariosDisponiveis: { type: [String], required: true },
});

export const InstrutorModel = mongoose.model<IInstrutor>(
  "Instrutor",
  InstrutorSchema
);
