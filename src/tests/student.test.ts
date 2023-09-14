import {
  getAllStudents,
  getSingleStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student';
import { StudentModel } from '../models/student';
import { Request, Response, NextFunction } from 'express';

jest.mock('../models/student', () => ({
  StudentModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
  },
}));

describe('Students tests', () => {
  afterAll(() => {
    // Limpa todos os mocks
    jest.clearAllMocks();
  });

  const mockStudent = {
    _id: '6501ebfc87d46e3a6861844d',
    name: 'Vinicius',
    email: 'vinicius@hotmail.com',
    password: 'secret',
  };
  const mockStudent2 = {
    _id: '6601ebfc87d46e3a6861844e',
    name: 'Gabriel',
    email: 'gabriel@hotmail.com',
    password: 'secret',
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  // Testes para o método getSingleStudent
  describe('getAllStudents', () => {
    it('should return all the Students registred and "status OK"', async () => {
      (StudentModel.find as jest.Mock).mockResolvedValue([
        { mockStudent },
        { mockStudent2 },
      ]);

      await getAllStudents(
        {} as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        StudentsDocument: [{ mockStudent }, { mockStudent2 }],
      });
    });

    it('should return "There is none student registered" error if there is no student registered', async () => {
      // Simula que não há nenhum instructor registrado
      (StudentModel.find as jest.Mock).mockResolvedValue([]);

      await getAllStudents(
        {} as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'There is none student registered',
      });
    });
  });
});