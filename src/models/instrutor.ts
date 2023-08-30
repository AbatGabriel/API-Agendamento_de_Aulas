import mongoose, { Schema, Document } from "mongoose";
import * as bcrypt from "bcryptjs";

// Instructor interface
export interface IInstrutor extends Document {
  nome: string;
  email: string;
  password: string;
  especialidades: string[];
  horariosDisponiveis: string[];
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Instructor mongoDB document Schema
const InstrutorSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  especialidades: { type: [String], required: true },
  horariosDisponiveis: { type: [String], required: true },
  role: { type: String, default: "Instructor" },
});

// pre-saves hashed password in new created instructor document
InstrutorSchema.pre<IInstrutor>("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Compares given password with hashed one in document
InstrutorSchema.methods.comparePassword = function (
  this: IInstrutor,
  candidatePassword: string
): Promise<boolean> {
  const hashedPassword = this.password;
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export const InstrutorModel = mongoose.model<IInstrutor>(
  "Instrutor",
  InstrutorSchema
);
