import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// --- TOGGLE LIKE ---
export const toggleLike = async (req: Request, res: Response) => {
  const { sourceId } = req.body;
  const userId = (req as any).userId;

  try {
    const existing = await prisma.like.findUnique({
      where: { userId_sourceId: { userId, sourceId } }
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.status(200).json({ message: "Unliked" });
    }

    await prisma.like.create({ data: { userId, sourceId } });
    res.status(201).json({ message: "Liked" });
  } catch (err) {
    res.status(500).json({ message: "Action failed" });
  }
};

// --- TOGGLE MARK (Bookmark) ---
export const toggleMark = async (req: Request, res: Response) => {
  const { sourceId } = req.body;
  const userId = (req as any).userId;

  try {
    const existing = await prisma.mark.findUnique({
      where: { userId_sourceId: { userId, sourceId } }
    });

    if (existing) {
      await prisma.mark.delete({ where: { id: existing.id } });
      return res.status(200).json({ message: "Removed from marks" });
    }

    await prisma.mark.create({ data: { userId, sourceId } });
    res.status(201).json({ message: "Marked" });
  } catch (err) {
    res.status(500).json({ message: "Action failed" });
  }
};

// --- RECORD SHARE ---
export const recordShare = async (req: Request, res: Response) => {
  const { sourceId, platform } = req.body;
  const userId = (req as any).userId || null; // Share can be anonymous

  try {
    const share = await prisma.share.create({
      data: { sourceId, userId, platform }
    });
    res.status(201).json(share);
  } catch (err) {
    res.status(500).json({ message: "Failed to record share" });
  }
};

// --- RECORD DOWNLOAD ---
export const recordDownload = async (req: Request, res: Response) => {
  const { sourceId, device } = req.body;
  const userId = (req as any).userId || null;

  try {
    const download = await prisma.download.create({
      data: { 
        sourceId, 
        userId, 
        device, 
        ipAddress: req.ip 
      }
    });
    res.status(201).json(download);
  } catch (err) {
    res.status(500).json({ message: "Failed to record download" });
  }
};