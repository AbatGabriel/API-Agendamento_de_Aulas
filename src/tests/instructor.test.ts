import { createInstructor } from '../controllers/instructor';
import { InstructorModel } from '../models/instructor';
import { Request, Response, NextFunction } from 'express';

jest.mock('../models/instructor', () => ({
  InstructorModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('createInstructor', () => {
  beforeEach(() => {
    // Limpa todas as instâncias e chamadas para o mock
    (InstructorModel.findOne as jest.Mock).mockClear();
    (InstructorModel.create as jest.Mock).mockClear();
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

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

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

  it('should return "Missing fields" error if some value is empty', async () => {
    const req = {
      body: {
        email: 'vinicius2@hotmail.com',
        password: 'secret',
        expertise: ['Matéria3'],
        availability: ['Sex7'],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    await createInstructor(
      req as Request,
      res as Response,
      next as NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Missing fields' });
  });
});
