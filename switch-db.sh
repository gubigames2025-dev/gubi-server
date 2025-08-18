#!/bin/bash

# Script para alternar entre bancos de desenvolvimento e produção

if [ "$1" = "dev" ]; then
    echo "Configurando para banco de DESENVOLVIMENTO..."
    sed -i.bak 's/^DATABASE_URL=.*/DATABASE_URL="postgresql:\/\/postgres:1324@localhost:5432\/gubi-db"/' .env
    echo "✅ Configurado para desenvolvimento"
elif [ "$1" = "prod" ]; then
    echo "Configurando para banco de PRODUÇÃO..."
    sed -i.bak 's/^DATABASE_URL=.*/DATABASE_URL="postgresql:\/\/gubi_admin:CByosvAUQogg@gubi-server-db.c3ooiksq0gbb.us-east-2.rds.amazonaws.com:5432\/gubi_db"/' .env
    echo "✅ Configurado para produção"
else
    echo "Uso: ./switch-db.sh [dev|prod]"
    echo "  dev  - Configura para banco de desenvolvimento"
    echo "  prod - Configura para banco de produção"
fi

echo ""
echo "DATABASE_URL atual:"
grep "^DATABASE_URL=" .env
