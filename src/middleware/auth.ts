import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// Middleware for authentication with JWT token
async function authMiddleware(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    throw new Error('No Token Provided!');
  }

  const token: string = auth.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET
      ? process.env.JWT_SECRET
: '5c7ee2074b65853f71fc5a01ce194ff26deedf6daacdb715c6beefdfd3f31b35';

    const { id, name, role }: any = jwt.verify(token, secret);
    req.user = { id, name, role };
    next();
  } catch (error) {
    throw new Error('Not Autorized');
  }
};

// Verify roles of user for route authorization
function verifyRoles(...roles: string[]) {
  return (req: Request | any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'User not authorized' });
      throw new Error('Unauthorized');
    }
    next();
  };
}

// Verifies if user can has permission for some routes that it's id needs to be the same of params
function verifyUser(req: Request | any, res: Response, next: NextFunction) {
  if (req.user.id === req.params.id) {
    next();
  } else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'You are not allowed to change other users data' });
  }
}

export { authMiddleware, verifyRoles, verifyUser };
