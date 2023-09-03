import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { StudentModel } from "../models/aluno";
import { InstrutorModel } from "../models/instrutor";

// JWT secret for token generation
const secret = process.env.JWT_SECRET
  ? process.env.JWT_SECRET
  : "5c7ee2074b65853f71fc5a01ce194ff26deedf6daacdb715c6beefdfd3f31b35";

// Logs student in and returns it's JWT token
async function loginStudent(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please Provide email and password!");
  }

  const student = await StudentModel.findOne({ email }).exec();

  if (!student) {
    throw new Error("Invalid Credentials!");
  }

  const passwordMatch = await student.comparePassword(password);

  if (!passwordMatch) {
    throw new Error("Invalid Credentials!");
  }

  const id = student._id;
  const nome = student.nome;
  const role = student.role;

  const token = jwt.sign({ id, nome, role }, secret, {
    expiresIn: "30d",
  });

  res.status(StatusCodes.OK).json({ msg: "User confirmed and logged!", token });
}

// Logs instructor in and returns it's JWT token
async function loginInstructor(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please Provide email and password!");
  }

  const instructor = await InstrutorModel.findOne({ email }).exec();

  if (!instructor) {
    throw new Error("Invalid Credentials!");
  }

  const passwordMatch = await instructor.comparePassword(password);

  if (!passwordMatch) {
    throw new Error("Invalid Credentials!");
  }

  const id = instructor._id;
  const nome = instructor.nome;
  const role = instructor.role;

  const token = jwt.sign({ id, nome, role }, secret, { expiresIn: "30d" });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Instructor confirmed and logged!", token });
}

export { loginInstructor, loginStudent };
