CREATE UNIQUE INDEX permission_method_path_unique_not_deleted
ON "Permission" ("method", "path")
WHERE "deletedAt" IS NULL;

-- This index ensures that the combination of 'method' and 'path' in the 'Permission' table