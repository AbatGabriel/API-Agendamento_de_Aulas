import {
  authMiddleware,
  verifyRoles,
  verifyUser,
  returnUserID,
} from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SchedulingModel } from '../models/scheduling';

jest.mock('../models/scheduling', () => ({
  SchedulingModel: {
    findOne: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | null;
        name: string;
        role: string;
      };
    }
  }
}
describe('auth tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;
  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer yourTokenHere',
      },
    };
    res = {
      status: jest.fn(),
      json: jest.fn() as any,
    };
    next = jest.fn();
  });

  describe('authMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
      req = {
        headers: {
          authorization: 'Bearer yourTokenHere',
        },
      };
      res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call next if valid token is provided', async () => {
      process.env.JWT_SECRET = 'mySecretKey';
      const tokenPayload = { id: '123', name: 'John Doe', role: 'user' };
      (jwt.verify as jest.Mock).mockReturnValueOnce(tokenPayload);

      await authMiddleware(req as Request, res as Response, next);

      expect(req.user).toEqual(tokenPayload);
      expect(next).toHaveBeenCalled();
    });

    it('should throw an error if no token is provided', async () => {
      if (!req.headers) {
        throw new Error('Headers not found');
      }

      req.headers.authorization = undefined;

      await expect(
        authMiddleware(req as Request, res as Response, next)
      ).rejects.toThrowError('No Token Provided!');
    });

    it('should throw an error if an invalid token is provided', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token verification failed');
      });

      await expect(
        authMiddleware(req as Request, res as Response, next)
      ).rejects.toThrowError('Not Autorized');
    });
  });

  describe('verifyRoles', () => {
    beforeEach(() => {
      req = {
        user: {
          id: '123',
          name: 'Vinicius',
          role: 'student',
        },
      } as unknown as Request;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() as any,
      };
      next = jest.fn();
    });

    it('should return unauthorized error if user does not have the required role', () => {
      const middleware = verifyRoles('instructor');
      expect(() => {
        middleware(req as Request, res as Response, next);
      }).toThrow('Unauthorized');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User not authorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user has the required role', () => {
      if (!req.user) {
        throw new Error('User not found');
      }
      req.user.role = 'instructor';

      verifyRoles('instructor')(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('verifyUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
      req = {
        user: {
          id: '',
          name: '',
          role: '',
        },
        params: {
          id: '',
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should call next if user is allowed to change their own data', async () => {
      if (!req.user) {
        throw new Error('user not found');
      }
      if (!req.params) {
        throw new Error('params not found');
      }
      req.user.id = '6503bfce5083f1a736205bad';
      req.params.id = '6503bfce5083f1a736205bad';

      (SchedulingModel.findOne as jest.Mock).mockResolvedValue({
        _id: req.params.id,
      });

      await verifyUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return bad request error if user id is not valid', async () => {
      if (!req.params) {
        throw new Error('params not found');
      }
      req.params.id = '6503bfce5083f1a736205ba';

      await verifyUser(req as Request, res as Response, next);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        msg: 'The instructor ID is incorrect',
      });
    });

    it("Should return 'Schedule not found' if schedule is not found", async () => {
      if (!req.params) {
        throw new Error('params not found');
      }
      req.params.id = '6503bfce5083f1a736205bad';
      (SchedulingModel.findOne as jest.Mock).mockResolvedValue(null);

      await verifyUser(req as Request, res as Response, next);

      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({
        msg: 'Schedule not found',
      });
    });

    it('should return bad request error if user is not allowed to change other users data', async () => {
      if (!req.user) {
        throw new Error('user not found');
      }
      if (!req.params) {
        throw new Error('params not found');
      }
      req.user.id = '6503bfce5083f1a736205bad';
      req.params.id = '6503bfce5083f1a736205bae';

      (SchedulingModel.findOne as jest.Mock).mockResolvedValue(true);

      await verifyUser(req as Request, res as Response, next);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        msg: 'You are not allowed to change other users data',
      });
    });
  });

  describe('returnUserID', () => {
    it('should return user id', () => {
      req.user = {
        id: '6503bfce5083f1a736205bad',
        name: 'Vinicius',
        role: 'student',
      };

      const result = returnUserID(req as Request);

      expect(result).toBe('6503bfce5083f1a736205bad');
    });

    it('should throw an error if user is not found', () => {
      req.user = {
        id: '6503bfce5083f1a736205bad',
        name: 'Vinicius',
        role: 'student',
      };
      req.user.id = null;
      expect(() => {
        returnUserID(req as Request);
      }).toThrow('User not found');
    });
  });
});
