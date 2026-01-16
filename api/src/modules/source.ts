import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/index.js"; 

// --- CREATE STANDARD SOURCE ---
export const createSource = async (req: Request, res: Response) => {
  const { title, synopsis, content, media, tags } = req.body;
  const userId = (req as any).userId;

  try {
    const source = await prisma.source.create({
      data: {
        title,
        synopsis,
        content,
        media,
        tags: tags ? { set: tags } : undefined,
        authorId: userId,
      },
    });
    res.status(201).json(source);
  } catch (err) {
    res.status(500).json({ message: "Could not create source" });
  }
};

// --- CREATE POSTER SOURCE (From Navbar Designer) ---
export const createPosterSource = async (req: Request, res: Response) => {
  const { title, content, media, tags, designData } = req.body;
  const userId = (req as any).userId;

  try {
    const poster = await prisma.source.create({
      data: {
        title,
        content,
        media,
        tags: tags ? { set: tags } : undefined,
        isDesign: true,
        designData: designData as Prisma.InputJsonValue,
        authorId: userId,
      },
    });
    res.status(201).json(poster);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save poster design" });
  }
};

// --- GET ALL (Feed) ---
export const getSources = async (_req: Request, res: Response) => {
  try {
    const sources = await prisma.source.findMany({
      where: { deletedAt: null },
      include: {
        author: { select: { username: true, profilePic: true } },
        _count: { select: { likes: true, comments: true, shares: true ,marks: true} }
      },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(sources);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sources" });
  }
};

// --- GET SINGLE SOURCE ---
export const getSource = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const source = await prisma.source.findUnique({
      where: { id },
      include: { author: true }
    });
    
    if (!source || source.deletedAt) return res.status(404).json({ message: "Source not found" });
    
    res.status(200).json(source);
  } catch (err) {
    res.status(500).json({ message: "Error fetching source" });
  }
};

// --- EDIT SOURCE ---
export const updateSource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, synopsis, content, tags } = req.body;
  const userId = (req as any).userId;

  try {
    const source = await prisma.source.findUnique({ where: { id } });
    if (source?.authorId !== userId) return res.status(403).json({ message: "Not Authorized" });

    const updated = await prisma.source.update({
      where: { id },
      data: { 
        title, 
        synopsis, 
        content,
        tags: tags ? { set: tags } : undefined,
      }
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// --- TRASH (14-Day Soft Delete) ---
export const trashSource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const source = await prisma.source.findUnique({ where: { id } });
    if (source?.authorId !== userId) return res.status(403).json({ message: "Not Authorized" });

    await prisma.source.update({
      where: { id },
      data: { deletedAt: new Date() } 
    });
    res.status(200).json({ message: "Moved to Trash. It will be permanently deleted in 14 days." });
  } catch (err) {
    res.status(500).json({ message: "Failed to trash source" });
  }
};

// --- HARD DELETE ---
export const hardDeleteSource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const source = await prisma.source.findUnique({ where: { id } });
    if (source?.authorId !== userId) return res.status(403).json({ message: "Not Authorized" });

    await prisma.source.delete({ where: { id } });
    res.status(200).json({ message: "Permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: "Permanent delete failed" });
  }
};
export const saveDesignPoster = async (req: Request, res: Response) => {
  const { title, designData, media } = req.body;
  const userId = (req as any).userId;

  try {
    const poster = await prisma.source.create({
      data: {
        title: title || "Untitled Poster",
        content: "Created with Pink Ocean Designer",
        isDesign: true,
        designData, // This stores the shapes and text positions
        media,      // The final flattened image or background image
        authorId: userId,
      }
    });
    res.status(201).json(poster);
  } catch (err) {
    res.status(500).json({ message: "Failed to save design" });
  }
};

// --- SEARCH SOURCES ---
export const searchSources = async (req: Request, res: Response) => {
  const { q } = req.query; // e.g., /sources/search?q=ocean

  if (!q) return res.status(400).json({ message: "Search query is required" });

  try {
    const results = await prisma.source.findMany({
      where: {
        deletedAt: null,
        OR: [
          { title: { contains: String(q), mode: 'insensitive' } },
          { content: { contains: String(q), mode: 'insensitive' } },
          { tags: { has: String(q) } } // Perfectly matches tags in your string array
        ]
      },
      include: {
        author: { select: { username: true, profilePic: true } },
        _count: { select: { likes: true, comments: true, marks: true } }
      },
      take: 20 // Limit results for better performance
    });

    res.status(200).json(results);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Search operation failed" });
  }
};