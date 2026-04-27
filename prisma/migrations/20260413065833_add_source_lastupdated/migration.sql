-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Counselor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Unknown',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Counselor" ("email", "id", "name", "phone", "role", "school") SELECT "email", "id", "name", "phone", "role", "school" FROM "Counselor";
DROP TABLE "Counselor";
ALTER TABLE "new_Counselor" RENAME TO "Counselor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
