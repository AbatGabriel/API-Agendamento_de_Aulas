import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduling';
import { SchedulingModel } from '../models/scheduling';
import { InstructorModel } from '../models/instructor';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { verifyRoles } from '../middleware/auth';

jest.mock('mongoose');

jest.mock('../models/scheduling', () => ({
  SchedulingModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock('../models/instructor', () => ({
  InstructorModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

// Scheduling tests
describe('Scheduling tests', () => {
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

  const mockScheduling = {
    instructor: '65039e7324362123ace8430',
    student: '650316118344060c8212ace5',
    time: 'Seg1',
    subject: 'Math1',
  };

  const mockInstructor = {
    _id: '65039e7324362123ace8430',
    name: 'Vinicius',
    email: 'vinicius@hotmail.com',
    password: 'secret',
    expertise: ['Math', 'Science'],
    availability: ['9:00', '11:00'],
  };

  // createScheduling test
  describe('createScheduling test', () => {
    it('Should successfully create a schedule and return it', async () => {
      const mockInstructor = {
        _id: 'validID',
        availability: ['Mon1', 'Tue2', 'Wed3'],
        expertise: ['Math', 'History', 'Science'],
      };

      const mockCreatedSchedule = {
        instructor: 'validID',
        student: 'studentID',
        time: 'Tue2',
        subject: 'History',
      };

      const req = {
        body: {
          instructor: '65039e7324362123ace8430',
          time: 'Tue2',
          subject: 'Math',
        },
        user: {
          id: '650316118344060c8212ace5',
        },
      } as unknown as Request;

      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (InstructorModel.findById as jest.Mock).mockResolvedValue(mockInstructor);
      (InstructorModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);
      (SchedulingModel.create as jest.Mock).mockResolvedValue(
        mockCreatedSchedule
      );

      await createSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ schedule: mockCreatedSchedule });
    });
    it('Should return "Not Found instructor!" error if the instructor is not found', async () => {
      req.body = {
        instructor: '65039e7324362123ace8430',
        time: 'Mon1',
        subject: 'Math',
      };

      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (InstructorModel.findById as jest.Mock).mockResolvedValue(null);

      await createSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Not Found instructor!',
      });
    });

    it('Should return "The instructor ID is incorrect" error if the id is not a valid ObjectId', async () => {
      req.body = {
        instructor: '65039e7324362123ace8430',
        time: 'Mon1',
        subject: 'Math',
      };

      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

      await createSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'The instructor ID is incorrect',
      });
    });

    it('Should return "Time or subject unavailable!" error if the time or subject is unavailable', async () => {
      req.body = {
        instructor: '65039e7324362123ace8430',
        time: 'Mon1',
        subject: 'History',
      };

      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (InstructorModel.findById as jest.Mock).mockResolvedValue(mockInstructor);

      await createSchedule(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        msg: 'Time or subject unavailable!',
      });
    });
  });

  // updateScheduling test
  describe('updateScheduling test', () => {
    it('Should successfully update a schedule and return it', async () => {
      req.body = {
        time: 'Mon1',
        subject: 'Math',
      };
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);
      (InstructorModel.findById as jest.Mock).mockResolvedValue(mockInstructor);
      (SchedulingModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);

      await updateSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        scheduleDocument: mockScheduling,
      });
    });

    it('Should return "Missing fields" error if the body is empty', async () => {
      req.body = {};
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      await updateSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Missing fields' });
    });
    it(`Should return "There's no schedule with id: {id}" error if the the id in params doesnt exist`, async () => {
      req.body = {
        time: 'Mon1',
      };
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      // (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(null);

      await updateSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `There's no schedule with id: ${req.params.id}`,
      });
    });

    it('Should return "New time or subject unavailable!" error if new time or subject is unavailable', async () => {
      req.body = {
        time: 'Tue2',
        subject: 'History',
      };
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      //   (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);
      (InstructorModel.findById as jest.Mock).mockResolvedValue(mockInstructor);

      await updateSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'New time or subject unavailable!',
      });
    });

    it('Should return "Not Found instructor!" error if the instructor is not found', async () => {
      req.body = {
        time: 'Tue2',
        subject: 'History',
      };
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      //   (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);
      (InstructorModel.findById as jest.Mock).mockResolvedValue(false);

      await updateSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Not Found instructor!',
      });
    });

    it('Should return "Please inform a valid id" if the id is not a valid ObjectId', async () => {
      const req = {
        params: {
          id: 'invalidObjectId',
        },
        body: {
          time: '10:00',
          subject: 'Math',
        },
      } as unknown as Request;

      // Mocking the error thrown by SchedulingModel.findById
      (SchedulingModel.findById as jest.Mock).mockImplementation(() => {
        throw new mongoose.Error.CastError('ObjectId', 'invalidObjectId', 'id');
      });

      await updateSchedule(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Please inform a valid id.',
      });
    });

    it('Should return "Internal Server Error." if there is an error', async () => {
      req.body = {
        time: '10:00',
        subject: 'Math',
      };
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };
      (SchedulingModel.findById as jest.Mock).mockRejectedValue(
        new Error('Unexpected Error')
      );

      await updateSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Internal Server Error.',
      });
    });
  });

  // deleteScheduling test
  describe('deleteScheduling test', () => {
    it('Should successfully delete a schedule and return it', async () => {
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      (SchedulingModel.findById as jest.Mock).mockResolvedValue(mockScheduling);
      (SchedulingModel.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      await deleteSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: `Deleted Schedule ${req.params.id}`,
      });
    });

    it(`Should return "There's no schedule with id: {id}" error if the the id in params doesnt exist`, async () => {
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      // (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
      (SchedulingModel.findById as jest.Mock).mockResolvedValue(null);

      await deleteSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `There's no schedule with id: ${req.params.id}`,
      });
    });

    it("Should return 'Failed to delete schedule, please try again.' error if the schedule doesnt exist", async () => {
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      (SchedulingModel.findById as jest.Mock).mockResolvedValue(true);
      (SchedulingModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Failed to delete schedule, please try again.',
      });
    });

    it('Should return "Please inform a valid id" if the id is not a valid ObjectId', async () => {
      req.params = {
        id: '6503bfce5083f1a736205bad',
      };

      // Mocking the error thrown by SchedulingModel.findById
      (SchedulingModel.findById as jest.Mock).mockImplementation(() => {
        throw new mongoose.Error.CastError('ObjectId', 'invalidObjectId', 'id');
      });

      await deleteSchedule(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Please inform a valid id.',
      });
    });
  });
});
