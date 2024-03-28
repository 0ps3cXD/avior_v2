-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "username" TEXT NOT NULL,
    "displayname" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "avatarurl" TEXT NOT NULL,
    "messagecount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Users" ("avatarurl", "displayname", "id", "username") SELECT "avatarurl", "displayname", "id", "username" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
