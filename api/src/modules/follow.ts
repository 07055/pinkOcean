import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const toggleFollow = async (req: Request, res: Response) => {
  const { followingId } = req.body; // The person you want to follow
  const followerId = (req as any).userId; // You

  if (followerId === followingId) return res.status(400).json({ message: "Cannot follow self" });

  try {
    const existing = await prisma.follows.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (existing) {
      await prisma.follows.delete({
        where: { followerId_followingId: { followerId, followingId } }
      });
      return res.status(200).json({ message: "Unfollowed" });
    }

    await prisma.follows.create({
      data: { followerId, followingId }
    });
    res.status(201).json({ message: "Followed" });
  } catch (err) {
    res.status(500).json({ message: "Follow action failed" });
  }
};