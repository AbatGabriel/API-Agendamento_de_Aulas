import mongoose, { Schema, Document } from "mongoose";

export interface IAluno extends Document {
  nome: string;
  email: string;
  password: string;
}

const AlunoSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IAluno>("Aluno", AlunoSchema);
