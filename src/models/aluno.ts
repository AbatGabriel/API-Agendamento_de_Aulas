import mongoose, { Schema, Document } from "mongoose";
import * as bcrypt from "bcryptjs";

// Student interface
interface IStudent extends Document {
  nome: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Student mongoDB Schmea
const StudentSchema: Schema = new Schema<IStudent>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Student" },
});

// pre-saves hashed password in new created student document
StudentSchema.pre<IStudent>("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Compares given password with hashed one in document
StudentSchema.methods.comparePassword = function (
  this: IStudent,
  candidatePassword: string
): Promise<boolean> {
  const hashedPassword = this.password;
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export const StudentModel = mongoose.model<IStudent>("Student", StudentSchema);
