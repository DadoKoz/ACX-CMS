-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "author" TEXT,
ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "publishDate" TIMESTAMP(3),
ADD COLUMN     "readingTime" INTEGER,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'draft',
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "views" INTEGER DEFAULT 0;
