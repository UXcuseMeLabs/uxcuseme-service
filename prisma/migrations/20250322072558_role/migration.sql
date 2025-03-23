/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twitch_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleid` to the `platform_config_home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleid` to the `platform_config_inter_comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_twitch_id_key";

-- AlterTable
ALTER TABLE "platform_config_home" ADD COLUMN     "roleid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "platform_config_inter_comment" ADD COLUMN     "roleid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isAdmin",
DROP COLUMN "twitch_id",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "platform_config_inter_comment" ADD CONSTRAINT "platform_config_inter_comment_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_config_home" ADD CONSTRAINT "platform_config_home_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
