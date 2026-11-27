-- Add account active state, defaulting existing and new accounts to active.
ALTER TABLE "financial_account" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
