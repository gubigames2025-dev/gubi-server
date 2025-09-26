-- Add new values to UserInterestsEnum
ALTER TYPE "UserInterestsEnum" ADD VALUE 'ciencias';
ALTER TYPE "UserInterestsEnum" ADD VALUE 'esportes';

-- Add new values to UserSkillsEnum
ALTER TYPE "UserSkillsEnum" ADD VALUE 'pratica';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'teoria';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'criativa';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'digital';

-- Create WorkPreferenceEnum
CREATE TYPE "WorkPreferenceEnum" AS ENUM ('estabilidade_financeira', 'equipe', 'ajudar', 'empreender', 'crescer', 'equilibrio');
