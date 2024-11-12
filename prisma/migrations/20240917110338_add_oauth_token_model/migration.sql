/*
  Warnings:

  - You are about to drop the column `accessToken` on the `OAuthToken` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `OAuthToken` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `OAuthToken` table. All the data in the column will be lost.
  - Added the required column `access_token` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry_date` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_type` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OAuthToken" DROP COLUMN "accessToken",
DROP COLUMN "expiryDate",
DROP COLUMN "tokenType",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "expiry_date" BIGINT NOT NULL,
ADD COLUMN     "token_type" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;
