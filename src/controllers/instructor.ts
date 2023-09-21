import { Request, Response, NextFunction } from 'express';
import { InstructorModel } from '../models/instructor';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

// Gets all instructors data
export const getAllInstructors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Instructors = await InstructorModel.find({});

  if (Instructors.length === 0) {
    return next(
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'There is none instructors registered' })
    );
  }

  res.status(StatusCodes.OK).json({ Instructors });
};

// Get single instructor data
export const getSingleInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: InstructorId } = req.params;

  if (!mongoose.isValidObjectId(InstructorId)) {
    return next(
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'The instructor ID is incorrect' })
    );
  }

  const Instructor = await InstructorModel.findOne({
    _id: InstructorId,
  });

  if (!Instructor) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `There is no instructor with id: ${InstructorId}` })
    );
  }

  res.status(StatusCodes.OK).json({ Instructor });
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

  const emailAlreadyExists = await InstructorModel.findOne({ email });
  if (emailAlreadyExists) {
    return next(
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email already exists' })
    );
  }
  const Instructor = await InstructorModel.create({
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
  const { id: InstructorId } = req.params;

  let instructor = await InstructorModel.findOne({ _id: InstructorId });
  if (!instructor) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `There is no instructor with id: ${InstructorId}` })
    );
  }

  instructor = await InstructorModel.findOneAndUpdate(
    {
      _id: InstructorId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ instructor });
};

// Deletes instructor data
export const deleteInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: InstructorId } = req.params;
  const Instructor = await InstructorModel.findByIdAndRemove(InstructorId);
  if (!Instructor) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `There is no instructor with id: ${InstructorId}` })
    );
  }
  res.status(StatusCodes.OK).json('Deleted!');
};
