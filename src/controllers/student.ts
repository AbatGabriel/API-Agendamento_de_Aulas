import { Request, Response, NextFunction } from 'express';
import { StudentModel } from '../models/student';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

// Gets all students data
export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const StudentsDocument = await StudentModel.find({});
  if (!StudentsDocument) {
    return next(
      res.status(StatusCodes.NOT_FOUND).json({ msg: 'No students found.' })
    );
  }
  res.status(StatusCodes.OK).json({ StudentsDocument });
};

// Creates new student
export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Missing fields' })
    );
  }

  const emailAlreadyExists = await StudentModel.findOne({ email });
  if (emailAlreadyExists) {
    return next(
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email already exists' })
    );
  }
  const StudentDocument = await StudentModel.create({
    name,
    email,
    password,
    role: 'Student',
  });
  res.status(StatusCodes.CREATED).json({ StudentDocument });
};

// Updates student data
export const updateStudent = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: StudentId } = req.params;

    const StudentDocument = await StudentModel.findById(StudentId);
    if (!StudentDocument) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `there is no student with id: ${StudentId}` })
      );
    }

    const student = await StudentModel.findOneAndUpdate(
      { _id: StudentId },
      {
        ...req.body,
      }
    );
    if (!student) {
      return next(
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Failed to update student, please try again.' })
      );
    }
    res.status(StatusCodes.OK).json({ StudentDocument });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Please inform a valid id.',
        })
      );
    }
  }
};

// Deletes student data
export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: StudentId } = req.params;

    const StudentDocument = await StudentModel.findById(StudentId);
    if (!StudentDocument) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `there is no student with id: ${StudentId}` })
      );
    }

    const student = await StudentModel.findByIdAndDelete(StudentId);
    if (!student) {
      return next(
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Failed to delete student, please try again.' })
      );
    }
    res.status(StatusCodes.OK).json('deleted!');
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Please inform a valid id.',
        })
      );
    }
  }
};
