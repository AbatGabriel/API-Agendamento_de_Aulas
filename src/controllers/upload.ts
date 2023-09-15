import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { SchedulingModel } from '../models/scheduling';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

//cloudinary settings
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//upload a file and attach it to a schedule
export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || !req.files.file) {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No file uplaoded.' })
      );
    }

    const file = req.files.file as UploadedFile;

    const allowedFormats = ['txt', 'docx', 'pdf'];
    const fileExtension = file.name.split('.').pop();
    const maxSize = 3000000;

    if (file.size > maxSize) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Maximum file size exceeded.' });
    }

    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid file format.' });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      use_filename: true,
      folder: 'api-scheduling de aulas',
      resource_type: 'auto',
    });

    if (!result) {
      return next(
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          msg: 'Something went wrong while uploading the file to cloudinary. Please try again.',
        })
      );
    }

    fs.unlinkSync(file.tempFilePath);

    const { id: idscheduling } = req.params;

    const scheduling = await SchedulingModel.findById(
      { _id: idscheduling },
      req.body
    );

    if (!scheduling) {
      return next(
        res.status(StatusCodes.NOT_FOUND).json({
          msg: `Scheduling with id: ${idscheduling} not found.`,
        })
      );
    }

    scheduling.files.push(result.secure_url);

    await scheduling.save();

    return res
      .status(StatusCodes.OK)
      .json({ file: { src: result.secure_url } });
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

//get all the uploads of a schedule
export const getScheduleUploads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: idscheduling } = req.params;
    const scheduling = await SchedulingModel.findById({ _id: idscheduling });

    if (!scheduling) {
      return next(
        res.status(StatusCodes.NOT_FOUND).json({
          msg: `Scheduling with id: ${idscheduling} not found.`,
        })
      );
    }

    const uploads = scheduling.files;

    if (!uploads) {
      return next(
        res.status(StatusCodes.NOT_FOUND).json({
          msg: `Scheduling with id: ${idscheduling} has no uploaded files.`,
        })
      );
    }
    return res.status(StatusCodes.OK).json({ uploads });
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
