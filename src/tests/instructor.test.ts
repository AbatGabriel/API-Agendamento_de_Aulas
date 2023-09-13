import {
  getAllInstructors,
  getSingleInstructor,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../controllers/instructor';
import { InstructorModel } from '../models/instructor';
import { Request, Response, NextFunction } from 'express';

jest.mock('../models/instructor', () => ({
  InstructorModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
  },
}));

describe('Instructors tests', () => {
  beforeEach(() => {
    // Limpa todas as instâncias e chamadas para o mock
    (InstructorModel.findOne as jest.Mock).mockClear();
    (InstructorModel.create as jest.Mock).mockClear();
    (InstructorModel.find as jest.Mock).mockClear();
    (InstructorModel.findOneAndUpdate as jest.Mock).mockClear();
    (InstructorModel.findByIdAndRemove as jest.Mock).mockClear();
  });

  afterAll(() => {
    // Limpa todos os mocks
    jest.clearAllMocks();
  });

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  // Testes para o método getSingleInstructor
  describe('getAllInstructors', () => {
    it('should return "There is none instructors registered" error if there is no instructors registered', async () => {
      // Simula que não há nenhum instructor registrado
      (InstructorModel.find as jest.Mock).mockResolvedValue([]);

      await getAllInstructors(
        {} as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'There is none instructors registered',
      });
    });
  });

  // Testes para o método getSingleInstructor
  describe('getSingleInstructor', () => {
    it('should return "The user ID is incorrect" error if the id is not a valid ObjectId', async () => {
      const req = {
        params: {
          id: '123',
        },
      };

      await getSingleInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'The user ID is incorrect',
      });
    });

    it('should return "There is no instructor with id: {id}" error if there is no instructor with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simula que não há nenhum instructor com o id fornecido
      (InstructorModel.findOne as jest.Mock).mockResolvedValue(null);

      await getSingleInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `There is no instructor with id: ${req.params.id}`,
      });
    });
  });

  // Testes para o método createInstructor
  describe('createInstructor', () => {
    it('should return "Missing fields" error if some value is empty', async () => {
      const req = {
        body: {
          email: 'vinicius2@hotmail.com',
          password: 'secret',
          expertise: ['Matéria3'],
          availability: ['Sex7'],
        },
      };

      await createInstructor(
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
          email: 'vinicius2@hotmail.com',
          password: 'secret',
          expertise: ['Matéria3'],
          availability: ['Sex7'],
        },
      };

      // Simula que um instructor com o email fornecido já existe
      (InstructorModel.findOne as jest.Mock).mockResolvedValue({
        email: 'viniciuspinha2@hotmail.com',
      });

      await createInstructor(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Email already exists' });
    });
  });

  // Testes para o método updateInstructor
  describe('updateInstructor', () => {
    it('should return "The user ID is incorrect" error if the id is not a valid ObjectId', async () => {
      const req = {
        params: {
          id: '123',
        },
      };

      await updateInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'The user ID is incorrect',
      });
    });

    it('should return "There is no instructor with id: {id}" error if there is no instructor with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simula que não há nenhum instructor com o id fornecido
      (InstructorModel.findOne as jest.Mock).mockResolvedValue(null);

      await updateInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `There is no instructor with id: ${req.params.id}`,
      });
    });
  });

  // Testes para o método deleteInstructor
  describe('deleteInstructor', () => {
    it('should return "There is no instructor with id: {id}" error if there is no instructor with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844',
        },
      };

      // Simula que não há nenhum instructor com o id fornecido
      (InstructorModel.findOne as jest.Mock).mockResolvedValue(null);

      await deleteInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        msg: `There is no instructor with id: ${req.params.id}`,
      });
    });
  });
});
