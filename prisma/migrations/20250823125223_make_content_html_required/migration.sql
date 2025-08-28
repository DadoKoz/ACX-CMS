-- popuni postojeće NULL vrijednosti praznim stringom
UPDATE "Post" SET "contentHtml" = '' WHERE "contentHtml" IS NULL;

-- sada kolona može biti NOT NULL
ALTER TABLE "Post" ALTER COLUMN "contentHtml" SET NOT NULL;
