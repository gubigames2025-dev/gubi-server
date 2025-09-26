-- Script simples para adicionar valores aos enums
-- Execute estes comandos um por vez no banco de produção

-- Adicionar novos valores ao UserInterestsEnum
ALTER TYPE "UserInterestsEnum" ADD VALUE 'ciencias';
ALTER TYPE "UserInterestsEnum" ADD VALUE 'esportes';

-- Adicionar novos valores ao UserSkillsEnum  
ALTER TYPE "UserSkillsEnum" ADD VALUE 'pratica';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'teoria';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'criativa';
ALTER TYPE "UserSkillsEnum" ADD VALUE 'digital';

-- Verificar se os valores foram adicionados
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserInterestsEnum') ORDER BY enumlabel;
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserSkillsEnum') ORDER BY enumlabel;