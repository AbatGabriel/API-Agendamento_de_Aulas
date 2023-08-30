import { Request, Response, NextFunction } from "express";
import { StudentModel } from "../models/aluno";
import { StatusCodes } from "http-status-codes";

// Gets all students data
export const getAllStudents = async (req: Request, res: Response) => {
  const StudentsDocument = await StudentModel.find({});
  res.status(StatusCodes.OK).json({ StudentsDocument });
};

// Creates new student
export const createStudent = async (req: Request, res: Response) => {
  const StudentDocument = await StudentModel.create({
    ...req.body,
    role: "Student",
  });
  res.status(StatusCodes.CREATED).json({ StudentDocument });
};

// Updates student data
export const updateStudent = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { id: StudentId } = req.params;
  const StudentDocument = await StudentModel.findById(StudentId);

  if (!StudentDocument) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `there is no student with id: ${StudentId}` })
    );
  }
  if (StudentDocument) {
    StudentDocument.nome = req.body.nome;
    StudentDocument.email = req.body.email;
    StudentDocument.save();
  }
  res.status(StatusCodes.OK).json({ StudentDocument });
};

// Deletes student data
export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: StudentId } = req.params;
  const StudentDocument = await StudentModel.findByIdAndRemove(StudentId);
  if (!StudentDocument) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `there is no student with id: ${StudentId}` })
    );
  }
  res.status(StatusCodes.OK).json("deleted!");
};
