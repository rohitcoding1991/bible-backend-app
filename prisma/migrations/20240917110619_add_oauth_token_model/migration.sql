/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `OAuthToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OAuthToken" DROP COLUMN "refreshToken";
