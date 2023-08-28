import { Request, Response, NextFunction } from "express";
import { StudentModel } from "../models/aluno";
import { StatusCodes } from "http-status-codes";

export const getAllStudents = async (req: Request, res: Response) => {
  const Students = await StudentModel.find({});
  res.status(StatusCodes.OK).json({ Students });
};

export const createStudent = async (req: Request, res: Response) => {
  const Student = await StudentModel.create({ ...req.body, role: "Student" });
  res.status(StatusCodes.CREATED).json({ Student });
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: StudentId } = req.params;
  const Student = await StudentModel.findOneAndUpdate(
    {
      _id: StudentId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!Student) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `there is no student with id: ${StudentId}` })
    );
  }
  res.status(StatusCodes.OK).json({ Student });
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: StudentId } = req.params;
  const Student = await StudentModel.findByIdAndRemove(StudentId);
  if (!Student) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `there is no student with id: ${StudentId}` })
    );
  }
  res.status(StatusCodes.OK).json("deleted!");
};
