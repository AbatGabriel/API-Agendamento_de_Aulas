import { loginStudent } from '../controllers/main';
import { StudentModel } from '../models/student';

import { loginInstructor } from '../controllers/main';
import { InstructorModel } from '../models/instructor';

import { Request, Response } from 'express';

describe('main tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('loginStudent', () => {
    jest.mock('../models/student', () => ({
      StudentModel: {
        findOne: jest.fn(),
      },
    }));

    const mockStudent = {
      _id: 'mockedId',
      name: 'Mocked Student',
      role: 'Student',
      comparePassword: jest.fn().mockReturnValue(true),
    };

    const mockRequest = {
      body: {
        email: 'mocked@student.com',
        password: 'mockedpassword',
      },
    };

    it('should return a token and status 200 if login is successful', async () => {
      // Mocking the findOne method to return a mocked student
      jest.spyOn(StudentModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockStudent),
      } as any);

      await loginStudent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: 'User confirmed and logged!',
        token: expect.any(String),
      });
    });

    it('should throw "Please Provide email and password!"', async () => {
      mockRequest.body = {
        email: '',
        password: '',
      };

      await expect(
        loginStudent(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrowError('Please Provide email and password!');
    });

    it('should throw an error if student is not found', async () => {
      mockRequest.body = {
        email: 'Gabriel',
        password: 'secret',
      };

      jest.spyOn(StudentModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        loginStudent(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrowError('Invalid Credentials!');
    });

    it('should throw an error if password does not match', async () => {
      jest.spyOn(StudentModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockStudent),
      } as any);

      // Mocking the comparePassword method to return false (password does not match)
      mockStudent.comparePassword.mockReturnValueOnce(false);

      await expect(
        loginStudent(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrowError('Invalid Credentials!');
    });
  });

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  describe('loginInstructor', () => {
    jest.mock('../models/instructor', () => ({
      InstructorModel: {
        findOne: jest.fn(),
      },
    }));

    const mockInstructor = {
      _id: 'mockedId',
      name: 'Mocked Instructor',
      role: 'Instructor',
      comparePassword: jest.fn().mockReturnValue(true),
    };

    const mockRequest = {
      body: {
        email: 'mocked@Instructor.com',
        password: 'mockedpassword',
      },
    };

    it('should return a token and status 200 if login is successful', async () => {
      jest.spyOn(InstructorModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockInstructor),
      } as any);

      await loginInstructor(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: 'User confirmed and logged!',
        token: expect.any(String),
      });
    });

    it('should throw "Please Provide email and password!"', async () => {
      mockRequest.body = {
        email: '',
        password: '',
      };

      await expect(
        loginInstructor(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrowError('Please Provide email and password!');
    });

    it('should throw an error if Instructor is not found', async () => {
      mockRequest.body = {
        email: 'Gabriel',
        password: 'secret',
      };

      jest.spyOn(InstructorModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        loginInstructor(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrowError('Invalid Credentials!');
    });

    it('should throw an error if password does not match', async () => {
      jest.spyOn(InstructorModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockInstructor),
      } as any);

      mockInstructor.comparePassword.mockReturnValueOnce(false);

      await expect(
        loginInstructor(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrowError('Invalid Credentials!');
    });
  });
});
