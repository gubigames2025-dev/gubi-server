-- CreateEnum/*

CREATE TYPE "WorkPreferenceEnum" AS ENUM ('estabilidade_financeira', 'equipe', 'ajudar', 'empreender', 'crescer', 'equilibrio');  Warnings:



-- AlterEnum  - Changed the type of `workPreference` on the `Interests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

ALTER TYPE "UserInterestsEnum" ADD VALUE 'ciencias';

ALTER TYPE "UserInterestsEnum" ADD VALUE 'esportes';*/

-- CreateEnum

-- AlterEnum  CREATE TYPE "WorkPreferenceEnum" AS ENUM ('estabilidade_financeira', 'equipe', 'ajudar', 'empreender', 'crescer', 'equilibrio');

ALTER TYPE "UserSkillsEnum" ADD VALUE 'pratica';

ALTER TYPE "UserSkillsEnum" ADD VALUE 'teoria';-- AlterEnum

ALTER TYPE "UserSkillsEnum" ADD VALUE 'criativa';-- This migration adds more than one value to an enum.

ALTER TYPE "UserSkillsEnum" ADD VALUE 'digital';-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

ALTER TYPE "UserInterestsEnum" ADD VALUE 'ciencias';
ALTER TYPE "UserInterestsEnum" ADD VALUE 'esportes';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

ALTER TYPE "UserSkillsEnum" ADD VALUE 'pratica';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'teoria';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'criativa';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'digital';

-- AlterTable
-- Step 1: Add new column as nullable
ALTER TABLE "Interests" ADD COLUMN "workPreference_new" "WorkPreferenceEnum";

-- Step 2: Update existing data with mapping
UPDATE "Interests" SET "workPreference_new" = 
  CASE 
    WHEN "workPreference" = 'equilibrio' THEN 'equilibrio'::WorkPreferenceEnum
    WHEN "workPreference" = 'presencial' THEN 'equilibrio'::WorkPreferenceEnum
    WHEN "workPreference" = 'remoto' THEN 'equilibrio'::WorkPreferenceEnum
    WHEN "workPreference" = 'hibrido' THEN 'equilibrio'::WorkPreferenceEnum
    ELSE 'equilibrio'::WorkPreferenceEnum
  END;

-- Step 3: Make new column NOT NULL
ALTER TABLE "Interests" ALTER COLUMN "workPreference_new" SET NOT NULL;

-- Step 4: Drop old column
ALTER TABLE "Interests" DROP COLUMN "workPreference";

-- Step 5: Rename new column
ALTER TABLE "Interests" RENAME COLUMN "workPreference_new" TO "workPreference";
