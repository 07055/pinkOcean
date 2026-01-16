import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const logActivity = async (req: Request, res: Response) => {
  const { sourceId, type, duration } = req.body; 
  // type can be: "VIEW", "WATCH_TIME", "DOWNLOAD_INITIATED"
  const userId = (req as any).userId || null; // Can track guests too

  try {
    await prisma.userActivity.create({
      data: {
        type,
        duration, // e.g., how many seconds they looked at a poster
        sourceId,
        userId
      }
    });
    res.status(204).send(); // No content needed back, just a silent log
  } catch (err) {
    // We don't want the user to see errors if logging fails
    console.error("ML Log Error:", err);
    res.status(200).send(); 
  }
};