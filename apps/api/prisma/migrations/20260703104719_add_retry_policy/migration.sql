/*
  Warnings:

  - You are about to drop the column `multiplier` on the `RetryPolicy` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "RetryPolicy_name_key";

-- AlterTable
ALTER TABLE "RetryPolicy" DROP COLUMN "multiplier",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "maxAttempts" DROP DEFAULT,
ALTER COLUMN "baseDelayMs" DROP DEFAULT,
ALTER COLUMN "maxDelayMs" DROP NOT NULL,
ALTER COLUMN "maxDelayMs" DROP DEFAULT;
