import * as dotenv from 'dotenv';
import { EmailFactory } from './src/utils/email/factory/email.factory';

// Carregar variáveis de ambiente (.env.local tem prioridade)
dotenv.config({ path: ['.env.local', '.env'] });

async function testEmailProviders() {
  console.log('🧪 Testando Provedores de Email\n');
  
  // Verificar configuração
  console.log('📋 Configuração atual:');
  console.log(`   EMAIL_PROVIDER: ${process.env.EMAIL_PROVIDER || 'sendgrid (padrão)'}`);
  console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`   SENDGRID_API_KEY (valor): ${process.env.SENDGRID_API_KEY || 'vazio'}`);
  console.log(`   SENDGRID_FROM_EMAIL: ${process.env.SENDGRID_FROM_EMAIL || '❌ Não configurado'}`);
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || '❌ Não configurado'}\n`);

  // Teste 1: Verificar criação do provider
  try {
    console.log('🔍 Teste 1: Criando provider...');
    const { provider, providerName } = await EmailFactory.createProviderWithValidation();
    console.log(`   ✅ Provider criado: ${providerName}\n`);

    // Teste 2: Enviar email de teste (apenas se houver argumentos)
    const email = process.argv[2];
    const name = process.argv[3] || 'Teste';

    if (email) {
      console.log(`🚀 Teste 2: Enviando email de teste para ${name} <${email}>`);
      
      const result = await provider.sendEmail({
        toEmail: email,
        toName: name,
        subject: "✅ Teste do Sistema de Email - Gubi Discovery",
        htmlContent: `
          <h2>🎉 Sistema de Email Funcionando!</h2>
          <p>Olá <strong>${name}</strong>,</p>
          <p>Este é um teste do novo sistema de email do Gubi Discovery.</p>
          <hr>
          <p><strong>Provider utilizado:</strong> ${providerName}</p>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
          <hr>
          <p>✅ <em>Se você recebeu este email, o sistema está funcionando perfeitamente!</em></p>
          <br>
          <small>Este é um email de teste automático do sistema Gubi Discovery.</small>
        `
      });

      if (result.success) {
        console.log(`   ✅ Email enviado com sucesso!`);
        console.log(`   📧 Message ID: ${result.messageId}`);
        console.log(`   📤 Provider: ${providerName}`);
      } else {
        console.log(`   ❌ Falha no envio: ${result.error}`);
      }
    } else {
      console.log('ℹ️  Para testar o envio, execute: npm run test:email:simple SEU_EMAIL "Seu Nome"');
    }

  } catch (error: any) {
    console.error('❌ Erro durante o teste:', error.message);
    return false;
  }

  return true;
}

// Executar teste
testEmailProviders()
  .then(success => {
    console.log('\n🏁 Teste concluído:', success ? '✅ Sucesso' : '❌ Falha');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  });