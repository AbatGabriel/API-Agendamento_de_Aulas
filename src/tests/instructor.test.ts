import { createInstructor } from '../controllers/instructor';
import { InstrutorModel } from '../models/instrutor';
import { Request, Response, NextFunction } from 'express';

jest.mock('../models/instrutor', () => ({
  InstrutorModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('createInstructor', () => {
  beforeEach(() => {
    // Limpa todas as instâncias e chamadas para o mock
    (InstrutorModel.findOne as jest.Mock).mockClear();
    (InstrutorModel.create as jest.Mock).mockClear();
  });

  it('should return "Email already exists" error if email is already in use', async () => {
    const req = {
      body: {
        nome: 'Vinicius',
        email: 'vinicius2@hotmail.com',
        password: 'secret',
        especialidades: ['Matéria3'],
        horariosDisponiveis: ['Sex7'],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    // Simula que um instrutor com o email fornecido já existe
    (InstrutorModel.findOne as jest.Mock).mockResolvedValue({
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
        especialidades: ['Matéria3'],
        horariosDisponiveis: ['Sex7'],
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
