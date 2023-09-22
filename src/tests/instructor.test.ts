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

// Instructor tests
describe('Instructors tests', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  const mockInstructor = {
    _id: '6501ebfc87d46e3a6861844d',
    name: 'Vinicius',
    email: 'vinicius@hotmail.com',
    password: 'secret',
    expertise: ['Math1', 'Portuguese2'],
    availability: ['Mon2', 'Mon3'],
  };
  const mockInstructor2 = {
    _id: '6601ebfc87d46e3a6861844e',
    name: 'Gabriel',
    email: 'gabriel@hotmail.com',
    password: 'secret',
    expertise: ['Math1', 'Portuguese2'],
    availability: ['Mon2', 'Mon3'],
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  // getSingleInstructor Test
  describe('getAllInstructors', () => {
    it('should return all the Instructors registred and "status OK"', async () => {
      (InstructorModel.find as jest.Mock).mockResolvedValue([
        { mockInstructor },
        { mockInstructor2 },
      ]);

      await getAllInstructors(
        {} as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        Instructors: [{ mockInstructor }, { mockInstructor2 }],
      });
    });

    it('should return "There is none instructors registered" error if there is no instructors registered', async () => {
      // Simulate that there is no instructors registered
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

  // getSingleInstructor Tests
  describe('getSingleInstructor', () => {
    it('should return a Instructor registred and "status OK"', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simulates that there is a instructor with the given id
      (InstructorModel.findOne as jest.Mock).mockResolvedValue(mockInstructor);

      await getSingleInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({ Instructor: mockInstructor });
    });

    it('should return "The instructor ID is incorrect" error if the id is not a valid ObjectId', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844g',
        },
      };

      await getSingleInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'The instructor ID is incorrect',
      });
    });

    it('should return "There is no instructor with id: {id}" error if there is no instructor with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simulates that there is no instructor with the given id
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

  // createInstructor Tests
  describe('createInstructor', () => {
    it('should return Instructor created and "status OK"', async () => {
      const req = {
        body: {
          name: 'Vinicius',
          email: 'vinicius@hotmail.com',
          password: 'secret',
          expertise: ['Math1', 'Portuguese2'],
          availability: ['Mon2', 'Mon3'],
        },
      };

      (InstructorModel.create as jest.Mock).mockResolvedValue({});

      await createInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Instructor: mockInstructor });
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

      // Simulates that there is a instructor with the given email
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

  // updateInstructor Tests
  describe('updateInstructor', () => {
    it('should return Instructor updated and "status OK"', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
        body: {
          name: 'Viniciuss',
          email: 'viniciuss@hotmail.com',
          password: 'secrett',
          expertise: ['Portuguese2'],
          availability: ['Sex9'],
        },
      };

      (InstructorModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        id: '6501ebfc87d46e3a6861844d',
        name: 'Viniciuss',
        email: 'viniciuss@hotmail.com',
        password: 'secrett',
        expertise: ['Portuguese2'],
        availability: ['Sex9'],
      });

      await updateInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Instructor: mockInstructor });
    });

    it('should return "The instructor ID is incorrect" error if the id is not a valid ObjectId', async () => {
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
        msg: 'The instructor ID is incorrect',
      });
    });

    it('should return "There is no instructor with id: {id}" error if there is no instructor with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simulates that there is no instructor with the given id
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

  // deleteInstructor Tests
  describe('deleteInstructor', () => {
    it('should return "There is no instructor with id: {id}" error if there is no instructor with the given id', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simulates that there is no instructor with the given id
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

    // Success case test
    it('should return the deleted instructor', async () => {
      const req = {
        params: {
          id: '6501ebfc87d46e3a6861844d',
        },
      };

      // Simulates that there is a instructor with the given id
      (InstructorModel.findByIdAndRemove as jest.Mock).mockResolvedValue(
        mockInstructor
      );

      await deleteInstructor(
        req as any as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Instructor: mockInstructor });
    });
  });
});
