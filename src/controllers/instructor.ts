import { Request, Response, NextFunction } from "express";
import { InstrutorModel } from "../models/instrutor";
import { StatusCodes } from "http-status-codes";

export const getAllInstructors = async (req: Request, res: Response) => {
  const Instructors = await InstrutorModel.find({});
  res.status(StatusCodes.OK).json({ Instructors });
};

export const createInstructor = async (req: Request, res: Response) => {
  const Instructor = await InstrutorModel.create({
    ...req.body,
    role: "Instructor",
  });
  res.status(StatusCodes.CREATED).json({ Instructor });
};

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
  res.status(StatusCodes.OK).json("Deleted!");
};
