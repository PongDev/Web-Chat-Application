-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_owner_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "name" TEXT,
ALTER COLUMN "owner" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
