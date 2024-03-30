/*
  Warnings:

  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Team_id_key";

-- DropIndex
DROP INDEX "Team_username_key";

-- DropIndex
DROP INDEX "Users_id_key";

-- DropIndex
DROP INDEX "Users_username_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Team";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "displayname" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "avatarurl" TEXT NOT NULL,
    "messagecount" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Guild" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TemporaryVoice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_TemporaryVoice" ("id", "name", "owner") SELECT "id", "name", "owner" FROM "TemporaryVoice";
DROP TABLE "TemporaryVoice";
ALTER TABLE "new_TemporaryVoice" RENAME TO "TemporaryVoice";
CREATE UNIQUE INDEX "TemporaryVoice_id_key" ON "TemporaryVoice"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_key_key" ON "Guild"("key");
