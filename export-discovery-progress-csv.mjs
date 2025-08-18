import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  errorFormat: 'pretty'
});

// Função para escapar valores CSV
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // Se contém vírgula, aspas ou quebra de linha, precisa escapar
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

async function exportDiscoveryProgressToCSV() {
  try {
    console.log('📊 Iniciando exportação da tabela DiscoveryProgress para CSV...');
    
    // Buscar todos os registros de DiscoveryProgress com informações do usuário
    const discoveryProgress = await prisma.discoveryProgress.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            country: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`✅ Encontrados ${discoveryProgress.length} registros de progresso`);
    
    // Definir cabeçalhos do CSV
    const headers = [
      'id',
      'userId',
      'userName',
      'userLastName',
      'userEmail',
      'userCountry',
      'userCreatedAt',
      'resume',
      'completedLevels',
      'completedLevelsCount',
      'answers',
      'answersCount',
      'answersFilledCount',
      'progressPercentage'
    ];
    
    // Criar conteúdo CSV
    let csvContent = headers.join(',') + '\n';
    
    // Processar cada registro
    discoveryProgress.forEach(progress => {
      // Contar respostas preenchidas (não vazias)
      const answersFilledCount = progress.answers ? progress.answers.filter(answer => answer && answer.trim() !== '').length : 0;
      const totalAnswers = progress.answers ? progress.answers.length : 0;
      const progressPercentage = totalAnswers > 0 ? ((answersFilledCount / totalAnswers) * 100).toFixed(1) : '0';
      
      const row = [
        escapeCSV(progress.id),
        escapeCSV(progress.userId),
        escapeCSV(progress.user?.name || ''),
        escapeCSV(progress.user?.lastName || ''),
        escapeCSV(progress.user?.email || ''),
        escapeCSV(progress.user?.country || ''),
        escapeCSV(progress.user?.createdAt ? progress.user.createdAt.toISOString().split('T')[0] : ''),
        escapeCSV(progress.resume || ''),
        escapeCSV(progress.completedLevels ? progress.completedLevels.join('; ') : ''),
        escapeCSV(progress.completedLevels ? progress.completedLevels.length : 0),
        escapeCSV(progress.answers ? progress.answers.join(' | ') : ''),
        escapeCSV(totalAnswers),
        escapeCSV(answersFilledCount),
        escapeCSV(progressPercentage + '%')
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Salvar arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `discovery_progress_export_${timestamp}.csv`;
    const filePath = path.join(process.cwd(), filename);
    
    fs.writeFileSync(filePath, csvContent, 'utf8');
    
    console.log(`✅ Arquivo CSV criado com sucesso!`);
    console.log(`📁 Localização: ${filePath}`);
    console.log(`📊 Total de registros exportados: ${discoveryProgress.length}`);
    console.log(`📝 Total de colunas: ${headers.length}`);
    
    // Estatísticas detalhadas
    const withResume = discoveryProgress.filter(p => p.resume && p.resume.trim() !== '').length;
    const withCompletedLevels = discoveryProgress.filter(p => p.completedLevels && p.completedLevels.length > 0).length;
    const withAnswers = discoveryProgress.filter(p => p.answers && p.answers.some(a => a && a.trim() !== '')).length;
    
    // Distribuição por níveis completados
    const levelStats = {};
    discoveryProgress.forEach(p => {
      if (p.completedLevels) {
        p.completedLevels.forEach(level => {
          levelStats[level] = (levelStats[level] || 0) + 1;
        });
      }
    });
    
    // Estatísticas de progresso
    const progressStats = {
      '0%': 0,
      '1-25%': 0,
      '26-50%': 0,
      '51-75%': 0,
      '76-99%': 0,
      '100%': 0
    };
    
    discoveryProgress.forEach(p => {
      const answersFilledCount = p.answers ? p.answers.filter(answer => answer && answer.trim() !== '').length : 0;
      const totalAnswers = p.answers ? p.answers.length : 0;
      const percentage = totalAnswers > 0 ? (answersFilledCount / totalAnswers) * 100 : 0;
      
      if (percentage === 0) progressStats['0%']++;
      else if (percentage <= 25) progressStats['1-25%']++;
      else if (percentage <= 50) progressStats['26-50%']++;
      else if (percentage <= 75) progressStats['51-75%']++;
      else if (percentage < 100) progressStats['76-99%']++;
      else progressStats['100%']++;
    });
    
    console.log(`\n📈 ESTATÍSTICAS DETALHADAS:`);
    console.log(`• Tamanho do arquivo: ${(fs.statSync(filePath).size / 1024).toFixed(2)} KB`);
    console.log(`• Com resumo gerado: ${withResume} (${((withResume/discoveryProgress.length)*100).toFixed(1)}%)`);
    console.log(`• Com níveis completados: ${withCompletedLevels} (${((withCompletedLevels/discoveryProgress.length)*100).toFixed(1)}%)`);
    console.log(`• Com respostas preenchidas: ${withAnswers} (${((withAnswers/discoveryProgress.length)*100).toFixed(1)}%)`);
    
    console.log(`\n🎮 DISTRIBUIÇÃO POR NÍVEIS COMPLETADOS:`);
    Object.entries(levelStats).forEach(([level, count]) => {
      console.log(`• ${level}: ${count} usuários`);
    });
    
    console.log(`\n📊 DISTRIBUIÇÃO DE PROGRESSO DAS RESPOSTAS:`);
    Object.entries(progressStats).forEach(([range, count]) => {
      console.log(`• ${range}: ${count} usuários (${((count/discoveryProgress.length)*100).toFixed(1)}%)`);
    });
    
    // Top 5 usuários com mais progresso
    const topUsers = discoveryProgress
      .map(p => {
        const answersFilledCount = p.answers ? p.answers.filter(answer => answer && answer.trim() !== '').length : 0;
        const totalAnswers = p.answers ? p.answers.length : 0;
        const percentage = totalAnswers > 0 ? (answersFilledCount / totalAnswers) * 100 : 0;
        return {
          name: `${p.user?.name || ''} ${p.user?.lastName || ''}`.trim(),
          email: p.user?.email || '',
          completedLevels: p.completedLevels?.length || 0,
          percentage: percentage,
          hasResume: !!(p.resume && p.resume.trim() !== '')
        };
      })
      .sort((a, b) => b.percentage - a.percentage || b.completedLevels - a.completedLevels)
      .slice(0, 5);
    
    console.log(`\n🏆 TOP 5 USUÁRIOS COM MAIS PROGRESSO:`);
    topUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'N/A'} (${user.email})`);
      console.log(`   • Progresso: ${user.percentage.toFixed(1)}% | Níveis: ${user.completedLevels} | Resumo: ${user.hasResume ? 'Sim' : 'Não'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao exportar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exportDiscoveryProgressToCSV();
