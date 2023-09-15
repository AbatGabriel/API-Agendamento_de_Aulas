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
        
            await expect(authMiddleware(req as Request, res as Response, next)).rejects.toThrowError('No Token Provided!');
          });
        
          it('should throw an error if an invalid token is provided', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
              throw new Error('Token verification failed');
            });
        
            await expect(authMiddleware(req as Request, res as Response, next)).rejects.toThrowError('Not Autorized');
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
            //     if (!req.user || !req.user.role) {
            //         throw new Error('User or user role not found');
            //       }

            //     req.user.role = 'instructor';

            //     verifyRoles('student')(req as Request, res as Response, next);

            //    expect(res.status).toHaveBeenCalledWith(401);
            //    expect(res.json).toHaveBeenCalledWith({ msg: 'User not authorized' });
            //    expect(next).not.toHaveBeenCalled(); 
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

