-- CreateTable
CREATE TABLE "Team" (
    "username" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "permissionlevel" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "TemporaryVoice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_username_key" ON "Team"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Team_id_key" ON "Team"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryVoice_id_key" ON "TemporaryVoice"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryVoice_name_key" ON "TemporaryVoice"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryVoice_owner_key" ON "TemporaryVoice"("owner");
