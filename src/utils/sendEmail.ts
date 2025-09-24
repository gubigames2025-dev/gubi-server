import { EmailFactory } from './email/factory/email.factory';
import { SendEmailParams } from './email/providers/email.interface';

export default async function sendEmail({ toEmail, toName, subject, htmlContent }: SendEmailParams): Promise<void> {
  try {
    // Tentar enviar com o provider principal (SendGrid por padrão)
    const { provider: primaryProvider, providerName: primaryName } = await EmailFactory.createProviderWithValidation();
    const primaryResult = await primaryProvider.sendEmail({ toEmail, toName, subject, htmlContent });
    
    if (primaryResult.success) {
      console.log(`Email sent successfully via ${primaryName}:`, {
        messageId: primaryResult.messageId,
        to: toEmail,
        subject: subject.substring(0, 50) + '...'
      });
      return;
    }
    
    // Se falhar, tentar com fallback (Nodemailer)
    console.warn(`${primaryName} failed, trying fallback provider:`, primaryResult.error);
    const { provider: fallbackProvider, providerName: fallbackName } = await EmailFactory.createProviderWithValidation('nodemailer');
    const fallbackResult = await fallbackProvider.sendEmail({ toEmail, toName, subject, htmlContent });
    
    if (fallbackResult.success) {
      console.log(`Email sent successfully via ${fallbackName} (fallback):`, {
        messageId: fallbackResult.messageId,
        to: toEmail,
        subject: subject.substring(0, 50) + '...'
      });
      return;
    }
    
    // Se ambos falharem, logar erro crítico
    const errorMessage = `All email providers failed. ${primaryName}: ${primaryResult.error}, ${fallbackName}: ${fallbackResult.error}`;
    throw new Error(errorMessage);
    
  } catch (error: any) {
    console.error('Email sending failed completely:', {
      error: error.message,
      to: toEmail,
      subject: subject.substring(0, 50) + '...',
      timestamp: new Date().toISOString(),
    });
    
    // Em produção, você pode querer implementar uma fila para retry
    // ou notificar um sistema de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implementar sistema de retry ou notificação
      console.error('CRITICAL: Email delivery failure in production', {
        to: toEmail,
        subject,
        error: error.message,
      });
    }
    
    // Re-throw error para que o caller possa decidir como lidar
    throw error;
  }
}