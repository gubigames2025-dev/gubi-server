#!/usr/bin/env node

/**
 * Script para testar o sistema de email do Gubi Discovery
 * 
 * Uso:
 * npm run test:email -- --email=seu@email.com --name="Seu Nome" --type=basic
 * 
 * Ou diretamente:
 * node test-email.mjs --email=seu@email.com --name="Seu Nome" --type=all
 */

import { config } from 'dotenv';
import { EmailFactory } from './src/utils/email/factory/email.factory.js';
import { 
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
  sendResumeDeliveryEmail,
  sendNotificationEmail 
} from './src/utils/email/templates/email.utils.js';
import { wrapEmail, registerEmailBody, passwordRecoveryEmailBody, resumeEmailBody } from './src/utils/emailTemplates.js';

// Carregar variáveis de ambiente
config();

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value;
    }
  });
  return args;
}

function showHelp() {
  console.log(`
🧪 Script de Teste do Sistema de Email - Gubi Discovery

Uso:
  node test-email.mjs --email=SEU_EMAIL --name="SEU_NOME" [--type=TIPO_TESTE]

Parâmetros:
  --email     Email para onde enviar os testes (obrigatório)
  --name      Nome do destinatário (obrigatório)
  --type      Tipo de teste (opcional, padrão: basic)

Tipos de teste disponíveis:
  basic       - Teste básico de email
  welcome     - Email de boas-vindas
  recovery    - Email de recuperação de senha
  resume      - Email de entrega de relatório
  notification- Email de notificação
  all         - Todos os testes acima
  providers   - Verificar status dos provedores

Exemplos:
  node test-email.mjs --email=teste@gmail.com --name="João Silva"
  node test-email.mjs --email=teste@gmail.com --name="Maria" --type=all
  node test-email.mjs --type=providers

Variáveis de ambiente necessárias:
  EMAIL_PROVIDER=sendgrid
  SENDGRID_API_KEY=SG.sua_api_key
  SENDGRID_FROM_EMAIL=contato@gubi.com.br
  SENDGRID_FROM_NAME=Gubi Discovery
`);
}

function checkProviders() {
  console.log('\n📋 Status dos Provedores de Email:\n');
  
  const sendgridConfigured = !!process.env.SENDGRID_API_KEY;
  const nodemailerConfigured = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
  
  console.log(`📤 SendGrid:`);
  console.log(`   Configurado: ${sendgridConfigured ? '✅ Sim' : '❌ Não'}`);
  console.log(`   API Key: ${process.env.SENDGRID_API_KEY ? '✅ Definida' : '❌ Não definida'}`);
  console.log(`   From Email: ${process.env.SENDGRID_FROM_EMAIL || '❌ Não definido'}`);
  console.log(`   From Name: ${process.env.SENDGRID_FROM_NAME || '❌ Não definido'}`);
  
  console.log(`\n📧 Nodemailer (Fallback):`);
  console.log(`   Configurado: ${nodemailerConfigured ? '✅ Sim' : '❌ Não'}`);
  console.log(`   Host: ${process.env.SMTP_HOST || '❌ Não definido'}`);
  console.log(`   Port: ${process.env.SMTP_PORT || '❌ Não definido'}`);
  console.log(`   User: ${process.env.SMTP_USER || '❌ Não definido'}`);
  
  console.log(`\n⚙️ Configuração Atual:`);
  console.log(`   Provider Principal: ${process.env.EMAIL_PROVIDER || 'sendgrid (padrão)'}`);
  
  console.log(`\n🎯 Recomendação:`);
  if (sendgridConfigured) {
    console.log(`   ✅ Sistema configurado corretamente`);
  } else if (nodemailerConfigured) {
    console.log(`   ⚠️ Apenas fallback configurado - configure SendGrid`);
  } else {
    console.log(`   ❌ Nenhum provider configurado`);
  }
  
  return { sendgridConfigured, nodemailerConfigured };
}

async function runTest(email, name, testType) {
  console.log(`\n🚀 Iniciando teste: ${testType}`);
  console.log(`📧 Destinatário: ${name} <${email}>\n`);

  const results = [];

  try {
    if (testType === 'basic' || testType === 'all') {
      console.log('🧪 Executando teste básico...');
      try {
        const { EmailFactory } = await import('./src/utils/email/factory/email.factory.js');
        const { provider, providerName } = await EmailFactory.createProviderWithValidation();
        
        const result = await provider.sendEmail({
          toEmail: email,
          toName: name,
          subject: "✅ Teste Básico - Sistema de Email Gubi",
          htmlContent: `
            <h2>🎉 Teste Básico Concluído!</h2>
            <p>Olá <strong>${name}</strong>,</p>
            <p>Este é um teste do sistema básico de email do Gubi Discovery.</p>
            <p><strong>Provider utilizado:</strong> ${providerName}</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <br>
            <p>✅ <em>Se você recebeu este email, o sistema está funcionando corretamente!</em></p>
          `
        });
        
        results.push({ 
          test: 'basic', 
          status: result.success ? 'success' : 'error', 
          message: result.success ? `Email enviado via ${providerName}` : result.error 
        });
        
        if (result.success) {
          console.log(`   ✅ Sucesso - MessageID: ${result.messageId}`);
        } else {
          console.log(`   ❌ Falha: ${result.error}`);
        }
      } catch (error) {
        results.push({ test: 'basic', status: 'error', message: error.message });
        console.log(`   ❌ Erro: ${error.message}`);
      }
    }

    // Mais testes podem ser adicionados aqui seguindo o mesmo padrão

    console.log(`\n📊 Resultado dos Testes:`);
    console.log(`   Total: ${results.length}`);
    console.log(`   Sucessos: ${results.filter(r => r.status === 'success').length}`);
    console.log(`   Falhas: ${results.filter(r => r.status === 'error').length}`);
    
    return results;
    
  } catch (error) {
    console.error(`❌ Erro geral: ${error.message}`);
    return [];
  }
}

async function main() {
  const args = parseArgs();
  
  console.log('🧪 Sistema de Teste de Email - Gubi Discovery');
  console.log('=============================================');
  
  // Verificar se é apenas para checar providers
  if (args.type === 'providers') {
    checkProviders();
    return;
  }
  
  // Validar argumentos obrigatórios
  if (!args.email || !args.name) {
    console.log('❌ Email e nome são obrigatórios!\n');
    showHelp();
    process.exit(1);
  }
  
  const email = args.email;
  const name = args.name;
  const testType = args.type || 'basic';
  
  // Verificar providers antes dos testes
  console.log('\n📋 Verificando configuração dos providers...');
  const { sendgridConfigured, nodemailerConfigured } = checkProviders();
  
  if (!sendgridConfigured && !nodemailerConfigured) {
    console.log('\n❌ Nenhum provider está configurado! Configure pelo menos um.');
    process.exit(1);
  }
  
  // Executar testes
  const results = await runTest(email, name, testType);
  
  // Resultado final
  if (results.some(r => r.status === 'success')) {
    console.log('\n🎉 Pelo menos um teste passou! Sistema funcionando.');
    process.exit(0);
  } else {
    console.log('\n❌ Todos os testes falharam. Verifique a configuração.');
    process.exit(1);
  }
}

// Executar apenas se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}