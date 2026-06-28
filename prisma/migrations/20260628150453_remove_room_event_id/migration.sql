/*
  Warnings:

  - You are about to drop the column `event_id` on the `rooms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_event_id_fkey";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "event_id";
