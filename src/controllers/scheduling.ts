import { StatusCodes } from 'http-status-codes';
import { SchedulingModel } from '../models/scheduling';
import { InstructorModel } from '../models/instructor';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { returnUserID } from '../middleware/auth';

function verifyHours(availability: string[], selectedHour: string): boolean {
  return (availability.includes(selectedHour));
}

function verifySubject(expertise: string[], subject: string) {
  return (expertise.includes(subject));
}

async function createSchedule(req: Request, res: Response, next: NextFunction) {
  const { instructor: instructorID, time, subject } = req.body;
  const userID = returnUserID(req);

  if (!mongoose.isValidObjectId(instructorID)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'The instructor ID is incorrect' });
    return next;
  }

  const instructor = await InstructorModel.findById({
    _id: instructorID,
  });
  if (!instructor) {
    return next(
      res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not Found instructor!' })
    );
  }

  if (
    verifyHours(instructor.availability, time) &&
    verifySubject(instructor.expertise, subject)
  ) {

    await InstructorModel.findByIdAndUpdate({
      _id: instructorID,
    }, {
      availability: instructor.availability.filter((schedule) => schedule !== time),
    })

    const schedule = await SchedulingModel.create({ instructor: instructorID, student: userID, time, subject });
    res.status(StatusCodes.CREATED).json({ schedule });
  } else {
    res.json({ msg: 'Horário ou subject Indisponível!' });
    return;
  }
}

// find schedule by id from param
// check if the schedule time was changed
async function updateSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: ScheduleId } = req.params;
    const { time: newtime, subject } = req.body;
    if(!newtime && !subject) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Missing fields' });
      return next;
    }

    let scheduleDocument = await SchedulingModel.findById(ScheduleId);
    if (!scheduleDocument) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `There's no schedule with id: ${ScheduleId}` })
      );
    }
    
    if(scheduleDocument) {
      const instructor = await InstructorModel.findById(scheduleDocument.instructor);
      if(instructor) {
        if (
          verifyHours(instructor.availability, newtime) ||
          verifySubject(instructor.expertise, subject)
        ) {
          let remainingTimes = instructor!.availability.filter((schedule) => schedule !== newtime);
          remainingTimes.push(scheduleDocument.time);

          await InstructorModel.findByIdAndUpdate({
            _id: instructor._id,
          }, {
            availability: remainingTimes,
          })

          scheduleDocument = await SchedulingModel.findOneAndUpdate(
            { _id: ScheduleId },
            {
              time: newtime,
              subject: subject,
            }
          );
        } else {
          return next(
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'New time or subject unavailable!' })
          )
        }
      } else {
        return next(
          res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not Found instructor!' })
        )
      }
    }
    scheduleDocument = await SchedulingModel.findById(ScheduleId);
    res.status(StatusCodes.OK).json({ scheduleDocument });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Please inform a valid id.',
        })
      );
    } else {
      return next(
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          msg: 'Internal Server Error.',
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
