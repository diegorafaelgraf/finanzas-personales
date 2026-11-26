-- CreateTable
CREATE TABLE "movement_type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- Seed fixed movement types.
INSERT INTO "movement_type" ("id", "code", "name") VALUES
    ('00000000-0000-4000-8000-000000000001', 'EXPENSE', 'Expense'),
    ('00000000-0000-4000-8000-000000000002', 'INCOME', 'Income'),
    ('00000000-0000-4000-8000-000000000003', 'TRANSFER', 'Transfer'),
    ('00000000-0000-4000-8000-000000000004', 'SALE', 'Sale'),
    ('00000000-0000-4000-8000-000000000005', 'OTHER', 'Other');

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- Rebuild the movement table to add its required type relation.
CREATE TABLE "new_movement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "financialAccountId" TEXT NOT NULL,
    "movementTypeId" TEXT NOT NULL,
    "operationId" TEXT,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    CONSTRAINT "movement_financialAccountId_fkey" FOREIGN KEY ("financialAccountId") REFERENCES "financial_account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movement_movementTypeId_fkey" FOREIGN KEY ("movementTypeId") REFERENCES "movement_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_movement" (
    "id",
    "financialAccountId",
    "movementTypeId",
    "date",
    "amount",
    "description"
)
SELECT
    "id",
    "financialAccountId",
    '00000000-0000-4000-8000-000000000005',
    "date",
    "amount",
    "description"
FROM "movement";

DROP TABLE "movement";
ALTER TABLE "new_movement" RENAME TO "movement";

-- CreateTable
CREATE TABLE "expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "movementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "expense_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "movement" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "movement_type_code_key" ON "movement_type"("code");
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");
CREATE INDEX "movement_financialAccountId_date_idx" ON "movement"("financialAccountId", "date");
CREATE INDEX "movement_operationId_idx" ON "movement"("operationId");
CREATE UNIQUE INDEX "expense_movementId_key" ON "expense"("movementId");
CREATE INDEX "expense_categoryId_idx" ON "expense"("categoryId");
