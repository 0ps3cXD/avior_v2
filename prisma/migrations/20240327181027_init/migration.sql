-- CreateTable
CREATE TABLE "Users" (
    "username" TEXT NOT NULL,
    "id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Locked" (
    "id" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Locked_id_key" ON "Locked"("id");
