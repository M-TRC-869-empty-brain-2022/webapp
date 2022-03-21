/*
  Warnings:

  - Made the column `todoListId` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `TodoList` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "todoListId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TodoList" ALTER COLUMN "userId" SET NOT NULL;
