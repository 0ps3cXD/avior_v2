-- CreateTable
CREATE TABLE "Guild" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_key_key" ON "Guild"("key");
