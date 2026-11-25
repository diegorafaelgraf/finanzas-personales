-- CreateTable
CREATE TABLE "account_holder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "financial_account_type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "currency_type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "currency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currencyTypeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    CONSTRAINT "currency_currencyTypeId_fkey" FOREIGN KEY ("currencyTypeId") REFERENCES "currency_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountHolderId" TEXT NOT NULL,
    "financialAccountTypeId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    CONSTRAINT "financial_account_accountHolderId_fkey" FOREIGN KEY ("accountHolderId") REFERENCES "account_holder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "financial_account_financialAccountTypeId_fkey" FOREIGN KEY ("financialAccountTypeId") REFERENCES "financial_account_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "financial_account_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "movement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "financialAccountId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "movement_financialAccountId_fkey" FOREIGN KEY ("financialAccountId") REFERENCES "financial_account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blue_dollar_rate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "usdArsBuy" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "dollar_currency_quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currencyId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "usdValue" REAL NOT NULL,
    CONSTRAINT "dollar_currency_quote_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "currency_currencyTypeId_code_key" ON "currency"("currencyTypeId", "code");

-- CreateIndex
CREATE INDEX "movement_financialAccountId_date_idx" ON "movement"("financialAccountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "blue_dollar_rate_date_key" ON "blue_dollar_rate"("date");

-- CreateIndex
CREATE UNIQUE INDEX "dollar_currency_quote_currencyId_date_key" ON "dollar_currency_quote"("currencyId", "date");
