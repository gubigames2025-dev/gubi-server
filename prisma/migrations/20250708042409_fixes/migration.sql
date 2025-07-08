/*
  Warnings:

  - The `userInterests` column on the `Interests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userSkills` column on the `Interests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `softSkills` column on the `Skills` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `skillsToImprove` column on the `Skills` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hardSkills` column on the `Skills` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserInterestsEnum" AS ENUM ('saude', 'tecnologia', 'negocios', 'engenharia', 'arte_design', 'comunicacao', 'meio_ambiente', 'educacao', 'empreendedorismo', 'financas');

-- CreateEnum
CREATE TYPE "UserSkillsEnum" AS ENUM ('comunicacao', 'organizacao', 'criatividade', 'logica', 'lideranca', 'adaptabilidade', 'trabalho_equipe', 'idiomas', 'programacao', 'excel', 'ferramentas_digitais', 'resolucao_problemas');

-- CreateEnum
CREATE TYPE "SoftSkillsEnum" AS ENUM ('comunicacao', 'criatividade', 'persistencia', 'organizacao', 'trabalho_equipe', 'empatia', 'lideranca', 'flexibilidade', 'resolucao_problemas', 'inteligencia_emocional');

-- CreateEnum
CREATE TYPE "HardSkillsEnum" AS ENUM ('excel', 'power_bi', 'canva', 'python', 'banco_dados', 'atendimento_cliente', 'criacao_conteudo', 'vendas', 'design_grafico', 'nenhuma');

-- AlterTable
ALTER TABLE "Interests" DROP COLUMN "userInterests",
ADD COLUMN     "userInterests" "UserInterestsEnum"[],
DROP COLUMN "userSkills",
ADD COLUMN     "userSkills" "UserSkillsEnum"[];

-- AlterTable
ALTER TABLE "Skills" DROP COLUMN "softSkills",
ADD COLUMN     "softSkills" "SoftSkillsEnum"[],
DROP COLUMN "skillsToImprove",
ADD COLUMN     "skillsToImprove" "SoftSkillsEnum"[],
DROP COLUMN "hardSkills",
ADD COLUMN     "hardSkills" "HardSkillsEnum"[];

-- DropEnum
DROP TYPE "HardSkillEnum";

-- DropEnum
DROP TYPE "SoftSkillEnum";

-- DropEnum
DROP TYPE "UserInterestEnum";

-- DropEnum
DROP TYPE "UserSkillEnum";
