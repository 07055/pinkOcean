import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// --- COMMENTS ---
export const addComment = async (req: Request, res: Response) => {
  const { sourceId, content } = req.body;
  const userId = (req as any).userId;

  try {
    const comment = await prisma.comment.create({
      data: { content, sourceId, authorId: userId }
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Failed to post comment" });
  }
};

// --- SAFETY: BLOCK USER ---
export const toggleBlock = async (req: Request, res: Response) => {
  const { blockedId } = req.body; // User to be blocked
  const blockerId = (req as any).userId;

  try {
    const existing = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } }
    });

    if (existing) {
      await prisma.block.delete({ where: { id: existing.id } });
      return res.status(200).json({ message: "User unblocked" });
    }

    await prisma.block.create({ data: { blockerId, blockedId } });
    res.status(201).json({ message: "User blocked" });
  } catch (err) {
    res.status(500).json({ message: "Block operation failed" });
  }
};

// --- SAFETY: REPORT CONTENT ---
export const reportSource = async (req: Request, res: Response) => {
  const { sourceId, reason, details } = req.body;
  const reporterId = (req as any).userId;

  try {
    await prisma.report.create({
      data: { sourceId, reporterId, reason, details }
    });
    res.status(201).json({ message: "Report submitted for review" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit report" });
  }
};