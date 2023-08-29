import { Request, Response, NextFunction } from "express";
import { StudentModel } from "../models/aluno";
import { StatusCodes } from "http-status-codes";

export const getAllStudents = async (req: Request, res: Response) => {
  const StudentsDocument = await StudentModel.find({});
  res.status(StatusCodes.OK).json({ StudentsDocument });
};

export const createStudent = async (req: Request, res: Response) => {
  const StudentDocument = await StudentModel.create({
    ...req.body,
    role: "Student",
  });
  res.status(StatusCodes.CREATED).json({ StudentDocument });
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: StudentId } = req.params;
  const StudentDocument = await StudentModel.findOneAndUpdate(
    {
      _id: StudentId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!StudentDocument) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `there is no student with id: ${StudentId}` })
    );
  }
  res.status(StatusCodes.OK).json({ StudentDocument });
};

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
