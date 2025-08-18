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

// Função para formatar data
function formatDate(date) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

async function exportUsersToCSV() {
  try {
    console.log('📊 Iniciando exportação dos usuários para CSV...');
    
    // Buscar todos os usuários com todas as informações relacionadas
    const users = await prisma.user.findMany({
      include: {
        interests: true,
        education: true,
        employment: true,
        skills: true,
        challenges: true,
        socioeconomic: true,
        completion: true,
        discoveryProgress: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`✅ Encontrados ${users.length} usuários`);
    
    // Definir cabeçalhos do CSV
    const headers = [
      // Dados básicos do usuário
      'id',
      'name',
      'lastName',
      'email',
      'country',
      'phoneNumber',
      'birthDate',
      'gender',
      'customGender',
      'location',
      'createdAt',
      
      // Interesses
      'userInterests',
      'customInterest',
      'workPreference',
      'workEnvironment',
      'companyType',
      'userSkills',
      'customSkill',
      
      // Educação
      'grade',
      'wantsFaculty',
      'currentInstitution',
      'institution',
      'courseName',
      'startCourseDate',
      'endCourseDate',
      'studyFormat',
      'needsFinancialSupport',
      'wantsFinancialInfo',
      
      // Emprego
      'twoYearGoals',
      'workWhileStudying',
      'hasInternshipExperience',
      
      // Habilidades
      'softSkills',
      'skillsToImprove',
      'hardSkills',
      'learningPreference',
      'studyFrequency',
      
      // Desafios
      'currentDifficulties',
      'thoughtAboutQuitting',
      'internetAccess',
      'availableDevices',
      
      // Socioeconômico
      'participatesInSocialProgram',
      'socialProgram',
      'householdSize',
      'peopleWithIncome',
      
      // Conclusão
      'howFoundUs',
      'customHowFoundUs',
      'acceptsTerms',
      'acceptsDataUsage',
      
      // Progresso Discovery
      'resume',
      'completedLevels',
      'answersCount'
    ];
    
    // Criar conteúdo CSV
    let csvContent = headers.join(',') + '\n';
    
    // Processar cada usuário
    users.forEach(user => {
      const row = [
        // Dados básicos
        escapeCSV(user.id),
        escapeCSV(user.name),
        escapeCSV(user.lastName),
        escapeCSV(user.email),
        escapeCSV(user.country),
        escapeCSV(user.phoneNumber),
        formatDate(user.birthDate),
        escapeCSV(user.gender),
        escapeCSV(user.customGender),
        escapeCSV(user.location),
        formatDate(user.createdAt),
        
        // Interesses
        escapeCSV(user.interests?.userInterests?.join('; ') || ''),
        escapeCSV(user.interests?.customInterest || ''),
        escapeCSV(user.interests?.workPreference || ''),
        escapeCSV(user.interests?.workEnvironment || ''),
        escapeCSV(user.interests?.companyType || ''),
        escapeCSV(user.interests?.userSkills?.join('; ') || ''),
        escapeCSV(user.interests?.customSkill || ''),
        
        // Educação
        escapeCSV(user.education?.grade || ''),
        escapeCSV(user.education?.wantsFaculty || ''),
        escapeCSV(user.education?.currentInstitution || ''),
        escapeCSV(user.education?.institution || ''),
        escapeCSV(user.education?.courseName || ''),
        escapeCSV(user.education?.startCourseDate || ''),
        escapeCSV(user.education?.endCourseDate || ''),
        escapeCSV(user.education?.studyFormat || ''),
        escapeCSV(user.education?.needsFinancialSupport || ''),
        escapeCSV(user.education?.wantsFinancialInfo || ''),
        
        // Emprego
        escapeCSV(user.employment?.twoYearGoals?.join('; ') || ''),
        escapeCSV(user.employment?.workWhileStudying || ''),
        escapeCSV(user.employment?.hasInternshipExperience || ''),
        
        // Habilidades
        escapeCSV(user.skills?.softSkills?.join('; ') || ''),
        escapeCSV(user.skills?.skillsToImprove?.join('; ') || ''),
        escapeCSV(user.skills?.hardSkills?.join('; ') || ''),
        escapeCSV(user.skills?.learningPreference || ''),
        escapeCSV(user.skills?.studyFrequency || ''),
        
        // Desafios
        escapeCSV(user.challenges?.currentDifficulties?.join('; ') || ''),
        escapeCSV(user.challenges?.thoughtAboutQuitting || ''),
        escapeCSV(user.challenges?.internetAccess || ''),
        escapeCSV(user.challenges?.availableDevices?.join('; ') || ''),
        
        // Socioeconômico
        escapeCSV(user.socioeconomic?.participatesInSocialProgram || ''),
        escapeCSV(user.socioeconomic?.socialProgram || ''),
        escapeCSV(user.socioeconomic?.householdSize || ''),
        escapeCSV(user.socioeconomic?.peopleWithIncome || ''),
        
        // Conclusão
        escapeCSV(user.completion?.howFoundUs || ''),
        escapeCSV(user.completion?.customHowFoundUs || ''),
        escapeCSV(user.completion?.acceptsTerms || ''),
        escapeCSV(user.completion?.acceptsDataUsage || ''),
        
        // Progresso Discovery
        escapeCSV(user.discoveryProgress?.resume || ''),
        escapeCSV(user.discoveryProgress?.completedLevels?.join('; ') || ''),
        escapeCSV(user.discoveryProgress?.answers?.length || 0)
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Salvar arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `usuarios_export_${timestamp}.csv`;
    const filePath = path.join(process.cwd(), filename);
    
    fs.writeFileSync(filePath, csvContent, 'utf8');
    
    console.log(`✅ Arquivo CSV criado com sucesso!`);
    console.log(`📁 Localização: ${filePath}`);
    console.log(`📊 Total de usuários exportados: ${users.length}`);
    console.log(`📝 Total de colunas: ${headers.length}`);
    
    // Mostrar estatísticas rápidas
    console.log(`\n📈 ESTATÍSTICAS RÁPIDAS:`);
    console.log(`• Tamanho do arquivo: ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`• Usuários com interesses: ${users.filter(u => u.interests).length}`);
    console.log(`• Usuários com educação: ${users.filter(u => u.education).length}`);
    console.log(`• Usuários com progresso Discovery: ${users.filter(u => u.discoveryProgress?.completedLevels?.length > 0).length}`);
    console.log(`• Usuários com resumo: ${users.filter(u => u.discoveryProgress?.resume).length}`);
    
  } catch (error) {
    console.error('❌ Erro ao exportar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exportUsersToCSV();
