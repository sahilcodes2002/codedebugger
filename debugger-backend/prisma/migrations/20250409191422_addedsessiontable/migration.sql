/*
  Warnings:

  - Added the required column `session_id` to the `Code` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Code_student_id_key";

-- AlterTable
ALTER TABLE "Code" ADD COLUMN     "session_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_student_id_key" ON "Session"("student_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
