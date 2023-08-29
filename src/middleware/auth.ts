import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

async function authMiddleware(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("No Token Provided!");
  }

  const token: string = auth.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET
      ? process.env.JWT_SECRET
      : "5c7ee2074b65853f71fc5a01ce194ff26deedf6daacdb715c6beefdfd3f31b35";

    const { id, nome, role }: any = jwt.verify(token, secret);
    req.user = { id, nome, role };
    next();
  } catch (error) {
    throw new Error("Not Autorized");
  }
}

function verifyRoles(...roles: string[]) {
  return (req: Request | any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      res.status(StatusCodes.UNAUTHORIZED).json({ msg: "User not authorized" });
      throw new Error("Unauthorized");
    }
    next();
  };
}

export { authMiddleware, verifyRoles };
