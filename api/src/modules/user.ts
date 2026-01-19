import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// 1. Get a Profile (Public)
export const getProfile = async (req: Request, res: Response) => {
  const { username } = req.params;

  // TypeScript fix: Ensure username is a string before passing to Prisma
  if (typeof username !== 'string') {
    return res.status(400).json({ message: "Invalid username format" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        sources: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
        _count: { select: { followers: true, following: true, sources: true } }
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove password from the object before sending
    const { password, ...publicProfile } = user;
    res.json(publicProfile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// 2. Update Bio/Photo (Protected)
export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // From authenticateToken middleware
  const { bio, profilePic, banner, username } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { bio, profilePic, banner, username }
    });

    const { password, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// 3. Update Password (Protected)
export const updatePassword = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) return res.status(404).json({ message: "User not found" });

    // Uses bcryptjs (the pure JS version) to avoid Railway/Linux crashes
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
};