/*
  Warnings:

  - A unique constraint covering the columns `[storeId,name]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_storeId_name_key" ON "ApiKey"("storeId", "name");
