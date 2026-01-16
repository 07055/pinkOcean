import cron from "node-cron";
import { prisma } from "./prisma.js";

// This function checks for "trash" older than 14 days
export const startCleanupTask = () => {
  // Schedule to run every day at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("🧹 Running 14-day Trash Cleanup...");

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    try {
      const deleted = await prisma.source.deleteMany({
        where: {
          deletedAt: {
            lte: fourteenDaysAgo, // Find dates less than or equal to 14 days ago
          },
        },
      });

      if (deleted.count > 0) {
        console.log(`✅ Permanently deleted ${deleted.count} expired sources.`);
      }
    } catch (err) {
      console.error("❌ Cleanup task failed:", err);
    }
  });
};