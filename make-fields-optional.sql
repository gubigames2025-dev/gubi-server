-- Script SQL para tornar os campos location e gender opcionais
-- Execute estes comandos no banco de dados de produção

-- Tornar o campo gender opcional (nullable)
ALTER TABLE "User" ALTER COLUMN "gender" DROP NOT NULL;

-- Tornar o campo location opcional (nullable)
ALTER TABLE "User" ALTER COLUMN "location" DROP NOT NULL;

-- Verificar se as alterações foram aplicadas corretamente
-- Este comando mostra as colunas da tabela User e se elas permitem NULL
SELECT 
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns 
WHERE 
    table_name = 'User' 
    AND column_name IN ('gender', 'location')
ORDER BY 
    column_name;