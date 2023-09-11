import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { SchedulingModel } from "../models/agendamento";
import fs from "fs";

//cloudinary settings
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const file = req.files.file as UploadedFile;

  const allowedFormats = ["txt", "docx", "pdf"];
  const fileExtension = file.name.split(".").pop();

  if (!fileExtension || !allowedFormats.includes(fileExtension)) {
    return res.status(400).json({ error: "Invalid file format." });
  }

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    use_filename: true,
    folder: "api-agendamento de aulas",
    resource_type: "auto",
  });

  if (!result) {
    res.status(400).json({
      error:
        "Something went wrong while uploading the file in cloudinary. Please ty again.",
    });
  }

  fs.unlinkSync(file.tempFilePath);

  const { id: agendamentoId } = req.params;
  const agendamento = await SchedulingModel.findById(
    { _id: agendamentoId },
    req.body
  );

  if (!agendamento) {
    return res.status(404).json({ error: "Scheduling not found." });
  }

  agendamento.arquivos.push(result.secure_url);

  await agendamento.save();

  return res.status(200).json({ file: { src: result.secure_url } });
};

export const getAgendamentoUploads = async (req: Request, res: Response) => {
  const { id: agendamentoId } = req.params;
  const agendamento = await SchedulingModel.findById(
    { _id: agendamentoId },
    req.body
  );

  if (!agendamento) {
    return res.status(404).json({ error: "Scheduling not found." });
  }

  return agendamento.arquivos;
};
