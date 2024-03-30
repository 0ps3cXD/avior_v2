/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
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

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
