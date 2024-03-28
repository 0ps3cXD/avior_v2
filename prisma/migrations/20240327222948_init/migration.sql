/*
  Warnings:

  - A unique constraint covering the columns `[owner]` on the table `TemporaryVoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemporaryVoice_owner_key" ON "TemporaryVoice"("owner");
