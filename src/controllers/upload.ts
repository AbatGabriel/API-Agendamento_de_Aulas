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
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No file uploaded.' })
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
      public_id: `${Date.now()}`,
      folder: 'api-class-scheduling',
      resource_type: 'raw',
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

    const files = scheduling.files;

    if (!files) {
      return next(
        res.status(StatusCodes.NOT_FOUND).json({
          msg: `Scheduling with id: ${idscheduling} has no uploaded files.`,
        })
      );
    }
    return res.status(StatusCodes.OK).json({ files });
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

export const removeUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: idScheduling } = req.params;

    const scheduling = await SchedulingModel.findById({ _id: idScheduling });
    if (!scheduling) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: `Scheduling with id: ${idScheduling} not found.`,
      });
    }

    const { index } = req.body;
    if (!index || index === undefined || isNaN(index)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Please inform a valid index.',
      });
    }

    const fileIndexToRemove = parseInt(index);
    if (fileIndexToRemove < 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Invalid index, please inform a valid index.',
      });
    }

    const fileToRemove = scheduling.files[index];
    if (!fileToRemove) {
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: 'Please inform a valid index.' })
      );
    }

    const publicIdMatch = fileToRemove.match(/\/([^/]+)$/);
    if (!publicIdMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Invalid file URL.',
      });
    }

    const publicId = `api-class-scheduling/${publicIdMatch[1]}`;

    const removeFile = await cloudinary.uploader.destroy(
      publicId,
      { resource_type: 'raw' },
      (error: any, result: any) => {
        console.log('result:', result);
        console.log('error:', error);
      }
    );
    if (removeFile.result !== 'ok') {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Failed to remove file from Cloudinary, please try again.',
        })
      );
    }

    scheduling.files.splice(fileIndexToRemove, 1);

    await scheduling.save();

    return res
      .status(StatusCodes.OK)
      .json({ msg: 'File removed successfully!' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Please inform a valid scheduling id.',
        })
      );
    }
  }
};
