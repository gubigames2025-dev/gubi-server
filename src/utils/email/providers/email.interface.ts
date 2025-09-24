export interface SendEmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<EmailResult>;
}

export type EmailProviderType = 'sendgrid' | 'nodemailer';

export enum EmailCategory {
  WELCOME = 'welcome',
  PASSWORD_RECOVERY = 'password-recovery',
  RESUME_DELIVERY = 'resume-delivery',
  NOTIFICATION = 'notification',
}

export interface EnhancedSendEmailParams extends SendEmailParams {
  category?: EmailCategory;
  trackingEnabled?: boolean;
}