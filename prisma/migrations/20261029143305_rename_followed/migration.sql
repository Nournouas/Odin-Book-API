-- Rename column (keeps existing data)
ALTER TABLE "Follows" RENAME COLUMN "followedById" TO "followedId";

-- Rename the index and foreign key so they match what Prisma expects
ALTER INDEX "Follows_followedById_idx" RENAME TO "Follows_followedId_idx";
ALTER TABLE "Follows" RENAME CONSTRAINT "Follows_followedById_fkey" TO "Follows_followedId_fkey";