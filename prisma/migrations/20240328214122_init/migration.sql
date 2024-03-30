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
CREATE UNIQUE INDEX "TemporaryVoice_owner_key" ON "TemporaryVoice"("owner");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
