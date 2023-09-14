import { Request, Response, NextFunction } from 'express';
import { instructorModel } from '../models/instructor';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

// Gets all instructors data
export const getAllInstructors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Instructors = await instructorModel.find({});
  if (!Instructors) {
    return next(
      res.status(StatusCodes.NOT_FOUND).json({ msg: 'No instructors found.' })
    );
  }

  res.status(StatusCodes.OK).json({ Instructors });
};

// Creates new instructor
export const createInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, expertise, availability } = req.body;

  if (!name || !email || !password || !expertise || !availability) {
    return next(
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Missing fields' })
    );
  }

  const emailAlreadyExists = await instructorModel.findOne({ email });
  if (emailAlreadyExists) {
    return next(
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email already exists' })
    );
  }

  const Instructor = await instructorModel.create({
    name,
    email,
    password,
    expertise,
    availability,
    role: 'Instructor',
  });
  res.status(StatusCodes.CREATED).json({ Instructor });
};

// Updates instructor data
export const updateInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: instructorId } = req.params;

    const InstructorDocument = await instructorModel.findById(instructorId);
    if (!InstructorDocument) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `there is no instructor with id: ${instructorId}` })
      );
    }

    const instructor = await instructorModel.findOneAndUpdate(
      { _id: instructorId },
      {
        ...req.body,
      }
    );
    if (!instructor) {
      return next(
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Failed to update instructor, please try again.' })
      );
    }

    res.status(StatusCodes.OK).json({ instructor });
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

// Deletes instructor data
export const deleteInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: instructorId } = req.params;

    const InstructorDocument = await instructorModel.findById(instructorId);
    if (!InstructorDocument) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `there is no instructor with id: ${instructorId}` })
      );
    }

    const instructor = await instructorModel.findByIdAndRemove(instructorId);
    if (!instructor) {
      return next(
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Failed to delete instructor. Please try again.' })
      );
    }
    res.status(StatusCodes.OK).json('Deleted!');
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
