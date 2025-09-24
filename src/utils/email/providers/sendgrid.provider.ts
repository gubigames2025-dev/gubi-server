import sgMail from '@sendgrid/mail';
import { 
  EmailProvider, 
  SendEmailParams, 
  EmailResult, 
  EnhancedSendEmailParams, 
  EmailCategory 
} from './email.interface';

export class SendGridProvider implements EmailProvider {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is required');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail({ toEmail, toName, subject, htmlContent }: SendEmailParams): Promise<EmailResult> {
    return this.sendEnhancedEmail({
      toEmail,
      toName,
      subject,
      htmlContent,
      category: EmailCategory.NOTIFICATION,
      trackingEnabled: true,
    });
  }

  async sendEnhancedEmail({
    toEmail,
    toName,
    subject,
    htmlContent,
    category = EmailCategory.NOTIFICATION,
    trackingEnabled = true,
  }: EnhancedSendEmailParams): Promise<EmailResult> {
    try {
      const msg = {
        to: {
          email: toEmail,
          name: toName,
        },
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'contato@gubi.com.br',
          name: process.env.SENDGRID_FROM_NAME || 'Gubi Discovery',
        },
        subject,
        html: htmlContent,
        // Adicionar categorias para analytics
        categories: ['gubi-discovery', category],
        // Habilitar tracking se solicitado
        trackingSettings: {
          clickTracking: {
            enable: trackingEnabled,
            enableText: false,
          },
          openTracking: {
            enable: trackingEnabled,
          },
          subscriptionTracking: {
            enable: false, // Desabilitado para emails transacionais
          },
        },
        // Adicionar custom args para tracking interno
        customArgs: {
          category,
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString(),
        },
      };

      const [response] = await sgMail.send(msg);
      
      const messageId = response.headers['x-message-id'] as string;
      console.log(`SendGrid email sent successfully:`, {
        messageId,
        category,
        to: toEmail,
        statusCode: response.statusCode,
      });
      
      return {
        success: true,
        messageId,
      };
    } catch (error: any) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('SendGrid error:', {
        error: errorMessage,
        category,
        to: toEmail,
        statusCode: error.code,
      });
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private extractErrorMessage(error: any): string {
    // SendGrid pode retornar diferentes formatos de erro
    if (error.response?.body?.errors?.[0]?.message) {
      return error.response.body.errors[0].message;
    }
    
    if (error.response?.body?.error) {
      return error.response.body.error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Unknown SendGrid error';
  }
}