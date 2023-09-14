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

  if (StudentsDocument.length === 0) {
    return next(
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'There is none student registered' })
    );
  }

  res.status(StatusCodes.OK).json({ StudentsDocument });
};

// Get single student data
export const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: StudentId } = req.params;

  if (!mongoose.isValidObjectId(StudentId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'The student ID is incorrect' });
    return next;
  }

  const Student = await StudentModel.findOne({
    _id: StudentId,
  });

  if (!Student) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `There is no student with id: ${StudentId}` })
    );
  }

  res.status(StatusCodes.OK).json({ Student });
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
  const { id: StudentId } = req.params;

  let Student = await StudentModel.findOne({ _id: StudentId });

  if (!Student) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `there is no student with id: ${StudentId}` })
    );
  }

  Student = await StudentModel.findOneAndUpdate(
    {
      _id: StudentId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ Student });
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
  res.status(StatusCodes.OK).json('deleted!');
};
