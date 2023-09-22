import {
  uploadFile,
  getScheduleUploads,
  removeUpload,
} from '../controllers/upload';
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
      const mockScheduling = {
        files: [
          {
            url: 'testUrl',
            name: 'testName',
          },
        ],
      };
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
      };
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);

      await getScheduleUploads(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ files: mockScheduling.files });
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

  describe('Remove upload', () => {
    it("Should return status 404 and msg 'Scheduling with id: ${idScheduling} not found.' if scheduling is not found", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
      };
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(null);

      await removeUpload(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `Scheduling with id: ${req.params!.id} not found.`,
      });
    });

    it("Should return status 400 and msg 'Please inform a valid index.' if index is not informed or is undefined", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
        body: {
          index: undefined,
        },
      };
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(true);

      await removeUpload(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Please inform a valid index.',
      });
    });

    it("Should return status 404 and msg 'Invalid index, please inform a valid index.' if index is not a number", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
        body: {
          index: '-1',
        },
      };
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(true);

      await removeUpload(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Invalid index, please inform a valid index.',
      });
    });

    it("Should return status 404 and msg 'Please inform a valid index.' if index is less than 0", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
        body: {
          index: '2',
        },
      };
      const mockScheduling = {
        files: ['file1', 'file2'],
      };
      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);

      await removeUpload(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Please inform a valid index.',
      });
    });

    it("Should return status 400 and msg 'Invalid file URL.' if file URL is invalid", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
        body: {
          index: '0',
        },
      };
      const mockScheduling = {
        files: ['file1', 'file2'],
      };

      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);

      await removeUpload(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Invalid file URL.',
      });
    });

    it("Should return status 400 and msg ''Failed to remove file from Cloudinary, please try again.' if something went wrong while removing the file from Cloudinary", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
        body: {
          index: '0',
        },
      };

      const mockScheduling = {
        files: ['https://some.valid.url/file'],
      };

      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);
      (cloudinary.v2.uploader.destroy as jest.Mock).mockResolvedValue(false);

      await removeUpload(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Failed to remove file from Cloudinary, please try again.',
      });
    });

    it("Should return status 200 and msg 'File removed successfully.' if the file is removed successfully", async () => {
      req = {
        params: {
          id: '65039e7324362123ace8430',
        },
        body: {
          index: '1',
        },
      };

      const mockScheduling = {
        files: ['https://some.valid.url/file', 'https://some.valid.url/file'],
        save: jest.fn(),
      };

      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);
      (cloudinary.v2.uploader.destroy as jest.Mock).mockResolvedValue({
        result: 'ok',
      });

      await removeUpload(req as Request, res as Response, next);
      expect(mockScheduling.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'File removed successfully!',
      });
    });
  });
});
