import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import zxcvbn from "zxcvbn";
import { prisma } from "../lib/prisma.js"; 

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 0. Password strength check: Reject if score is LESS than 3
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) { 
      return res.status(400).json({ message: "Password is too weak. Please use a stronger one." });
    }

    // 1. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    });

    return res.status(201).json({ 
      message: "User created!", 
      userId: newUser.id 
    });

  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Username or Email already taken" });
    }
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // Expects 'identifier' from frontend

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    });

    if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials!" });

    const age = 1000 * 60 * 60 * 24 * 7; // 1 week
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET_KEY!, 
      { expiresIn: "7d" }
    );

    const { password: _, ...userInfo } = user;

    // Send cookie AND return token in JSON for Zustand store
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: age,
      })
      .status(200)
      .json({ ...userInfo, token }); 

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};