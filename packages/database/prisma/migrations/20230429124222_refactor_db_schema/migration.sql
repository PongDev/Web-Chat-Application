/*
  Warnings:

  - You are about to drop the column `channelId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `GroupRoomId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `DirectMessageRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupRoomUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `owner` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('DIRECT', 'GROUP');

-- DropForeignKey
ALTER TABLE "DirectMessageRoom" DROP CONSTRAINT "DirectMessageRoom_id_fkey";

-- DropForeignKey
ALTER TABLE "DirectMessageRoom" DROP CONSTRAINT "DirectMessageRoom_member1_fkey";

-- DropForeignKey
ALTER TABLE "DirectMessageRoom" DROP CONSTRAINT "DirectMessageRoom_member2_fkey";

-- DropForeignKey
ALTER TABLE "GroupRoom" DROP CONSTRAINT "GroupRoom_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupRoom" DROP CONSTRAINT "GroupRoom_owner_fkey";

-- DropForeignKey
ALTER TABLE "GroupRoomUser" DROP CONSTRAINT "GroupRoomUser_roomId_fkey";

-- DropForeignKey
ALTER TABLE "GroupRoomUser" DROP CONSTRAINT "GroupRoomUser_userId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "channelId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isJoinable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "type" "RoomType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "GroupRoomId";

-- DropTable
DROP TABLE "DirectMessageRoom";

-- DropTable
DROP TABLE "GroupRoom";

-- DropTable
DROP TABLE "GroupRoomUser";

-- CreateTable
CREATE TABLE "UserRoomMember" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "UserRoomMember_pkey" PRIMARY KEY ("userId","roomId")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoomMember" ADD CONSTRAINT "UserRoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoomMember" ADD CONSTRAINT "UserRoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
