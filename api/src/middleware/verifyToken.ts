import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: any, payload: any) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    (req as any).userId = payload.id;
    next();
  });
};