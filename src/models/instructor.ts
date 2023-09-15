import mongoose, { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Instructor interface
export interface IInstructor extends Document {
  name: string;
  email: string;
  password: string;
  expertise: string[];
  availability: string[];
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Instructor mongoDB document Schema
const InstructorSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  expertise: { type: [String], required: true },
  availability: { type: [String], required: true },
  role: { type: String, default: 'Instructor' },
});

// pre-saves hashed password in new created instructor document
InstructorSchema.pre<IInstructor>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Compares given password with hashed one in document
InstructorSchema.methods.comparePassword = function (
  this: IInstructor,
  candidatePassword: string
): Promise<boolean> {
  const hashedPassword = this.password;
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export const InstructorModel = mongoose.model<IInstructor>(
  'Instructor',
  InstructorSchema
);
