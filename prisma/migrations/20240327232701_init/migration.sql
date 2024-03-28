/*
  Warnings:

  - Added the required column `avatarurl` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayname` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "username" TEXT NOT NULL,
    "displayname" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "avatarurl" TEXT NOT NULL
);
INSERT INTO "new_Users" ("id", "username") SELECT "id", "username" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
