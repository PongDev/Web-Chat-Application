-- AlterTable
ALTER TABLE "User" ADD COLUMN     "GroupRoomId" TEXT;

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessageRoom" (
    "id" TEXT NOT NULL,
    "member1" TEXT NOT NULL,
    "member2" TEXT NOT NULL,

    CONSTRAINT "DirectMessageRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "GroupRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupRoomUser" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirectMessageRoom_id_key" ON "DirectMessageRoom"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DirectMessageRoom_member1_member2_key" ON "DirectMessageRoom"("member1", "member2");

-- CreateIndex
CREATE UNIQUE INDEX "GroupRoom_id_key" ON "GroupRoom"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupRoomUser_userId_roomId_key" ON "GroupRoomUser"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "DirectMessageRoom" ADD CONSTRAINT "DirectMessageRoom_member1_fkey" FOREIGN KEY ("member1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessageRoom" ADD CONSTRAINT "DirectMessageRoom_member2_fkey" FOREIGN KEY ("member2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessageRoom" ADD CONSTRAINT "DirectMessageRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRoom" ADD CONSTRAINT "GroupRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRoom" ADD CONSTRAINT "GroupRoom_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRoomUser" ADD CONSTRAINT "GroupRoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRoomUser" ADD CONSTRAINT "GroupRoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "GroupRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
