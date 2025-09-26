-- Migração manual para adicionar valores aos enums em produção
-- Execute estes comandos SQL diretamente no banco de produção

-- Verificar se os valores já existem primeiro
DO $$
BEGIN
    -- Adicionar ciencias se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'ciencias' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserInterestsEnum')
    ) THEN
        ALTER TYPE "UserInterestsEnum" ADD VALUE 'ciencias';
        RAISE NOTICE 'Added ciencias to UserInterestsEnum';
    ELSE
        RAISE NOTICE 'ciencias already exists in UserInterestsEnum';
    END IF;

    -- Adicionar esportes se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'esportes' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserInterestsEnum')
    ) THEN
        ALTER TYPE "UserInterestsEnum" ADD VALUE 'esportes';
        RAISE NOTICE 'Added esportes to UserInterestsEnum';
    ELSE
        RAISE NOTICE 'esportes already exists in UserInterestsEnum';
    END IF;

    -- Adicionar pratica se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'pratica' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserSkillsEnum')
    ) THEN
        ALTER TYPE "UserSkillsEnum" ADD VALUE 'pratica';
        RAISE NOTICE 'Added pratica to UserSkillsEnum';
    ELSE
        RAISE NOTICE 'pratica already exists in UserSkillsEnum';
    END IF;

    -- Adicionar teoria se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'teoria' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserSkillsEnum')
    ) THEN
        ALTER TYPE "UserSkillsEnum" ADD VALUE 'teoria';
        RAISE NOTICE 'Added teoria to UserSkillsEnum';
    ELSE
        RAISE NOTICE 'teoria already exists in UserSkillsEnum';
    END IF;

    -- Adicionar criativa se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'criativa' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserSkillsEnum')
    ) THEN
        ALTER TYPE "UserSkillsEnum" ADD VALUE 'criativa';
        RAISE NOTICE 'Added criativa to UserSkillsEnum';
    ELSE
        RAISE NOTICE 'criativa already exists in UserSkillsEnum';
    END IF;

    -- Adicionar digital se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'digital' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserSkillsEnum')
    ) THEN
        ALTER TYPE "UserSkillsEnum" ADD VALUE 'digital';
        RAISE NOTICE 'Added digital to UserSkillsEnum';
    ELSE
        RAISE NOTICE 'digital already exists in UserSkillsEnum';
    END IF;

END $$;