import { EmailProvider, EmailProviderType } from '../providers/email.interface';
import { SendGridProvider } from '../providers/sendgrid.provider';
import { NodemailerProvider } from '../providers/nodemailer.provider';

export class EmailFactory {
  static createProvider(type?: EmailProviderType): EmailProvider {
    const providerType = type || (process.env.EMAIL_PROVIDER as EmailProviderType) || 'sendgrid';
    
    switch (providerType) {
      case 'sendgrid':
        try {
          return new SendGridProvider();
        } catch (error: any) {
          console.warn('SendGrid not configured, falling back to Nodemailer:', error.message);
          return new NodemailerProvider();
        }
      case 'nodemailer':
        return new NodemailerProvider();
      default:
        console.warn(`Unsupported email provider: ${providerType}, falling back to Nodemailer`);
        return new NodemailerProvider();
    }
  }

  static async createProviderWithValidation(type?: EmailProviderType): Promise<{
    provider: EmailProvider;
    providerName: string;
  }> {
    const providerType = type || (process.env.EMAIL_PROVIDER as EmailProviderType) || 'sendgrid';
    
    // Tentar SendGrid primeiro se não for especificado outro provider
    if (providerType === 'sendgrid' || !type) {
      try {
        const sendGridProvider = new SendGridProvider();
        return {
          provider: sendGridProvider,
          providerName: 'SendGrid',
        };
      } catch (error: any) {
        console.warn('SendGrid not available, using Nodemailer:', error.message);
      }
    }
    
    // Fallback para Nodemailer
    return {
      provider: new NodemailerProvider(),
      providerName: 'Nodemailer',
    };
  }
}