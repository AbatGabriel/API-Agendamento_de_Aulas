import { Request, Response, NextFunction } from 'express';
import { InstrutorModel } from '../models/instrutor';
import { StatusCodes } from 'http-status-codes';

// Gets all instructors data
export const getAllInstructors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Instructors = await InstrutorModel.find({});

  if (Instructors.length === 0) {
    return next(
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'There is none instructors registered' })
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
  const { nome, email, password, especialidades, horariosDisponiveis } =
    req.body;

  if (!nome || !email || !password || !especialidades || !horariosDisponiveis) {
    return next(
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Missing fields' })
    );
  }

  const emailAlreadyExists = await InstrutorModel.findOne({ email });
  if (emailAlreadyExists) {
    return next(
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email already exists' })
    );
  }
  const Instructor = await InstrutorModel.create({
    nome,
    email,
    password,
    especialidades,
    horariosDisponiveis,
    role: 'Instructor',
  });
  res.status(StatusCodes.CREATED).send({ Instructor });
};

// Updates instructor data
export const updateInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: InstrutorId } = req.params;
  const Instrutor = await InstrutorModel.findOneAndUpdate(
    {
      _id: InstrutorId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!Instrutor) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `There is no instructor with id: ${InstrutorId}` })
    );
  }
  res.status(StatusCodes.OK).json({ Instrutor });
};

// Deletes instructor data
export const deleteInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: InstrutorId } = req.params;
  const Instructor = await InstrutorModel.findByIdAndRemove(InstrutorId);
  if (!Instructor) {
    return next(
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `There is no instructor with id: ${InstrutorId}` })
    );
  }
  res.status(StatusCodes.OK).json('Deleted!');
};
