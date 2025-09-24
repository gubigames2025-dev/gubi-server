import { Request, Response } from "express";
import sendEmail from "../utils/sendEmail";
import { 
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
  sendResumeDeliveryEmail,
  sendNotificationEmail 
} from "../utils/email/templates/email.utils";
import { wrapEmail, registerEmailBody, passwordRecoveryEmailBody, resumeEmailBody } from "../utils/emailTemplates";

export const testEmailSystem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, name, testType = 'basic' } = req.body;

    if (!email || !name) {
      return res.status(400).json({ 
        error: "Email e nome são obrigatórios para teste",
        example: {
          email: "seu@email.com",
          name: "Seu Nome",
          testType: "basic|welcome|recovery|resume|notification|all"
        }
      });
    }

    const testResults = [];

    if (testType === 'basic' || testType === 'all') {
      console.log('🧪 Testando email básico...');
      try {
        await sendEmail({
          toEmail: email,
          toName: name,
          subject: "✅ Teste Básico - Sistema de Email Gubi",
          htmlContent: `
            <h2>🎉 Teste Básico Concluído!</h2>
            <p>Olá <strong>${name}</strong>,</p>
            <p>Este é um teste do sistema básico de email do Gubi Discovery.</p>
            <p><strong>Provider utilizado:</strong> SendGrid com fallback para Nodemailer</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <br>
            <p>✅ <em>Se você recebeu este email, o sistema está funcionando corretamente!</em></p>
          `
        });
        testResults.push({ test: 'basic', status: 'success', message: 'Email básico enviado com sucesso' });
      } catch (error: any) {
        testResults.push({ test: 'basic', status: 'error', message: error.message });
      }
    }

    if (testType === 'welcome' || testType === 'all') {
      console.log('🧪 Testando email de boas-vindas...');
      try {
        const bodyHtml = registerEmailBody(name);
        const htmlContent = wrapEmail("Bem-vindo ao Jornada ProFuturo!", bodyHtml);
        
        await sendWelcomeEmail({
          toEmail: email,
          toName: name,
          subject: "✅ Teste - Bem-vindo ao Jornada ProFuturo!",
          htmlContent
        });
        testResults.push({ test: 'welcome', status: 'success', message: 'Email de boas-vindas enviado com sucesso' });
      } catch (error: any) {
        testResults.push({ test: 'welcome', status: 'error', message: error.message });
      }
    }

    if (testType === 'recovery' || testType === 'all') {
      console.log('🧪 Testando email de recuperação de senha...');
      try {
        const testCode = '123456';
        const bodyHtml = passwordRecoveryEmailBody(name, testCode);
        const htmlContent = wrapEmail("Recuperação de senha", bodyHtml);
        
        await sendPasswordRecoveryEmail({
          toEmail: email,
          toName: name,
          subject: "✅ Teste - Código de recuperação de senha",
          htmlContent
        });
        testResults.push({ test: 'recovery', status: 'success', message: 'Email de recuperação enviado com sucesso' });
      } catch (error: any) {
        testResults.push({ test: 'recovery', status: 'error', message: error.message });
      }
    }

    if (testType === 'resume' || testType === 'all') {
      console.log('🧪 Testando email de entrega de relatório...');
      try {
        const testFileUrl = 'https://old.gubi.com.br/resume/1.pdf';
        const bodyHtml = resumeEmailBody(name, testFileUrl);
        const htmlContent = wrapEmail("Relatório", bodyHtml);
        
        await sendResumeDeliveryEmail({
          toEmail: email,
          toName: name,
          subject: "✅ Teste - Seu relatório está pronto!",
          htmlContent
        });
        testResults.push({ test: 'resume', status: 'success', message: 'Email de relatório enviado com sucesso' });
      } catch (error: any) {
        testResults.push({ test: 'resume', status: 'error', message: error.message });
      }
    }

    if (testType === 'notification' || testType === 'all') {
      console.log('🧪 Testando email de notificação...');
      try {
        await sendNotificationEmail({
          toEmail: email,
          toName: name,
          subject: "✅ Teste - Notificação Geral",
          htmlContent: `
            <h2>🔔 Notificação de Teste</h2>
            <p>Olá <strong>${name}</strong>,</p>
            <p>Esta é uma notificação de teste do sistema Gubi Discovery.</p>
            <p><strong>Tipo:</strong> Notificação Geral (sem tracking)</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          `
        });
        testResults.push({ test: 'notification', status: 'success', message: 'Email de notificação enviado com sucesso' });
      } catch (error: any) {
        testResults.push({ test: 'notification', status: 'error', message: error.message });
      }
    }

    // Calcular estatísticas
    const totalTests = testResults.length;
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;

    return res.status(200).json({
      message: "Testes de email concluídos",
      summary: {
        total: totalTests,
        success: successCount,
        errors: errorCount,
        successRate: `${Math.round((successCount / totalTests) * 100)}%`
      },
      results: testResults,
      timestamp: new Date().toISOString(),
      testType
    });

  } catch (error: any) {
    console.error('❌ Erro geral no teste de email:', error);
    return res.status(500).json({ 
      error: "Erro interno do servidor durante teste de email",
      details: error.message 
    });
  }
};

export const checkEmailProviders = async (req: Request, res: Response): Promise<any> => {
  try {
    const providers = {
      sendgrid: {
        configured: !!process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL || 'Not configured',
        fromName: process.env.SENDGRID_FROM_NAME || 'Not configured'
      },
      nodemailer: {
        configured: !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS,
        host: process.env.SMTP_HOST || 'Not configured',
        port: process.env.SMTP_PORT || 'Not configured',
        user: process.env.SMTP_USER || 'Not configured'
      },
      current: process.env.EMAIL_PROVIDER || 'sendgrid'
    };

    return res.status(200).json({
      message: "Status dos provedores de email",
      providers,
      recommendations: {
        sendgrid: providers.sendgrid.configured ? "✅ Configurado" : "❌ Configure SENDGRID_API_KEY",
        nodemailer: providers.nodemailer.configured ? "✅ Configurado" : "⚠️ Fallback não configurado",
        overall: providers.sendgrid.configured ? "✅ Sistema OK" : providers.nodemailer.configured ? "⚠️ Apenas fallback" : "❌ Nenhum provider configurado"
      }
    });

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Erro ao verificar provedores",
      details: error.message 
    });
  }
};