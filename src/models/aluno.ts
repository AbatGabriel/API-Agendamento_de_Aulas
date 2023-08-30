import mongoose, { Schema, Document } from "mongoose";
import * as bcrypt from "bcryptjs";

interface IStudent extends Document {
  nome: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const StudentSchema: Schema = new Schema<IStudent>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Student" },
});

StudentSchema.pre<IStudent>("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

StudentSchema.methods.comparePassword = function (
  this: IStudent,
  candidatePassword: string
): Promise<boolean> {
  const hashedPassword = this.password;
  return bcrypt.compare(candidatePassword, hashedPassword);
};

// const Student = mongoose.model<IStudent, IStudentModel>(
//   "Student",
//   StudentSchema
// );
// export default Student;

export const StudentModel = mongoose.model<IStudent>("Student", StudentSchema);
