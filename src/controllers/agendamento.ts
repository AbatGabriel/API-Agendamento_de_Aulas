import { StatusCodes } from "http-status-codes";
import { SchedulingModel } from "../models/agendamento";
import { InstrutorModel } from "../models/instrutor";
import { NextFunction, Request, Response } from "express";
import { Buffer } from "node:buffer";

function verifyHours(
  horariosDisponiveis: string[],
  selectedHour: string
): boolean {
  let avaliability: boolean = false;
  horariosDisponiveis.forEach((horario: string) => {
    if (horario !== selectedHour) {
      avaliability = false;
    }
    avaliability = true;
  });
  return avaliability;
}

function verifyMateria(especialidades: string[], materia: string) {
  let avaliability: boolean = false;
  especialidades.forEach((especialidade: string) => {
    if (especialidade !== materia) {
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
  const { id: instructorId, horario, arquivo, materia } = req.body;
  const instructor = await InstrutorModel.findOne({
    _id: instructorId,
  });

  if (!instructor) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Not Found instructor!" });
    return;
  }

  // mock file for test only
  req.body.arquivo = createBufferFromString(arquivo);

  if (
    verifyHours(instructor.horariosDisponiveis, horario) &&
    verifyMateria(instructor.especialidades, materia)
  ) {
    const schedule = await SchedulingModel.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ schedule });
  } else {
    res.json({ msg: "Horário ou Materia Indisponível!" });
    return;
  }
}

// encontrar o agendamento pela materia, horario e pelo id do instrutor e aluno
// verificar se o horario do agendamento foi alterado
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
    throw new Error("Id not found");
  }

  res.status(StatusCodes.OK).json({ msg: `Delete Schedule ${idSchedule}` });
}

export { createSchedule, updateSchedule, deleteSchedule };
