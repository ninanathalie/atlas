-- AlterTable
ALTER TABLE "CVSection" ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
