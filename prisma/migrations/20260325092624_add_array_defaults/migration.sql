-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "techStack" SET DEFAULT ARRAY[]::TEXT[];
