CREATE UNIQUE INDEX email_unique_not_deleted
ON "User" ("email")
WHERE "deletedAt" IS NULL;