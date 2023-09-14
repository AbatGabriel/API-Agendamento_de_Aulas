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
    findById: jest.fn(),
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
      // Simula que não há nenhum student registrado
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

  describe('getSingleStudent', () => {
    it('should return a student registred and "status OK"', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simula que há um student com o id fornecido
      (StudentModel.findOne as jest.Mock).mockResolvedValue(mockStudent);

      await getSingleStudent(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({ Student: mockStudent });
    });

    it('should return "The Student ID is incorrect" error if the id is not a valid ObjectId', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844g',
        },
      };

      await getSingleStudent(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'The student ID is incorrect',
      });
    });

    it('should return "There is no student with id: {id}" error if there is no Student with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simula que não há nenhum Student com o id fornecido
      (StudentModel.findOne as jest.Mock).mockResolvedValue(null);

      await getSingleStudent(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `There is no student with id: ${req.params.id}`,
      });
    });
  });

  // Testes para o método createStudent
  describe('createStudent', () => {
    it('should return the Student created and "status OK"', async () => {
      const req = {
        body: {
          name: 'Vinicius',
          email: 'vinicius@hotmail.com',
          password: 'secret',
        },
      };

      // Simula que o instrutor foi criado
      (StudentModel.create as jest.Mock).mockResolvedValue({});

      await createStudent(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Student: mockStudent });
    });

    it('should return "Missing fields" error if some value is empty', async () => {
      const req = {
        body: {
          email: 'vinicius@hotmail.com',
          password: 'secret',
        },
      };

      await createStudent(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Missing fields' });
    });

    it('should return "Email already exists" error if email is already in use', async () => {
      const req = {
        body: {
          name: 'Vinicius',
          email: 'vinicius@hotmail.com',
          password: 'secret',
        },
      };

      // Simula que um Student com o email fornecido já existe
      (StudentModel.findOne as jest.Mock).mockResolvedValue({
        email: 'viniciuspinha2@hotmail.com',
      });

      await createStudent(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Email already exists' });
    });
  });

  // Testes para o método updateStudent
  describe('updateStudent', () => {
    it('should return student updated and "status OK"', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
        body: {
          name: 'Viniciuss',
          email: 'viniciuss@hotmail.com',
          password: 'secrett',
        },
      };

      (StudentModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        id: '6501ebfc87d46e3a6861844d',
        name: 'Vinicius',
        email: 'vinicius@hotmail.com',
        password: 'secrett',
      });

      await updateStudent(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Student: mockStudent });
    });

    it('should return "The Student ID is incorrect" error if the id is not a valid ObjectId', async () => {
      const req = {
        params: {
          id: '123',
        },
      };

      await updateStudent(
        req as any as Request,
        res as Response,
        next as NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'The student ID is incorrect',
      });
    });

    it('should return "There is no Student with id: {id}" error if there is no Student with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simula que não há nenhum Student com o id fornecido
      (StudentModel.findOne as jest.Mock).mockResolvedValue(null);

      await updateStudent(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `There is no student with id: ${req.params.id}`,
      });
    });
  });
});
