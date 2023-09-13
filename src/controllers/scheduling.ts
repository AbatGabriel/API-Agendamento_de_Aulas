import { StatusCodes } from 'http-status-codes';
import { SchedulingModel } from '../models/scheduling';
import { InstructorModel } from '../models/instructor';
import { NextFunction, Request, Response } from 'express';
import { Buffer } from 'node:buffer';

function verifyHours(availability: string[], selectedHour: string): boolean {
  let avaliability: boolean = false;
  availability.forEach((time: string) => {
    if (time !== selectedHour) {
      avaliability = false;
    }
    avaliability = true;
  });
  return avaliability;
}

function verifysubject(expertise: string[], subject: string) {
  let avaliability: boolean = false;
  expertise.forEach((especialidade: string) => {
    if (especialidade !== subject) {
      avaliability = false;
    }
    avaliability = true;
  });
  return avaliability;
}

function createBufferFromString(sourceFile: string) {
  return Buffer.from(sourceFile);
}

async function createSchedule(req: Request, res: Response, next: NextFunction) {
  const { id: instructorId, time, file, subject } = req.body;
  const instructor = await InstructorModel.findOne({
    _id: instructorId,
  });

  if (!instructor) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not Found instructor!' });
    return;
  }

  // mock file for test only
  req.body.file = createBufferFromString(file);

  if (
    verifyHours(instructor.availability, time) &&
    verifysubject(instructor.expertise, subject)
  ) {
    const schedule = await SchedulingModel.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ schedule });
  } else {
    res.json({ msg: 'Horário ou subject Indisponível!' });
    return;
  }
}

// encontrar o agendamento pela subject, time e pelo id do instructor e student
// verificar se o time do agendamento foi alterado
async function updateSchedule(req: Request, res: Response, next: NextFunction) {
  const { id: idSchedule } = req.params;

  const schedule = await SchedulingModel.findOneAndUpdate(
    { _id: idSchedule },
    {
      ...req.body,
    }
  );

  if (!schedule) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `There is no Schedule found` });
    return;
  }
  res.status(StatusCodes.OK).json({ schedule });
}

// encontrar o agendamento
// deletar  o agendamento
async function deleteSchedule(req: Request, res: Response, next: NextFunction) {
  const { id: idSchedule } = req.params;
  const schedule = await SchedulingModel.findByIdAndDelete(idSchedule);

  if (!schedule) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `There is no Schedule with id: ${idSchedule}` });
    throw new Error('Id not found');
  }

  res.status(StatusCodes.OK).json({ msg: `Delete Schedule ${idSchedule}` });
}

export { createSchedule, updateSchedule, deleteSchedule };
