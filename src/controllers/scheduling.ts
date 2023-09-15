import { StatusCodes } from 'http-status-codes';
import { SchedulingModel } from '../models/scheduling';
import { InstructorModel } from '../models/instructor';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

function verifyHours(availability: string[], selectedHour: string): boolean {
  let avaliability: boolean = false;
  availability.forEach((horario: string) => {
    if (horario !== selectedHour) {
      avaliability = false;
    } else {
      avaliability = true;
    }
  });
  return avaliability;
}

function verifyMateria(expertise: string[], materia: string) {
  let avaliability: boolean = false;
  expertise.forEach((especialidade: string) => {
    if (especialidade !== materia) {
      avaliability = false;
    } else {
      avaliability = true;
    }
  });
  return avaliability;
}

async function createSchedule(req: Request, res: Response, next: NextFunction) {
  const { id: InstructorId, horario, materia } = req.body;
  const instructor = await InstructorModel.findById({
    _id: InstructorId,
  });


  if (!instructor) {
    return next(
      res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not Found instructor!' })
    );
  }
  if (
    verifyHours(instructor.availability, horario) &&
    verifyMateria(instructor.expertise, materia)
  ) {
    const schedule = await SchedulingModel.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ schedule });
  } else {
    res.json({ msg: 'Horário ou Materia Indisponível!' });
    return;
  }
}

// encontrar o scheduling pela materia, horario e pelo id do instructor e student
// verificar se o horario do scheduling foi alterado
async function updateSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: ScheduleId } = req.params;

    const scheduleDocument = await SchedulingModel.findById(ScheduleId);

    if (!scheduleDocument) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `There's no schedule with id: ${ScheduleId}` })
      );
    }
    const schedule = await SchedulingModel.findOneAndUpdate(
      { _id: ScheduleId },
      {
        ...req.body,
      }
    );

    if (!schedule) {
      return next(
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Failed to update schedule, please try again.' })
      );
    }
    res.status(StatusCodes.OK).json({ schedule });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Please inform a valid id.',
        })
      );
    }
  }
}

// encontrar o scheduling
// deletar  o scheduling
async function deleteSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: ScheduleId } = req.params;

    const scheduleDocument = await SchedulingModel.findById(ScheduleId);
    if (!scheduleDocument) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `There's no schedule with id: ${ScheduleId}` })
      );
    }

    const schedule = await SchedulingModel.findByIdAndDelete(ScheduleId);
    if (!schedule) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Failed to delete schedule, please try again.' });
    }
    res.status(StatusCodes.OK).json({ msg: `Delete Schedule ${ScheduleId}` });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Please inform a valid id.',
        })
      );
    }
  }
}

export { createSchedule, updateSchedule, deleteSchedule };
