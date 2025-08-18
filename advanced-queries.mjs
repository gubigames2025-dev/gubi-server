import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  errorFormat: 'pretty'
});

async function advancedQueries() {
  try {
    console.log('🔍 CONSULTAS AVANÇADAS NA TABELA USER\n');
    
    // 1. Estatísticas gerais
    console.log('📊 ESTATÍSTICAS GERAIS:');
    const totalUsers = await prisma.user.count();
    const usersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    
    const usersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    console.log(`Total de usuários: ${totalUsers}`);
    console.log(`Cadastros hoje: ${usersToday}`);
    console.log(`Cadastros esta semana: ${usersThisWeek}`);
    
    // 2. Distribuição por gênero
    console.log('\n👥 DISTRIBUIÇÃO POR GÊNERO:');
    const genderStats = await prisma.user.groupBy({
      by: ['gender'],
      _count: { gender: true },
      orderBy: { _count: { gender: 'desc' } }
    });
    
    genderStats.forEach(stat => {
      console.log(`${stat.gender}: ${stat._count.gender} usuários`);
    });
    
    // 3. Top 10 países
    console.log('\n🌍 TOP 10 PAÍSES:');
    const countryStats = await prisma.user.groupBy({
      by: ['country'],
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10
    });
    
    countryStats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.country}: ${stat._count.country} usuários`);
    });
    
    // 4. Cadastros por dia (últimos 7 dias)
    console.log('\n📅 CADASTROS ÚLTIMOS 7 DIAS:');
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });
      
      console.log(`${startOfDay.toISOString().split('T')[0]}: ${count} cadastros`);
    }
    
    // 5. Usuários com progresso no Discovery
    console.log('\n🎮 PROGRESSO NO DISCOVERY:');
    const usersWithProgress = await prisma.user.count({
      where: {
        discoveryProgress: {
          isNot: null
        }
      }
    });
    
    const usersWithResume = await prisma.user.count({
      where: {
        discoveryProgress: {
          resume: {
            not: null
          }
        }
      }
    });
    
    console.log(`Usuários com progresso iniciado: ${usersWithProgress}`);
    console.log(`Usuários com resumo gerado: ${usersWithResume}`);
    
    // 6. Últimos 10 usuários detalhados
    console.log('\n👤 ÚLTIMOS 10 USUÁRIOS (DETALHADO):');
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        country: true,
        gender: true,
        location: true,
        createdAt: true,
        discoveryProgress: {
          select: {
            completedLevels: true,
            resume: true
          }
        }
      }
    });
    
    recentUsers.forEach(user => {
      const hasProgress = user.discoveryProgress?.completedLevels?.length > 0;
      const hasResume = !!user.discoveryProgress?.resume;
      console.log(`
ID: ${user.id}
Nome: ${user.name} ${user.lastName}
Email: ${user.email}
País: ${user.country} | Gênero: ${user.gender}
Localização: ${user.location}
Cadastro: ${user.createdAt.toISOString().split('T')[0]}
Discovery: ${hasProgress ? `${user.discoveryProgress.completedLevels.length} níveis` : 'Não iniciado'} | Resumo: ${hasResume ? 'Sim' : 'Não'}
---`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

advancedQueries();
