-- 1️⃣ Dodaj nove kolone (nullable, sigurno)
ALTER TABLE "Post"
ADD COLUMN IF NOT EXISTS "category" TEXT,
ADD COLUMN IF NOT EXISTS "image" TEXT,
ADD COLUMN IF NOT EXISTS "summary" TEXT;

-- 2️⃣ Popuni authorId za postojeće postove koji su NULL
-- Zamijeni '<admin-user-id>' sa stvarnim ID-em admina
UPDATE "Post"
SET "authorId" = '<admin-user-id>'
WHERE "authorId" IS NULL;

-- 3️⃣ Promijeni tip content u JSONB
-- Prvo dodaj privremenu kolonu
ALTER TABLE "Post" ADD COLUMN "content_tmp" JSONB;

-- Pretvori postojeći tekst u JSON string (ako je već HTML/tekst, wrap u JSON string)
UPDATE "Post" SET "content_tmp" = to_jsonb("content"::text);

-- Obriši staru kolonu i preimenuj novu
ALTER TABLE "Post" DROP COLUMN "content";
ALTER TABLE "Post" RENAME COLUMN "content_tmp" TO "content";

-- 4️⃣ Postavi authorId NOT NULL
ALTER TABLE "Post"
ALTER COLUMN "authorId" SET NOT NULL;

