import { uploadFile, getScheduleUploads } from '../controllers/upload';
import { UploadedFile } from 'express-fileupload';
import { SchedulingModel } from '../models/scheduling';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import * as fs from 'fs';

jest.mock('mongoose');
jest.mock('cloudinary');
jest.mock('fs');

jest.mock('../models/scheduling', () => ({
  SchedulingModel: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
  },
}));

// Upload tests
describe('Upload tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Upload file', () => {
    it('Should return status 200 if the file is uploaded successfully', async () => {
      const file = {
        name: 'testFile.txt',
        size: 2000000,
      } as UploadedFile;

      req = {
        files: {
          file,
        },
        params: {
          id: '65039e7324362123ace8430',
        },
      };
      const mockScheduling = {
        files: [],
        save: jest.fn(),
      };
      (cloudinary.v2.uploader.upload as jest.Mock).mockResolvedValue(true);
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

      await uploadFile(req as Request, res as Response, next);
      expect(mockScheduling.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Should return status 400 and msg 'No file uploaded' if no file is uploaded", async () => {
      await uploadFile(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'No file uploaded.' });
    });

    it("Should return status 400 and msg 'Maximum file size exceede.' if file size is greater than the limit size", async () => {
      const file = {
        name: 'testFile',
        size: 4000000,
      } as UploadedFile;

      req = {
        files: {
          file,
        },
      };

      await uploadFile(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Maximum file size exceeded.',
      });
    });

    it("Should return status 400 and msg 'Invalid file format.' if file format is not allowed", async () => {
      const file = {
        name: 'testFile.mp4',
        size: 3000000,
      } as UploadedFile;

      req = {
        files: {
          file,
        },
      };

      await uploadFile(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid file format.',
      });
    });

    it("Should return status 500 and msg 'Something went wrong while uploading the file to cloudinary. Please try again.' if somwthing went wrong while uploading the file to cloudinary", async () => {
      const file = {
        name: 'testFile.txt',
        size: 3000000,
      } as UploadedFile;

      req = {
        files: {
          file,
        },
      };

      (cloudinary.v2.uploader.upload as jest.Mock).mockResolvedValue(null);

      await uploadFile(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Something went wrong while uploading the file to cloudinary. Please try again.',
      });
    });

    it("Should return status 404 and msg 'Scheduling with id: ${idscheduling} not found.' if scheduling is not found", async () => {
      const file = {
        name: 'testFile.txt',
        size: 3000000,
      } as UploadedFile;

      req = {
        files: {
          file,
        },
        params: {
          id: '65039e7324362123ace8430',
        },
      };

      (cloudinary.v2.uploader.upload as jest.Mock).mockResolvedValue(true);
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(null);
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

      await uploadFile(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `Scheduling with id: ${req.params!.id} not found.`,
      });
    });
  });

  describe('Get schedule uploads', () => {
    it('Should return status 200 and the uploads if the upload was ok', async () => {
      const file = {
        name: 'testFile.txt',
        size: 3000000,
      } as UploadedFile;
      req = {
        files: {
          file,
        },
        params: {
          id: '65039e7324362123ace8430',
        },
      };

      const mockScheduling = {
        files: [
          {
            url: 'https://link-to-cloudinary-file.com',
            name: 'testFile.txt',
            _id: '65039e7324362123ace8430',
          },
        ],
      };

      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);

      await getScheduleUploads(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ uploads: mockScheduling.files });
    });

    it("Should return status 404 and msg 'Scheduling with id: ${idscheduling} not found.' if scheduling is not found", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
      };
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(null);

      await getScheduleUploads(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `Scheduling with id: ${req.params!.id} not found.`,
      });
    });

    it("Should return status 404 and msg Scheduling with id: ${idscheduling} has no uploaded files.' if there's no uploaded files", async () => {
      const mockScheduling = {
        files: [],
      };
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
      };
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(true);

      await getScheduleUploads(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `Scheduling with id: ${req.params!.id} has no uploaded files.`,
      });
    });
  });
});
