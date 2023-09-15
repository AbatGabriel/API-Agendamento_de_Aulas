import { authMiddleware, verifyRoles, verifyUser } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
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

    jest.mock('jsonwebtoken', () => ({
        verify: jest.fn(),
    }));

    describe('authMiddleware', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: jest.Mock<NextFunction>;
      
        beforeEach(() => {
          req = {
            headers: {
              authorization: 'Bearer yourTokenHere', // Substitua com o token correto para o teste
            },
          };
          res = {
            status: jest.fn(),
            json: jest.fn(),
          };
          next = jest.fn();
        });
      
        it('should use JWT_SECRET if available', async () => {
          process.env.JWT_SECRET = 'yourCustomSecret';
      
          // Mock jwt.verify to return a valid user object
          jest.spyOn(jwt, 'verify').mockReturnValueOnce(undefined);
      
          await authMiddleware(req as Request, res as Response, next);
      
          expect(next).toHaveBeenCalled();
        });
      
        it('should use default secret if JWT_SECRET is not available', async () => {
          delete process.env.JWT_SECRET;
      
          // Mock jwt.verify to return a valid user object
          jest.spyOn(jwt, 'verify').mockReturnValueOnce(undefined);
      
          await authMiddleware(req as Request, res as Response, next);
      
          expect(next).toHaveBeenCalled();
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
            } as unknown as Request
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn() as any,
            };
            next = jest.fn();

        });

        it('should return unauthorized error if user does not have the required role', () => {
            const middleware = verifyRoles('instructor')
            expect(() => {
                middleware(req as Request, res as Response, next)
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
                    role: ''
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

        it('should call next if user is allowed to change their own data', () => {
            if (!req.user) {
                throw new Error('user not found');
            };
            if (!req.params) {
                throw new Error('params not found');
            };
            req.user.id = 'user123';
            req.params.id = 'user123';

            verifyUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return bad request error if user is not allowed to change other users data', () => {
            if (!req.user) {
                throw new Error('user not found');
            };
            if (!req.params) {
                throw new Error('params not found');
            };

            req.user.id = 'user123';
            req.params.id = 'otherUser123';


            res.json = jest.fn();

            verifyUser(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'You are not allowed to change other users data' });
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

});
function getToken(authHeader: string) {
    throw new Error('Function not implemented.');
}

