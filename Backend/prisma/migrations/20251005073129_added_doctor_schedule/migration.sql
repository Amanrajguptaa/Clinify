/*
  Warnings:

  - You are about to drop the column `availability` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `schedule` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "availability",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "schedule" JSONB NOT NULL;
