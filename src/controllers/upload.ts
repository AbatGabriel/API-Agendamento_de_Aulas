import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
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
  //console.log(req.files.file);

  const file = req.files.file as UploadedFile;

  // console.log("file tempfilepath:", file.tempFilePath);
  // console.log("filename", file.name);

  const allowedFormats = ["txt", "docx", "pdf"];
  const fileExtension = file.name.split(".").pop();

  // console.log("file extension:", fileExtension);

  if (!fileExtension || !allowedFormats.includes(fileExtension)) {
    return res.status(400).json({ error: "Invalid file format." });
  }

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    use_filename: true,
    folder: "api-agendamento de aulas",
    resource_type: "auto",
  });

  // console.log(result);

  if (!result) {
    res.status(400).json({
      error:
        "Something went wrong while uploading the file in cloudinary. Please ty again.",
    });
  }
  fs.unlinkSync(file.tempFilePath);

  return res.status(200).json({ file: { src: result.secure_url } });
};
