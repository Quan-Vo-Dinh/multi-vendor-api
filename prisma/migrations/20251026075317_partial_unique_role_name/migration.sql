-- DropIndex
DROP INDEX "public"."Role_name_key";

CREATE UNIQUE INDEX role_name_unique_not_deleted
ON "Role" ("name")
WHERE "deletedAt" IS NULL;