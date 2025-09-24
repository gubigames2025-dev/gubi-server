import { EmailFactory } from '../factory/email.factory';
import { SendGridProvider } from '../providers/sendgrid.provider';
import { 
  EnhancedSendEmailParams, 
  EmailCategory,
  SendEmailParams 
} from '../providers/email.interface';

/**
 * Função principal para envio de emails categorizados
 * Usa SendGrid com categorias quando disponível, fallback para Nodemailer
 */
export async function sendCategorizedEmail({
  toEmail,
  toName,
  subject,
  htmlContent,
  category = EmailCategory.NOTIFICATION,
  trackingEnabled = true,
}: EnhancedSendEmailParams): Promise<void> {
  try {
    // Tentar com SendGrid primeiro para aproveitar categorias
    const { provider, providerName } = await EmailFactory.createProviderWithValidation('sendgrid');
    
    if (provider instanceof SendGridProvider) {
      // Usar método específico do SendGrid com categorias
      const result = await provider.sendEnhancedEmail({
        toEmail,
        toName,
        subject,
        htmlContent,
        category,
        trackingEnabled,
      });
      
      if (result.success) {
        console.log(`Categorized email sent via ${providerName}:`, {
          messageId: result.messageId,
          category,
          to: toEmail,
        });
        return;
      }
      
      throw new Error(result.error || 'SendGrid failed');
    }
    
    // Fallback para método padrão (sem categorias)
    const result = await provider.sendEmail({ toEmail, toName, subject, htmlContent });
    
    if (result.success) {
      console.log(`Email sent via ${providerName} (fallback, no categories):`, {
        messageId: result.messageId,
        to: toEmail,
      });
      return;
    }
    
    throw new Error(result.error || 'All providers failed');
    
  } catch (error: any) {
    console.error(`Categorized email sending failed:`, {
      error: error.message,
      category,
      to: toEmail,
    });
    throw error;
  }
}

/**
 * Função para envio de email de boas-vindas
 */
export async function sendWelcomeEmail(params: SendEmailParams): Promise<void> {
  return sendCategorizedEmail({
    ...params,
    category: EmailCategory.WELCOME,
    trackingEnabled: true,
  });
}

/**
 * Função para envio de email de recuperação de senha
 */
export async function sendPasswordRecoveryEmail(params: SendEmailParams): Promise<void> {
  return sendCategorizedEmail({
    ...params,
    category: EmailCategory.PASSWORD_RECOVERY,
    trackingEnabled: true,
  });
}

/**
 * Função para envio de relatório do Discovery
 */
export async function sendResumeDeliveryEmail(params: SendEmailParams): Promise<void> {
  return sendCategorizedEmail({
    ...params,
    category: EmailCategory.RESUME_DELIVERY,
    trackingEnabled: true,
  });
}

/**
 * Função para envio de notificações gerais
 */
export async function sendNotificationEmail(params: SendEmailParams): Promise<void> {
  return sendCategorizedEmail({
    ...params,
    category: EmailCategory.NOTIFICATION,
    trackingEnabled: false, // Notificações geralmente não precisam de tracking
  });
}

// Re-export das interfaces e enums para facilitar importação
export { EmailCategory } from '../providers/email.interface';
export type { SendEmailParams, EnhancedSendEmailParams } from '../providers/email.interface';