import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  errorFormat: 'pretty',
  log: ['info', 'warn', 'error']
});

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com o banco...');
    
    // Teste de conexão
    await prisma.$connect();
    console.log('✅ Conectado ao banco com sucesso!');
    
    // Consulta básica
    const userCount = await prisma.user.count();
    console.log(`📊 Total de usuários: ${userCount}`);
    
    // Últimos 5 usuários cadastrados
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        country: true,
        createdAt: true
      }
    });
    
    console.log('\n📋 Últimos 5 usuários cadastrados:');
    recentUsers.forEach(user => {
      console.log(`ID: ${user.id} | ${user.name} ${user.lastName} | ${user.email} | ${user.country} | ${user.createdAt.toISOString().split('T')[0]}`);
    });
    
    // Estatísticas por país
    const usersByCountry = await prisma.user.groupBy({
      by: ['country'],
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      }
    });
    
    console.log('\n🌍 Usuários por país:');
    usersByCountry.forEach(stat => {
      console.log(`${stat.country}: ${stat._count.country} usuários`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
